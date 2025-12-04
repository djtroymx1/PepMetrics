"use client"

import { useEffect, useState } from "react"
import { Clock, CheckCircle, AlertCircle, Play } from "lucide-react"

interface FastingTimerProps {
  fastingStartTime: Date
  targetHours: number
  fastingRequiredPeptides?: string[]
  onStartFasting?: () => void
}

export function FastingTimer({
  fastingStartTime,
  targetHours,
  fastingRequiredPeptides = [],
  onStartFasting,
}: FastingTimerProps) {
  const [elapsed, setElapsed] = useState(0)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const diff = now.getTime() - fastingStartTime.getTime()
      const hours = diff / (1000 * 60 * 60)

      setElapsed(hours)
      setPercentage(Math.min((hours / targetHours) * 100, 100))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [fastingStartTime, targetHours])

  const hours = Math.floor(elapsed)
  const minutes = Math.floor((elapsed - hours) * 60)
  const remaining = Math.max(targetHours - elapsed, 0)
  const remainingHours = Math.floor(remaining)
  const remainingMinutes = Math.floor((remaining - remainingHours) * 60)
  const isFasted = elapsed >= 2 // Most peptides need 2+ hours fasted

  // Display peptides (up to 3)
  const displayPeptides = fastingRequiredPeptides.slice(0, 3)
  const hasMorePeptides = fastingRequiredPeptides.length > 3

  return (
    <div className="rounded-2xl bg-card p-6 border border-border">
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

      {/* Fasting-required peptides from protocols */}
      {fastingRequiredPeptides.length > 0 ? (
        <>
          {isFasted && (
            <div className="text-xs text-green-500 flex items-center gap-1 flex-wrap">
              <CheckCircle className="h-3 w-3 shrink-0" />
              <span>Safe for: {displayPeptides.join(', ')}{hasMorePeptides ? ` +${fastingRequiredPeptides.length - 3} more` : ''}</span>
            </div>
          )}
          {!isFasted && (
            <div className="text-xs text-amber-500 flex items-center gap-1 flex-wrap">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>Wait before: {displayPeptides.join(', ')}{hasMorePeptides ? ` +${fastingRequiredPeptides.length - 3} more` : ''}</span>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          No fasting-required peptides in active protocols
        </p>
      )}

      {/* Start fasting button */}
      {onStartFasting && (
        <button
          onClick={onStartFasting}
          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <Play className="h-4 w-4" />
          Start New Fast
        </button>
      )}
    </div>
  )
}
