"use client"

import { SparkAreaChart } from "@tremor/react"
import { Moon } from "lucide-react"

interface SleepSparkCardProps {
  hours: number
  quality: number // 0-100
  deepSleep: number // hours
  data: { value: number }[]
}

export function SleepSparkCard({ hours, quality, deepSleep, data }: SleepSparkCardProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] p-6 text-white shadow-lg h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1">Sleep</p>
          <h3 className="text-3xl font-bold tabular-nums">{hours}h</h3>
          <p className="text-sm opacity-80">last night</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <Moon className="h-6 w-6" />
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

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <p className="text-xs opacity-80 mb-1">Sleep Quality</p>
          <p className="text-lg font-semibold">{quality}%</p>
        </div>
        <div>
          <p className="text-xs opacity-80 mb-1">Deep Sleep</p>
          <p className="text-lg font-semibold">{deepSleep}h</p>
        </div>
      </div>
    </div>
  )
}
