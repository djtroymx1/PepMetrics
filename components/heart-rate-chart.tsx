"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Heart } from "lucide-react"

const heartRateData = [
  { time: "6am", bpm: 62 },
  { time: "9am", bpm: 78 },
  { time: "12pm", bpm: 85 },
  { time: "3pm", bpm: 72 },
  { time: "6pm", bpm: 88 },
  { time: "9pm", bpm: 68 },
]

export function HeartRateChart() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-5 w-5 text-[#f43f5e]" />
            <h2 className="text-lg font-semibold">Average Heart Rate</h2>
          </div>
          <p className="text-sm text-text-secondary">Today's heart rate trend</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums">75 bpm</p>
          <p className="text-xs text-text-muted">Current</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={heartRateData}>
          <defs>
            <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="time" stroke="#71717a" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="#71717a"
            style={{ fontSize: "12px" }}
            domain={[50, 100]}
            label={{ value: "bpm", angle: -90, position: "insideLeft", fill: "#71717a" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="bpm"
            stroke="#f43f5e"
            strokeWidth={2}
            fill="url(#heartRateGradient)"
            name="Heart Rate"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex justify-between text-sm">
        <div>
          <p className="text-text-muted">Lowest</p>
          <p className="font-semibold">62 bpm</p>
        </div>
        <div className="text-right">
          <p className="text-text-muted">Highest</p>
          <p className="font-semibold">88 bpm</p>
        </div>
      </div>
    </div>
  )
}
