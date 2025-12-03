"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import {
  SleepStagesChart,
  HRVTrendChart,
  ActivityBarChart,
  HealthMetricCard,
} from "@/components/health"
import { GarminConnect } from "@/components/garmin-connect"
import { Moon, Heart, Zap, Activity, Footprints, Flame } from "lucide-react"

// Sample trend data for sparklines
const sleepTrend = [{ value: 7.2 }, { value: 6.8 }, { value: 7.5 }, { value: 8.0 }, { value: 7.8 }]
const hrvTrend = [{ value: 58 }, { value: 62 }, { value: 55 }, { value: 67 }, { value: 62 }]
const stressTrend = [{ value: 45 }, { value: 38 }, { value: 42 }, { value: 35 }, { value: 32 }]
const stepsTrend = [{ value: 7200 }, { value: 8900 }, { value: 6100 }, { value: 9500 }, { value: 8200 }]
const activeTrend = [{ value: 35 }, { value: 52 }, { value: 28 }, { value: 58 }, { value: 42 }]
const caloriesTrend = [{ value: 2150 }, { value: 2480 }, { value: 1920 }, { value: 2650 }, { value: 2340 }]

export default function HealthPage() {
  // This would come from your auth/database state
  const isGarminConnected = false

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-balance">Health Metrics</h1>
            <p className="text-muted-foreground mt-1">
              {isGarminConnected
                ? "Data synced from Garmin Connect"
                : "Connect your Garmin to sync health data"}
            </p>
          </div>

          {/* Garmin Connection Card - Show prominently if not connected */}
          {!isGarminConnected && (
            <div className="mb-8">
              <GarminConnect />
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid gap-4 mb-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <HealthMetricCard
              label="Sleep Score"
              value={87}
              unit="/100"
              icon={Moon}
              color="violet"
              status="success"
              sparkData={sleepTrend}
              trend={{ value: 5, isPositive: true }}
            />
            <HealthMetricCard
              label="HRV"
              value={62}
              unit="ms"
              icon={Heart}
              color="rose"
              status="success"
              sparkData={hrvTrend}
              trend={{ value: 8, isPositive: true }}
            />
            <HealthMetricCard
              label="Stress"
              value={32}
              unit="/100"
              icon={Zap}
              color="amber"
              status="success"
              sparkData={stressTrend}
              trend={{ value: 12, isPositive: true }}
            />
            <HealthMetricCard
              label="Steps"
              value="8.2k"
              icon={Footprints}
              color="teal"
              status="warning"
              sparkData={stepsTrend}
              trend={{ value: 3, isPositive: false }}
            />
            <HealthMetricCard
              label="Active Min"
              value={42}
              unit="min"
              icon={Activity}
              color="emerald"
              status="neutral"
              sparkData={activeTrend}
            />
            <HealthMetricCard
              label="Calories"
              value="2.3k"
              unit="kcal"
              icon={Flame}
              color="indigo"
              status="neutral"
              sparkData={caloriesTrend}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <SleepStagesChart />
            <HRVTrendChart />
          </div>

          <div className="grid gap-6">
            <ActivityBarChart />
          </div>
        </div>
      </main>
    </div>
  )
}
