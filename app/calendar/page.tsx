"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Check, X, AlertCircle } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { CalendarLegend } from "@/components/calendar-legend"
import { DoseCard, NoDoses } from "@/components/dose-card"
import { cn } from "@/lib/utils"
import { getProtocols, getDoseLogs, markDoseAsTaken, markDoseAsSkipped } from "@/lib/storage"
import { getUpcomingDoses } from "@/lib/scheduling"
import type { Protocol, DoseLog, ScheduledDose } from "@/lib/types"

interface CalendarDay {
  date: Date
  dateStr: string
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  isPast: boolean
  doses: ScheduledDose[]
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])

  const loadData = useCallback(() => {
    setProtocols(getProtocols())
    setDoseLogs(getDoseLogs())
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Generate calendar when currentDate or data changes
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startingDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    // Get all doses for this month (plus some buffer)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    // Calculate days from today to end of month for upcoming doses
    const daysToEndOfMonth = Math.ceil((monthEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const allDoses = getUpcomingDoses(protocols, doseLogs, Math.max(daysToEndOfMonth + 7, 45))

    const days: CalendarDay[] = []

    // Previous month days
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - i)
      const dateStr = date.toISOString().split('T')[0]
      days.push({
        date,
        dateStr,
        dayOfMonth: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        isPast: date < today,
        doses: allDoses.filter(d => d.scheduledDate === dateStr),
      })
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum)
      const dateStr = date.toISOString().split('T')[0]
      days.push({
        date,
        dateStr,
        dayOfMonth: dayNum,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isPast: date < today,
        doses: allDoses.filter(d => d.scheduledDate === dateStr),
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let dayNum = 1; dayNum <= remainingDays; dayNum++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, dayNum)
      const dateStr = date.toISOString().split('T')[0]
      days.push({
        date,
        dateStr,
        dayOfMonth: dayNum,
        isCurrentMonth: false,
        isToday: false,
        isPast: date < today,
        doses: allDoses.filter(d => d.scheduledDate === dateStr),
      })
    }

    setCalendarDays(days)

    // Select today by default if no date selected
    if (!selectedDate) {
      setSelectedDate(todayStr)
    }
  }, [currentDate, protocols, doseLogs, selectedDate])

  const handleMarkTaken = (dose: ScheduledDose) => {
    markDoseAsTaken(
      dose.protocolId,
      dose.scheduledDate,
      dose.doseNumber,
      dose.peptideName,
      dose.dose
    )
    loadData()
  }

  const handleMarkSkipped = (dose: ScheduledDose) => {
    markDoseAsSkipped(
      dose.protocolId,
      dose.scheduledDate,
      dose.doseNumber,
      dose.peptideName,
      dose.dose
    )
    loadData()
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(today.toISOString().split('T')[0])
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Get selected day's doses
  const selectedDayDoses = selectedDate
    ? calendarDays.find(d => d.dateStr === selectedDate)?.doses || []
    : []

  const selectedDateObj = selectedDate ? new Date(selectedDate) : null
  const selectedDateFormatted = selectedDateObj
    ? selectedDateObj.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })
    : ''

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-balance">Calendar</h1>
            <p className="text-muted-foreground mt-1">View your schedule and track all doses</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Calendar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{monthName}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevMonth}
                      className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={goToToday}
                      className="px-3 py-1.5 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const totalDoses = day.doses.length

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(day.dateStr)}
                        className={cn(
                          "min-h-[70px] rounded-lg border p-2 text-left transition-all",
                          day.isCurrentMonth
                            ? "border-border bg-card hover:border-primary/50"
                            : "border-transparent bg-muted/30 opacity-50",
                          day.isToday && "border-primary bg-primary/10",
                          selectedDate === day.dateStr && "ring-2 ring-primary/50 border-primary"
                        )}
                      >
                        <div className={cn(
                          "text-sm font-medium mb-1",
                          day.isToday && "text-primary"
                        )}>
                          {day.dayOfMonth}
                        </div>

                        {totalDoses > 0 && (
                          <div className="space-y-0.5">
                            {day.doses.slice(0, 3).map((dose, i) => (
                              <div
                                key={`${dose.protocolId}-${dose.doseNumber}-${i}`}
                                className={cn(
                                  "h-1 rounded-full",
                                  dose.status === 'taken' && "bg-green-500",
                                  dose.status === 'pending' && "bg-primary",
                                  dose.status === 'overdue' && "bg-red-500",
                                  dose.status === 'skipped' && "bg-muted-foreground"
                                )}
                              />
                            ))}
                            {totalDoses > 3 && (
                              <p className="text-[10px] text-muted-foreground">+{totalDoses - 3}</p>
                            )}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <CalendarLegend />
            </div>

            {/* Selected Day Details */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold mb-1">{selectedDateFormatted}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedDayDoses.length} dose{selectedDayDoses.length !== 1 ? 's' : ''} scheduled
              </p>

              {selectedDayDoses.length === 0 ? (
                <NoDoses message="No doses scheduled for this day" />
              ) : (
                <div className="space-y-3">
                  {selectedDayDoses.map((dose, idx) => (
                    <DoseCard
                      key={`${dose.protocolId}-${dose.doseNumber}-${idx}`}
                      dose={dose}
                      onMarkTaken={
                        dose.status === 'pending' || dose.status === 'overdue'
                          ? () => handleMarkTaken(dose)
                          : undefined
                      }
                      onMarkSkipped={
                        dose.status === 'pending' || dose.status === 'overdue'
                          ? () => handleMarkSkipped(dose)
                          : undefined
                      }
                      compact
                    />
                  ))}
                </div>
              )}

              {/* Summary stats */}
              {selectedDayDoses.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                        <Check className="h-3 w-3" />
                        <span className="text-lg font-semibold">
                          {selectedDayDoses.filter(d => d.status === 'taken').length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Taken</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-primary mb-1">
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-lg font-semibold">
                          {selectedDayDoses.filter(d => d.status === 'pending').length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <X className="h-3 w-3" />
                        <span className="text-lg font-semibold">
                          {selectedDayDoses.filter(d => d.status === 'skipped').length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Skipped</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
