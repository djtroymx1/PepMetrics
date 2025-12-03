"use client"

import { ProgressCircle } from "@tremor/react"
import { Droplets, Plus, Minus } from "lucide-react"

interface WaterTrackerCardProps {
  glasses: number
  goal: number
  onIncrement?: () => void
  onDecrement?: () => void
}

export function WaterTrackerCard({ glasses, goal, onIncrement, onDecrement }: WaterTrackerCardProps) {
  const percentage = Math.round((glasses / goal) * 100)
  const oz = glasses * 8

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] p-6 text-white shadow-lg h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1">Hydration</p>
          <h3 className="text-2xl font-bold">{glasses} glasses</h3>
          <p className="text-sm opacity-80">{oz} oz today</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <Droplets className="h-6 w-6" />
        </div>
      </div>

      <div className="flex justify-center my-4">
        <ProgressCircle
          value={percentage}
          size="lg"
          color="white"
          showAnimation={true}
          className="[&>svg>circle:first-child]:stroke-white/20 [&>svg>circle:last-child]:stroke-white"
        >
          <span className="text-2xl font-bold">{percentage}%</span>
        </ProgressCircle>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={onDecrement}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
        >
          <Minus className="h-5 w-5" />
        </button>
        <span className="text-sm opacity-90">{goal - glasses} to goal</span>
        <button
          onClick={onIncrement}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
