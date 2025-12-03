"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"
import { TrendingDown, Target } from "lucide-react"

const weightData = [
  { date: "Jan 1", weight: 195.2, goal: 185 },
  { date: "Jan 8", weight: 193.8, goal: 185 },
  { date: "Jan 15", weight: 192.4, goal: 185 },
  { date: "Jan 22", weight: 190.7, goal: 185 },
  { date: "Jan 29", weight: 189.3, goal: 185 },
  { date: "Feb 5", weight: 188.1, goal: 185 },
  { date: "Feb 12", weight: 186.9, goal: 185 },
  { date: "Feb 19", weight: 185.2, goal: 185 },
]

export function WeightTrendChart() {
  const startWeight = weightData[0].weight
  const currentWeight = weightData[weightData.length - 1].weight
  const weightLost = startWeight - currentWeight
  const percentLost = (weightLost / startWeight) * 100

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-5 w-5 text-success" />
            <h2 className="text-lg font-semibold">Weight Trend</h2>
          </div>
          <p className="text-sm text-text-secondary">8-week progress overview</p>
        </div>
        <div className="grid grid-cols-3 gap-6 text-right">
          <div>
            <p className="text-2xl font-semibold tabular-nums">{currentWeight}</p>
            <p className="text-xs text-text-muted">Current (lbs)</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-success">-{weightLost.toFixed(1)}</p>
            <p className="text-xs text-text-muted">Lost (lbs)</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-success">-{percentLost.toFixed(1)}%</p>
            <p className="text-xs text-text-muted">Change</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={weightData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="date" stroke="#71717a" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="#71717a"
            style={{ fontSize: "12px" }}
            domain={[180, 200]}
            label={{ value: "Weight (lbs)", angle: -90, position: "insideLeft", fill: "#71717a" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <ReferenceLine
            y={185}
            stroke="#14b8a6"
            strokeDasharray="5 5"
            label={{ value: "Goal", fill: "#14b8a6", fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ fill: "#22c55e", r: 5 }}
            name="Weight"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
        <Target className="h-4 w-4 text-success flex-shrink-0" />
        <p className="text-xs text-success">Just 0.2 lbs from your goal! Keep up the great work.</p>
      </div>
    </div>
  )
}
