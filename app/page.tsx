import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { FastingTimer } from "@/components/fasting-timer"
import { CircularGauge } from "@/components/circular-gauge"
import { MetricCard } from "@/components/metric-card"
import { ScheduleCard } from "@/components/schedule-card"
import { Weight, Heart } from "lucide-react"

export default function DashboardPage() {
  const fastingStartTime = new Date(Date.now() - 14 * 60 * 60 * 1000) // 14 hours ago

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-balance mb-2">Today's Target</h1>
            <p className="text-muted-foreground text-lg">Track your health metrics and peptide protocols</p>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
            {/* Large fasting timer card - spans 2 columns */}
            <div className="lg:col-span-2">
              <FastingTimer fastingStartTime={fastingStartTime} targetHours={16} />
            </div>

            {/* Activity card with yellow accent */}
            <div className="rounded-3xl bg-gradient-to-br from-[#f59e0b] to-[#fb923c] p-6 text-white shadow-lg">
              <div className="mb-4">
                <p className="text-sm font-medium opacity-90 mb-1">Activity</p>
                <h3 className="text-2xl font-semibold">6524 Steps</h3>
              </div>
              <div className="relative h-32 mb-4">
                <div className="absolute bottom-0 left-0 w-16 h-16 border-4 border-white/30 rounded-2xl" />
                <div className="absolute bottom-4 left-4 w-20 h-20 border-4 border-white/20 rounded-2xl" />
                <div className="absolute bottom-8 left-8 w-24 h-24 border-4 border-white/10 rounded-2xl" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">Training</span>
                <span className="font-mono font-semibold">4h</span>
              </div>
            </div>

            {/* Heart rate card - coral/red */}
            <div className="rounded-3xl bg-gradient-to-br from-[#f43f5e] to-[#fb7185] p-6 text-white shadow-lg">
              <div className="mb-4">
                <p className="text-sm font-medium opacity-90 mb-1">Heart Rate</p>
              </div>
              <div className="relative h-32 mb-4 flex items-center justify-center">
                <svg viewBox="0 0 100 40" className="w-full h-20 opacity-80">
                  <polyline
                    points="0,20 20,20 25,10 30,30 35,20 40,20 45,10 50,30 55,20 75,20"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-90">Lowest</span>
                  <span className="font-mono font-semibold">63 bpm</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-90">Highest</span>
                  <span className="font-mono font-semibold">140 bpm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second row - compliance and sleep cards */}
          <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Water/Hydration card - indigo */}
            <div className="rounded-3xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] p-6 text-white shadow-lg">
              <div className="mb-4">
                <p className="text-sm font-medium opacity-90 mb-1">Water</p>
                <h3 className="text-2xl font-semibold">3 glasses</h3>
              </div>
              <div className="relative h-28 flex items-center justify-center">
                <div className="absolute w-20 h-20 border-4 border-white/30 rounded-full" />
                <div className="absolute w-16 h-16 border-4 border-white/40 rounded-full" />
                <div className="absolute w-12 h-12 border-4 border-white/50 rounded-full" />
              </div>
            </div>

            {/* Protocol compliance */}
            <div className="rounded-3xl bg-card p-6 shadow-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Protocol</p>
                  <h3 className="text-lg font-semibold">This Week</h3>
                </div>
              </div>
              <div className="flex justify-center">
                <CircularGauge value={12} max={14} label="Injections" color="#14b8a6" />
              </div>
            </div>

            {/* Sleep card - purple */}
            <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] p-6 text-white shadow-lg">
              <div className="mb-4">
                <p className="text-sm font-medium opacity-90 mb-1">Sleep</p>
                <h3 className="text-2xl font-semibold">8 hours</h3>
              </div>
              <div className="relative h-28 flex items-center justify-center">
                <div className="absolute left-1/4 w-24 h-24 border-4 border-white/30 rounded-full" />
                <div className="absolute left-1/3 w-24 h-24 border-4 border-white/40 rounded-full" />
                <div className="absolute left-[45%] w-24 h-24 border-4 border-white/50 rounded-full" />
              </div>
            </div>
          </div>

          {/* Schedule and small metrics */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ScheduleCard />
            </div>

            {/* Small metrics grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-1 auto-rows-fr">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
