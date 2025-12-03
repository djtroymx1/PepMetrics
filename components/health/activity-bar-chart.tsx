"use client"

import { BarChart } from "@tremor/react"
import { Activity } from "lucide-react"

const activityData = [
  { date: "Mon", Steps: 7200, "Active Min": 35 },
  { date: "Tue", Steps: 8900, "Active Min": 52 },
  { date: "Wed", Steps: 6100, "Active Min": 28 },
  { date: "Thu", Steps: 9500, "Active Min": 58 },
  { date: "Fri", Steps: 7800, "Active Min": 42 },
  { date: "Sat", Steps: 11200, "Active Min": 75 },
  { date: "Sun", Steps: 8200, "Active Min": 45 },
]

export function ActivityBarChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Activity className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Daily Activity</h2>
              <p className="text-sm text-muted-foreground">Steps and active minutes this week</p>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">8,414</p>
            <p className="text-xs text-muted-foreground">Avg Steps</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">48m</p>
            <p className="text-xs text-muted-foreground">Avg Active</p>
          </div>
        </div>
      </div>

      <BarChart
        className="h-80"
        data={activityData}
        index="date"
        categories={["Steps"]}
        colors={["teal"]}
        valueFormatter={(value) => value.toLocaleString()}
        showLegend={true}
        showAnimation={true}
      />
    </div>
  )
}
