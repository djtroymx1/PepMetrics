"use client"

import { useEffect, useState } from "react"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"

interface FastingTimerProps {
  fastingStartTime: Date
  targetHours: number
}

export function FastingTimer({ fastingStartTime, targetHours }: FastingTimerProps) {
  const [elapsed, setElapsed] = useState(0)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = now.getTime() - fastingStartTime.getTime()
      const hours = diff / (1000 * 60 * 60)

      setElapsed(hours)
      setPercentage(Math.min((hours / targetHours) * 100, 100))
    }, 1000)

    return () => clearInterval(interval)
  }, [fastingStartTime, targetHours])

  const hours = Math.floor(elapsed)
  const minutes = Math.floor((elapsed - hours) * 60)
  const remaining = Math.max(targetHours - elapsed, 0)
  const remainingHours = Math.floor(remaining)
  const remainingMinutes = Math.floor((remaining - remainingHours) * 60)
  const isFasted = elapsed >= 2 // Most peptides need 2+ hours fasted

  return (
    <div className="rounded-2xl bg-card p-6 border border-border h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isFasted ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
            {isFasted ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Clock className="h-5 w-5 text-amber-500" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fasting Status</p>
            <p className={`font-semibold ${isFasted ? 'text-green-500' : 'text-amber-500'}`}>
              {isFasted ? "Ready to Inject" : "Still Fed"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl font-mono font-semibold tabular-nums">{hours}</span>
          <span className="text-lg text-muted-foreground">h</span>
          <span className="text-4xl font-mono font-semibold tabular-nums ml-1">{minutes.toString().padStart(2, '0')}</span>
          <span className="text-lg text-muted-foreground">m</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {percentage >= 100
            ? "Fasting goal reached"
            : `${remainingHours}h ${remainingMinutes}m until ${targetHours}h target`}
        </p>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted mb-3">
        <div
          className={`h-full transition-all duration-300 rounded-full ${isFasted ? 'bg-green-500' : 'bg-amber-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isFasted && (
        <div className="text-xs text-green-500 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Safe for: Retatrutide, MOTS-c, Tesamorelin
        </div>
      )}
      {!isFasted && (
        <div className="text-xs text-amber-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Wait before: Retatrutide, MOTS-c (need 2h+ fasted)
        </div>
      )}
    </div>
  )
}
