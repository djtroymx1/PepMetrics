"use client"

import { LineChart, BadgeDelta } from "@tremor/react"
import { Heart } from "lucide-react"

const hrvData = [
  { date: "Mon", HRV: 58, Baseline: 60 },
  { date: "Tue", HRV: 62, Baseline: 60 },
  { date: "Wed", HRV: 55, Baseline: 60 },
  { date: "Thu", HRV: 67, Baseline: 60 },
  { date: "Fri", HRV: 64, Baseline: 60 },
  { date: "Sat", HRV: 70, Baseline: 60 },
  { date: "Sun", HRV: 62, Baseline: 60 },
]

export function HRVTrendChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
              <Heart className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Heart Rate Variability</h2>
              <p className="text-sm text-muted-foreground">7-day trend with baseline</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums">62ms</p>
          <BadgeDelta deltaType="increase" size="sm">
            +8% vs baseline
          </BadgeDelta>
        </div>
      </div>

      <LineChart
        className="h-72"
        data={hrvData}
        index="date"
        categories={["HRV", "Baseline"]}
        colors={["emerald", "gray"]}
        valueFormatter={(value) => `${value}ms`}
        showLegend={true}
        showAnimation={true}
        curveType="monotone"
        connectNulls={true}
      />

      <div className="mt-4 p-3 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          Your HRV is trending above baseline, indicating good recovery and readiness to train.
        </p>
      </div>
    </div>
  )
}
