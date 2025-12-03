"use client"

import { SparkAreaChart } from "@tremor/react"
import { Footprints } from "lucide-react"

interface ActivitySparkCardProps {
  steps: number
  goal: number
  activeMinutes: number
  data: { value: number }[]
}

export function ActivitySparkCard({ steps, goal, activeMinutes, data }: ActivitySparkCardProps) {
  const percentage = Math.round((steps / goal) * 100)

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#f59e0b] to-[#fb923c] p-6 text-white shadow-lg h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1">Activity</p>
          <h3 className="text-3xl font-bold tabular-nums">{steps.toLocaleString()}</h3>
          <p className="text-sm opacity-80">steps today</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <Footprints className="h-6 w-6" />
        </div>
      </div>

      <div className="h-16 my-4">
        <SparkAreaChart
          data={data}
          categories={["value"]}
          index="value"
          colors={["white"]}
          className="h-16 w-full [&_path]:fill-white/20 [&_path]:stroke-white"
          curveType="monotone"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-90">Goal Progress</span>
          <span className="font-semibold">{percentage}%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm pt-1">
          <span className="opacity-90">Active Minutes</span>
          <span className="font-mono font-semibold">{activeMinutes}m</span>
        </div>
      </div>
    </div>
  )
}
