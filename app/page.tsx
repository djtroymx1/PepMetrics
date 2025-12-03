"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import {
  ActivitySparkCard,
  SleepSparkCard,
  WaterTrackerCard,
  ProtocolDonutCard,
  FastingProgressCard,
  MetricBadgeCard,
  ScheduleTrackerCard,
} from "@/components/dashboard"
import { HealthSparkCard } from "@/components/health-spark-card"
import { Weight, Heart } from "lucide-react"

// Sample data for charts
const activityData = [
  { value: 4200 }, { value: 5100 }, { value: 6800 }, { value: 5900 },
  { value: 7200 }, { value: 6100 }, { value: 6524 },
]

const sleepData = [
  { value: 7.2 }, { value: 6.8 }, { value: 8.1 }, { value: 7.5 },
  { value: 6.5 }, { value: 7.8 }, { value: 8 },
]

const heartRateData = [
  { value: 68 }, { value: 72 }, { value: 85 }, { value: 92 },
  { value: 78 }, { value: 65 }, { value: 70 }, { value: 88 },
  { value: 95 }, { value: 82 }, { value: 75 }, { value: 63 },
]

const weightData = [
  { value: 188.5 }, { value: 187.8 }, { value: 187.2 }, { value: 186.5 },
  { value: 186.1 }, { value: 185.8 }, { value: 185.2 },
]

const hrvData = [
  { value: 52 }, { value: 55 }, { value: 58 }, { value: 54 },
  { value: 60 }, { value: 58 }, { value: 62 },
]

const scheduleItems = [
  { time: "6:00 AM", type: "injection" as const, title: "BPC-157", details: "250mcg subcutaneous", completed: true },
  { time: "6:30 AM", type: "meal" as const, title: "Break fast", details: "Post-16h fast", completed: true },
  { time: "12:00 PM", type: "injection" as const, title: "MOTS-c", details: "5mg subcutaneous", completed: false },
  { time: "6:00 PM", type: "meal" as const, title: "Last meal", details: "Start fasting window", completed: false },
  { time: "8:00 PM", type: "injection" as const, title: "TB-500", details: "2.5mg subcutaneous", completed: false },
]

export default function DashboardPage() {
  const [waterGlasses, setWaterGlasses] = useState(3)
  const fastingStartTime = new Date(Date.now() - 14 * 60 * 60 * 1000) // 14 hours ago

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-balance mb-2">
              Good morning, Troy
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your health metrics and peptide protocols
            </p>
          </div>

          {/* First row - Fasting, Activity, Heart Rate */}
          <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
            {/* Large fasting card - spans 2 columns */}
            <div className="lg:col-span-2">
              <FastingProgressCard
                fastingStartTime={fastingStartTime}
                targetHours={16}
              />
            </div>

            {/* Activity card */}
            <ActivitySparkCard
              steps={6524}
              goal={10000}
              activeMinutes={42}
              data={activityData}
            />

            {/* Heart rate card */}
            <HealthSparkCard
              title="Heart Rate"
              value={75}
              unit="bpm"
              data={heartRateData}
              gradient="rose"
              stats={[
                { label: "Lowest", value: "63 bpm" },
                { label: "Highest", value: "140 bpm" },
              ]}
            />
          </div>

          {/* Second row - Water, Protocol, Sleep */}
          <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
            {/* Water tracker */}
            <WaterTrackerCard
              glasses={waterGlasses}
              goal={8}
              onIncrement={() => setWaterGlasses(prev => Math.min(prev + 1, 15))}
              onDecrement={() => setWaterGlasses(prev => Math.max(prev - 1, 0))}
            />

            {/* Protocol compliance */}
            <ProtocolDonutCard
              completed={12}
              total={14}
              peptides={["Retatrutide", "BPC-157", "MOTS-c", "TB-500"]}
            />

            {/* Sleep card - spans 2 columns */}
            <div className="lg:col-span-2">
              <SleepSparkCard
                hours={8}
                quality={85}
                deepSleep={2.5}
                data={sleepData}
              />
            </div>
          </div>

          {/* Third row - Schedule and small metrics */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ScheduleTrackerCard items={scheduleItems} />
            </div>

            {/* Small metrics */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-1 auto-rows-fr">
              <MetricBadgeCard
                label="Weight"
                value={185.2}
                unit="lbs"
                icon={Weight}
                color="emerald"
                trend={{ value: 2.3, direction: "down", isGood: true }}
                sparkData={weightData}
              />
              <MetricBadgeCard
                label="HRV"
                value={62}
                unit="ms"
                icon={Heart}
                color="rose"
                trend={{ value: 8, direction: "up", isGood: true }}
                sparkData={hrvData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
