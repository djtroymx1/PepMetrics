"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Moon } from "lucide-react"

const sleepData = [
  { date: "Mon", deep: 1.2, light: 4.3, rem: 1.8, awake: 0.3 },
  { date: "Tue", deep: 1.5, light: 4.1, rem: 2.0, awake: 0.2 },
  { date: "Wed", deep: 1.3, light: 3.8, rem: 1.6, awake: 0.5 },
  { date: "Thu", deep: 1.7, light: 4.5, rem: 2.2, awake: 0.2 },
  { date: "Fri", deep: 1.4, light: 4.2, rem: 1.9, awake: 0.3 },
  { date: "Sat", deep: 1.8, light: 4.8, rem: 2.3, awake: 0.1 },
  { date: "Sun", deep: 1.6, light: 4.6, rem: 2.1, awake: 0.2 },
]

export function SleepChart() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Moon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Sleep Stages</h2>
          </div>
          <p className="text-sm text-text-secondary">Last 7 days breakdown</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums">7.8h</p>
          <p className="text-xs text-text-muted">Avg per night</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={sleepData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="#71717a"
            style={{ fontSize: "12px" }}
            label={{ value: "Hours", angle: -90, position: "insideLeft", fill: "#71717a" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area type="monotone" dataKey="deep" stackId="1" stroke="#14b8a6" fill="#14b8a6" name="Deep" />
          <Area type="monotone" dataKey="light" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Light" />
          <Area type="monotone" dataKey="rem" stackId="1" stroke="#22c55e" fill="#22c55e" name="REM" />
          <Area type="monotone" dataKey="awake" stackId="1" stroke="#ef4444" fill="#ef4444" name="Awake" />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-text-muted">Deep</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-secondary" />
          <span className="text-text-muted">Light</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-text-muted">REM</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-error" />
          <span className="text-text-muted">Awake</span>
        </div>
      </div>
    </div>
  )
}
