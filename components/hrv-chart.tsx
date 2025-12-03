"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Heart } from "lucide-react"

const hrvData = [
  { date: "Mon", hrv: 58, baseline: 60 },
  { date: "Tue", hrv: 62, baseline: 60 },
  { date: "Wed", hrv: 55, baseline: 60 },
  { date: "Thu", hrv: 67, baseline: 60 },
  { date: "Fri", hrv: 64, baseline: 60 },
  { date: "Sat", hrv: 70, baseline: 60 },
  { date: "Sun", hrv: 62, baseline: 60 },
]

export function HRVChart() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-5 w-5 text-error" />
            <h2 className="text-lg font-semibold">Heart Rate Variability</h2>
          </div>
          <p className="text-sm text-text-secondary">7-day trend with baseline</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums">62ms</p>
          <p className="text-xs text-success">+8% vs baseline</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={hrvData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="#71717a"
            style={{ fontSize: "12px" }}
            domain={[40, 80]}
            label={{ value: "ms", angle: -90, position: "insideLeft", fill: "#71717a" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line type="monotone" dataKey="baseline" stroke="#71717a" strokeDasharray="5 5" dot={false} name="Baseline" />
          <Line
            type="monotone"
            dataKey="hrv"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 4 }}
            name="HRV"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 rounded-lg bg-elevated border border-border">
        <p className="text-xs text-text-secondary">
          Your HRV is trending above baseline, indicating good recovery and readiness to train.
        </p>
      </div>
    </div>
  )
}
