import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { WeightTrendChart } from "@/components/weight-trend-chart"
import { MeasurementsCard } from "@/components/measurements-card"
import { ProgressPhotos } from "@/components/progress-photos"
import { DailyCheckIns } from "@/components/daily-check-ins"
import { Camera } from "lucide-react"

export default function ProgressPage() {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-32 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-balance">Progress Tracking</h1>
              <p className="text-text-secondary mt-1">Track your body composition and progress photos</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
              Add Photo
            </button>
          </div>

          {/* Weight Trend */}
          <div className="mb-6">
            <WeightTrendChart />
          </div>

          {/* Measurements and Photos */}
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <div className="lg:col-span-1">
              <MeasurementsCard />
            </div>
            <div className="lg:col-span-2">
              <ProgressPhotos />
            </div>
          </div>

          {/* Daily Check-ins */}
          <DailyCheckIns />
        </div>
      </main>
    </div>
  )
}
