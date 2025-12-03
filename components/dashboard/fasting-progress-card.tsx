"use client"

import { useEffect, useState } from "react"
import { ProgressBar } from "@tremor/react"
import { Clock, CheckCircle, AlertCircle, Flame } from "lucide-react"

interface FastingProgressCardProps {
  fastingStartTime: Date
  targetHours: number
}

export function FastingProgressCard({ fastingStartTime, targetHours }: FastingProgressCardProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = now.getTime() - fastingStartTime.getTime()
      const hours = diff / (1000 * 60 * 60)
      setElapsed(hours)
    }, 1000)

    return () => clearInterval(interval)
  }, [fastingStartTime])

  const hours = Math.floor(elapsed)
  const minutes = Math.floor((elapsed - hours) * 60)
  const percentage = Math.min((elapsed / targetHours) * 100, 100)
  const remaining = Math.max(targetHours - elapsed, 0)
  const remainingHours = Math.floor(remaining)
  const remainingMinutes = Math.floor((remaining - remainingHours) * 60)
  const isFasted = elapsed >= 2 // Most peptides need 2+ hours fasted
  const goalReached = elapsed >= targetHours

  const safePeptides = ["Retatrutide", "MOTS-c", "Tesamorelin"]
  const waitPeptides = ["Retatrutide", "MOTS-c"]

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#14b8a6] to-[#2dd4bf] p-6 text-white shadow-lg h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            goalReached ? 'bg-white/30' : isFasted ? 'bg-white/20' : 'bg-white/20'
          }`}>
            {goalReached ? (
              <Flame className="h-6 w-6" />
            ) : isFasted ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium opacity-90">Fasting Status</p>
            <p className="font-bold text-lg">
              {goalReached ? "Goal Reached!" : isFasted ? "Ready to Inject" : "Still Fed"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-5xl font-bold tabular-nums">{hours}</span>
          <span className="text-2xl opacity-80">h</span>
          <span className="text-5xl font-bold tabular-nums ml-2">{minutes.toString().padStart(2, '0')}</span>
          <span className="text-2xl opacity-80">m</span>
        </div>
        <p className="text-sm opacity-90">
          {goalReached
            ? `You've been fasting for ${targetHours}+ hours`
            : `${remainingHours}h ${remainingMinutes}m until ${targetHours}h target`}
        </p>
      </div>

      <div className="mb-4">
        <ProgressBar
          value={percentage}
          color="white"
          className="[&>div]:bg-white/30 [&>div>div]:bg-white"
          showAnimation={true}
        />
      </div>

      <div className="flex items-center gap-2 text-sm">
        {isFasted ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Safe for: {safePeptides.join(", ")}</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            <span>Wait before: {waitPeptides.join(", ")} (need 2h+ fasted)</span>
          </>
        )}
      </div>
    </div>
  )
}
