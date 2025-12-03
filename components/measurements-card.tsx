"use client"

import { Ruler } from "lucide-react"

interface Measurement {
  label: string
  current: string
  previous: string
  change: number
}

const measurements: Measurement[] = [
  { label: "Waist", current: "34.5", previous: "36.2", change: -1.7 },
  { label: "Chest", current: "42.0", previous: "41.5", change: 0.5 },
  { label: "Arms", current: "15.2", previous: "14.8", change: 0.4 },
  { label: "Thighs", current: "23.5", previous: "24.1", change: -0.6 },
  { label: "Hips", current: "38.0", previous: "39.2", change: -1.2 },
  { label: "Neck", current: "15.5", previous: "15.8", change: -0.3 },
]

export function MeasurementsCard() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center gap-2 mb-6">
        <Ruler className="h-5 w-5 text-secondary" />
        <div>
          <h2 className="text-lg font-semibold">Body Measurements</h2>
          <p className="text-xs text-text-muted">Last updated: Feb 19, 2024</p>
        </div>
      </div>

      <div className="space-y-4">
        {measurements.map((measurement) => (
          <div key={measurement.label} className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">{measurement.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold font-mono tabular-nums">{measurement.current}</span>
                <span className="text-xs text-text-muted">inches</span>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-medium tabular-nums ${
                  measurement.change < 0 ? "text-success" : "text-warning"
                }`}
              >
                {measurement.change > 0 ? "+" : ""}
                {measurement.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full rounded-md border border-border py-2 text-sm font-medium hover:bg-elevated transition-colors">
        Update Measurements
      </button>
    </div>
  )
}
