"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Activity } from "lucide-react"

type ActivityDatum = { date: string; steps: number; activeMinutes: number; calories: number }

const fallbackActivityData: ActivityDatum[] = [
  { date: "Mon", steps: 7200, activeMinutes: 35, calories: 2150 },
  { date: "Tue", steps: 8900, activeMinutes: 52, calories: 2480 },
  { date: "Wed", steps: 6100, activeMinutes: 28, calories: 1920 },
  { date: "Thu", steps: 9500, activeMinutes: 58, calories: 2650 },
  { date: "Fri", steps: 7800, activeMinutes: 42, calories: 2340 },
  { date: "Sat", steps: 11200, activeMinutes: 75, calories: 2890 },
  { date: "Sun", steps: 8200, activeMinutes: 45, calories: 2420 },
]

interface ActivityChartProps {
  data?: ActivityDatum[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  const chartData = data && data.length > 0 ? data : fallbackActivityData
  const avgSteps = Math.round(chartData.reduce((sum, d) => sum + d.steps, 0) / chartData.length)
  const avgActive = Math.round(chartData.reduce((sum, d) => sum + d.activeMinutes, 0) / chartData.length)

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold">Daily Activity</h2>
          </div>
          <p className="text-sm text-text-secondary">Steps, active minutes, and calories burned</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-lg font-semibold tabular-nums">{avgSteps.toLocaleString()}</p>
            <p className="text-xs text-text-muted">Avg Steps</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold tabular-nums">{avgActive}min</p>
            <p className="text-xs text-text-muted">Avg Active</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: "12px" }} />
          <YAxis
            yAxisId="left"
            stroke="#71717a"
            style={{ fontSize: "12px" }}
            label={{ value: "Steps", angle: -90, position: "insideLeft", fill: "#71717a" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#71717a"
            style={{ fontSize: "12px" }}
            label={{ value: "Minutes", angle: 90, position: "insideRight", fill: "#71717a" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar yAxisId="left" dataKey="steps" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Steps" />
          <Bar yAxisId="right" dataKey="activeMinutes" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Active Minutes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
