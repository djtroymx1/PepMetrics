"use client"

import { AreaChart, BadgeDelta } from "@tremor/react"
import { TrendingDown, Target, Scale } from "lucide-react"

const weightData = [
  { date: "Jan 1", Weight: 195.2, Goal: 185 },
  { date: "Jan 8", Weight: 193.8, Goal: 185 },
  { date: "Jan 15", Weight: 192.4, Goal: 185 },
  { date: "Jan 22", Weight: 190.7, Goal: 185 },
  { date: "Jan 29", Weight: 189.3, Goal: 185 },
  { date: "Feb 5", Weight: 188.1, Goal: 185 },
  { date: "Feb 12", Weight: 186.9, Goal: 185 },
  { date: "Feb 19", Weight: 185.2, Goal: 185 },
]

export function WeightTrendCard() {
  const startWeight = weightData[0].Weight
  const currentWeight = weightData[weightData.length - 1].Weight
  const goalWeight = weightData[0].Goal
  const weightLost = startWeight - currentWeight
  const percentLost = (weightLost / startWeight) * 100
  const toGoal = currentWeight - goalWeight

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Scale className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Weight Trend</h2>
            <p className="text-sm text-muted-foreground">8-week progress overview</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current</p>
          <p className="text-2xl font-bold tabular-nums">{currentWeight}</p>
          <p className="text-xs text-muted-foreground">lbs</p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 p-4">
          <p className="text-xs text-emerald-600 uppercase tracking-wider mb-1">Lost</p>
          <div className="flex items-center gap-1">
            <TrendingDown className="h-4 w-4 text-emerald-500" />
            <p className="text-2xl font-bold tabular-nums text-emerald-500">{weightLost.toFixed(1)}</p>
          </div>
          <p className="text-xs text-emerald-600">lbs</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Change</p>
          <BadgeDelta deltaType="decrease" size="lg">
            {percentLost.toFixed(1)}%
          </BadgeDelta>
        </div>
      </div>

      <AreaChart
        className="h-72"
        data={weightData}
        index="date"
        categories={["Weight"]}
        colors={["emerald"]}
        valueFormatter={(value) => `${value} lbs`}
        showLegend={false}
        showAnimation={true}
        curveType="monotone"
        yAxisWidth={50}
        minValue={180}
        maxValue={200}
      />

      {toGoal <= 0.5 ? (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <Target className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-500 font-medium">
            {toGoal <= 0
              ? "Goal reached! Amazing work!"
              : `Just ${toGoal.toFixed(1)} lbs from your goal! Keep it up.`}
          </p>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border">
          <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            {toGoal.toFixed(1)} lbs to goal weight of {goalWeight} lbs
          </p>
        </div>
      )}
    </div>
  )
}
