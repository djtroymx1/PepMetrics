import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { SleepChart } from "@/components/sleep-chart"
import { HRVChart } from "@/components/hrv-chart"
import { ActivityChart } from "@/components/activity-chart"
import { MetricCard } from "@/components/metric-card"
import { GarminImport } from "@/components/garmin-import"
import { Moon, Heart, Zap, Activity, Footprints, Flame } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type GarminRow = {
  data_date: string
  sleep: any
  hrv_avg: number | null
  resting_heart_rate: number | null
  stress_avg: number | null
  body_battery_high: number | null
  body_battery_low: number | null
  steps: number | null
  active_minutes: number | null
  calories_total: number | null
  calories_active: number | null
  distance_meters: number | null
}

function formatDayLabel(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })
}

function average(values: Array<number | null | undefined>) {
  const filtered = values.filter((v): v is number => typeof v === "number" && !Number.isNaN(v))
  if (filtered.length === 0) return 0
  return filtered.reduce((sum, v) => sum + v, 0) / filtered.length
}

export default async function HealthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let garminData: GarminRow[] = []

  if (user) {
    // Get most recent 30 days of data, then reverse to show chronologically
    const { data } = await supabase
      .from('garmin_data')
      .select('*')
      .eq('user_id', user.id)
      .order('data_date', { ascending: false })
      .limit(30)

    // Reverse to get chronological order (oldest to newest) for charts
    garminData = ((data || []) as GarminRow[]).reverse()
  }

  const sleepChartData = garminData.map((row) => {
    const sleep = row.sleep || {}
    return {
      date: formatDayLabel(row.data_date),
      deep: sleep.deep_hours ?? 0,
      light: sleep.light_hours ?? 0,
      rem: sleep.rem_hours ?? 0,
      awake: sleep.awake_hours ?? 0,
    }
  })

  const hrvChartData = garminData.map((row) => ({
    date: formatDayLabel(row.data_date),
    hrv: row.hrv_avg ?? 0,
  }))
  const hrvBaseline = average(hrvChartData.map((d) => d.hrv))
  const hrvChartWithBaseline = hrvChartData.map((d) => ({ ...d, baseline: hrvBaseline }))

  const activityChartData = garminData.map((row) => ({
    date: formatDayLabel(row.data_date),
    steps: row.steps ?? 0,
    activeMinutes: row.active_minutes ?? 0,
    calories: row.calories_total ?? 0,
  }))

  const sleepScoreAvg = average(garminData.map((row) => (row.sleep || {}).score))
  const hrvAvg = average(garminData.map((row) => row.hrv_avg))
  const stressAvg = average(garminData.map((row) => row.stress_avg))
  const stepsAvg = average(garminData.map((row) => row.steps))
  const activeAvg = average(garminData.map((row) => row.active_minutes))
  const caloriesAvg = average(garminData.map((row) => row.calories_total))

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
              Import your Garmin data to track health metrics
            </p>
          </div>

          {/* Garmin Import Card */}
          <div className="mb-8">
            <GarminImport />
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 mb-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard label="Sleep Score" value={Math.round(sleepScoreAvg) || 0} unit="/100" icon={Moon} status="success" />
            <MetricCard label="HRV" value={Math.round(hrvAvg) || 0} unit="ms" icon={Heart} status="success" />
            <MetricCard label="Stress" value={Math.round(stressAvg) || 0} unit="/100" icon={Zap} status="success" />
            <MetricCard label="Steps" value={stepsAvg > 0 ? Math.round(stepsAvg).toLocaleString() : 0} icon={Footprints} status="warning" />
            <MetricCard label="Active Minutes" value={Math.round(activeAvg) || 0} unit="min" icon={Activity} status="neutral" />
            <MetricCard label="Calories" value={Math.round(caloriesAvg) || 0} unit="kcal" icon={Flame} status="neutral" />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <SleepChart data={sleepChartData} />
            <HRVChart data={hrvChartWithBaseline} />
          </div>

          <div className="grid gap-6">
            <ActivityChart data={activityChartData} />
          </div>
        </div>
      </main>
    </div>
  )
}
