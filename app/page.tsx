"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { FastingTimer } from "@/components/fasting-timer"
import { CircularGauge } from "@/components/circular-gauge"
import { MetricCard } from "@/components/metric-card"
import { DoseCard, DoseInline, NoDoses } from "@/components/dose-card"
import { TimingBadge } from "@/components/timing-badge"
import { Weight, Heart, AlertCircle, Check, Calendar, ChevronRight } from "lucide-react"
import { getProtocols, getDoseLogs, markDoseAsTaken, getFastingStart, saveFastingStart } from "@/lib/storage"
import { getDosesToday, getOverdueDoses, getWeeklySchedule } from "@/lib/scheduling"
import { getPeptideById } from "@/lib/peptides"
import type { Protocol, DoseLog, ScheduledDose, DaySchedule } from "@/lib/types"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function DashboardPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([])
  const [dueTodayDoses, setDueTodayDoses] = useState<ScheduledDose[]>([])
  const [overdueDoses, setOverdueDoses] = useState<ScheduledDose[]>([])
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([])
  const [fastingStart, setFastingStart] = useState<Date | null>(null)

  const loadData = useCallback(() => {
    const prots = getProtocols()
    const logs = getDoseLogs()
    setProtocols(prots)
    setDoseLogs(logs)
    setDueTodayDoses(getDosesToday(prots, logs))
    setOverdueDoses(getOverdueDoses(prots, logs))
    setWeeklySchedule(getWeeklySchedule(prots, logs))

    const savedFastingStart = getFastingStart()
    setFastingStart(savedFastingStart)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleMarkTaken = (dose: ScheduledDose) => {
    const protocol = protocols.find(p => p.id === dose.protocolId)
    if (!protocol) return

    markDoseAsTaken(
      dose.protocolId,
      dose.scheduledDate,
      dose.doseNumber,
      dose.peptideName,
      dose.dose
    )
    loadData()
  }

  const handleStartFasting = () => {
    const now = new Date()
    saveFastingStart(now)
    setFastingStart(now)
  }

  // Calculate stats
  const pendingToday = dueTodayDoses.filter(d => d.status === 'pending').length
  const completedToday = dueTodayDoses.filter(d => d.status === 'taken').length
  const totalToday = dueTodayDoses.length

  // Get protocols that require fasting
  const fastingRequiredProtocols = protocols
    .filter(p => p.status === 'active' && p.timingPreference === 'morning-fasted')
    .map(p => {
      const peptide = getPeptideById(p.peptideId)
      return p.customPeptideName || peptide?.name || 'Unknown'
    })

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-balance mb-2">Good morning, Troy</h1>
            <p className="text-muted-foreground text-lg">Track your health metrics and peptide protocols</p>
          </div>

          {/* Overdue Section - Alert Style */}
          {overdueDoses.length > 0 && (
            <div className="mb-6 rounded-2xl border-2 border-red-500/50 bg-red-500/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-semibold text-red-500">Overdue Doses</h2>
                <span className="ml-auto text-sm text-red-500">{overdueDoses.length} missed</span>
              </div>
              <div className="space-y-2">
                {overdueDoses.slice(0, 3).map((dose, idx) => (
                  <DoseInline
                    key={`${dose.protocolId}-${dose.scheduledDate}-${dose.doseNumber}-${idx}`}
                    dose={dose}
                    onMarkTaken={() => handleMarkTaken(dose)}
                  />
                ))}
                {overdueDoses.length > 3 && (
                  <p className="text-sm text-red-500 mt-2">
                    +{overdueDoses.length - 3} more overdue doses
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid gap-6 mb-6 lg:grid-cols-3">
            {/* Due Today Section - Left Column */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Due Today</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">{completedToday} done</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{totalToday} total</span>
                </div>
              </div>

              {dueTodayDoses.length === 0 ? (
                <NoDoses message="No doses scheduled for today" />
              ) : (
                <div className="space-y-3">
                  {dueTodayDoses.map((dose, idx) => (
                    <DoseCard
                      key={`${dose.protocolId}-${dose.doseNumber}-${idx}`}
                      dose={dose}
                      onMarkTaken={dose.status === 'pending' ? () => handleMarkTaken(dose) : undefined}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Fasting Timer - Right Column */}
            <div className="space-y-6">
              <FastingTimer
                fastingStartTime={fastingStart || new Date(Date.now() - 2 * 60 * 60 * 1000)}
                targetHours={16}
                fastingRequiredPeptides={fastingRequiredProtocols}
                onStartFasting={handleStartFasting}
              />

              {/* Protocol Compliance Gauge */}
              <div className="rounded-2xl bg-card p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Protocol</p>
                    <h3 className="text-lg font-semibold">This Week</h3>
                  </div>
                </div>
                <div className="flex justify-center">
                  <CircularGauge
                    value={completedToday}
                    max={Math.max(totalToday, 1)}
                    label="Today"
                    color="#14b8a6"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="rounded-2xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Weekly Overview
              </h2>
              <Link
                href="/calendar"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View Calendar
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weeklySchedule.map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    "rounded-lg p-3 text-center transition-all",
                    day.isToday && "bg-primary/10 ring-2 ring-primary/30",
                    !day.isToday && "bg-muted/50"
                  )}
                >
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                    {day.dayOfWeek.slice(0, 3)}
                  </p>
                  <p className={cn(
                    "text-lg font-semibold mb-2",
                    day.isToday && "text-primary"
                  )}>
                    {new Date(day.date).getDate()}
                  </p>
                  {day.doses.length > 0 ? (
                    <div className="space-y-1">
                      {day.doses.slice(0, 3).map((dose, idx) => (
                        <div
                          key={`${dose.protocolId}-${dose.doseNumber}-${idx}`}
                          className={cn(
                            "h-1.5 rounded-full",
                            dose.status === 'taken' && "bg-green-500",
                            dose.status === 'pending' && "bg-primary",
                            dose.status === 'overdue' && "bg-red-500",
                            dose.status === 'skipped' && "bg-muted-foreground"
                          )}
                          title={`${dose.peptideName} - ${dose.status}`}
                        />
                      ))}
                      {day.doses.length > 3 && (
                        <p className="text-xs text-muted-foreground">+{day.doses.length - 3}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">-</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row - metrics */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Weight"
              value={185.2}
              unit="lbs"
              icon={Weight}
              status="success"
              trend={{ value: 2.3, direction: "down" }}
            />
            <MetricCard
              label="HRV"
              value={62}
              unit="ms"
              icon={Heart}
              status="success"
              trend={{ value: 8, direction: "up" }}
            />
            <div className="rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] p-5 text-white">
              <p className="text-sm font-medium opacity-90 mb-1">Water</p>
              <h3 className="text-2xl font-semibold">3 glasses</h3>
              <p className="text-xs opacity-75 mt-1">24 oz today</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] p-5 text-white">
              <p className="text-sm font-medium opacity-90 mb-1">Sleep</p>
              <h3 className="text-2xl font-semibold">8 hours</h3>
              <p className="text-xs opacity-75 mt-1">Score: 87</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
