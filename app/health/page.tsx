import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { SleepChart } from "@/components/sleep-chart"
import { HRVChart } from "@/components/hrv-chart"
import { ActivityChart } from "@/components/activity-chart"
import { MetricCard } from "@/components/metric-card"
import { GarminConnect } from "@/components/garmin-connect"
import { Moon, Heart, Zap, Activity, Footprints, Flame } from "lucide-react"

export default function HealthPage() {
  // This would come from your auth/database state
  const isGarminConnected = false

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
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
          <div className="grid gap-4 mb-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard label="Sleep Score" value={87} unit="/100" icon={Moon} status="success" />
            <MetricCard label="HRV" value={62} unit="ms" icon={Heart} status="success" />
            <MetricCard label="Stress" value={32} unit="/100" icon={Zap} status="success" />
            <MetricCard label="Steps" value="8.2k" icon={Footprints} status="warning" />
            <MetricCard label="Active Minutes" value={42} unit="min" icon={Activity} status="neutral" />
            <MetricCard label="Calories" value={2340} unit="kcal" icon={Flame} status="neutral" />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <SleepChart />
            <HRVChart />
          </div>

          <div className="grid gap-6">
            <ActivityChart />
          </div>
        </div>
      </main>
    </div>
  )
}
