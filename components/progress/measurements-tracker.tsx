"use client"

import { ProgressBar, BadgeDelta } from "@tremor/react"
import { Ruler, Plus } from "lucide-react"

interface Measurement {
  label: string
  current: number
  previous: number
  change: number
  isReduction?: boolean // true if reduction is positive (like waist)
}

const measurements: Measurement[] = [
  { label: "Waist", current: 34.5, previous: 36.2, change: -1.7, isReduction: true },
  { label: "Chest", current: 42.0, previous: 41.5, change: 0.5, isReduction: false },
  { label: "Arms", current: 15.2, previous: 14.8, change: 0.4, isReduction: false },
  { label: "Thighs", current: 23.5, previous: 24.1, change: -0.6, isReduction: true },
  { label: "Hips", current: 38.0, previous: 39.2, change: -1.2, isReduction: true },
  { label: "Neck", current: 15.5, previous: 15.8, change: -0.3, isReduction: true },
]

export function MeasurementsTracker() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
          <Ruler className="h-5 w-5 text-violet-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Body Measurements</h2>
          <p className="text-xs text-muted-foreground">Last updated: Feb 19, 2024</p>
        </div>
      </div>

      <div className="space-y-4">
        {measurements.map((measurement) => {
          const isPositiveChange = measurement.isReduction
            ? measurement.change < 0
            : measurement.change > 0

          return (
            <div key={measurement.label} className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{measurement.label}</p>
                <BadgeDelta
                  deltaType={isPositiveChange ? "increase" : "moderateDecrease"}
                  size="sm"
                >
                  {measurement.change > 0 ? "+" : ""}{measurement.change}"
                </BadgeDelta>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono tabular-nums">{measurement.current}</span>
                <span className="text-sm text-muted-foreground">inches</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  from {measurement.previous}"
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <button className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium hover:bg-muted hover:border-primary/50 transition-all">
        <Plus className="h-4 w-4" />
        Update Measurements
      </button>
    </div>
  )
}
