"use client"

import { AreaChart, Card } from "@tremor/react"
import { Moon } from "lucide-react"

const sleepData = [
  { date: "Mon", Deep: 1.2, Light: 4.3, REM: 1.8, Awake: 0.3 },
  { date: "Tue", Deep: 1.5, Light: 4.1, REM: 2.0, Awake: 0.2 },
  { date: "Wed", Deep: 1.3, Light: 3.8, REM: 1.6, Awake: 0.5 },
  { date: "Thu", Deep: 1.7, Light: 4.5, REM: 2.2, Awake: 0.2 },
  { date: "Fri", Deep: 1.4, Light: 4.2, REM: 1.9, Awake: 0.3 },
  { date: "Sat", Deep: 1.8, Light: 4.8, REM: 2.3, Awake: 0.1 },
  { date: "Sun", Deep: 1.6, Light: 4.6, REM: 2.1, Awake: 0.2 },
]

export function SleepStagesChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Moon className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Sleep Stages</h2>
              <p className="text-sm text-muted-foreground">Last 7 days breakdown</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums">7.8h</p>
          <p className="text-xs text-muted-foreground">Avg per night</p>
        </div>
      </div>

      <AreaChart
        className="h-72"
        data={sleepData}
        index="date"
        categories={["Deep", "Light", "REM", "Awake"]}
        colors={["teal", "violet", "emerald", "rose"]}
        valueFormatter={(value) => `${value}h`}
        showLegend={true}
        showAnimation={true}
        stack={true}
        curveType="monotone"
      />
    </div>
  )
}
