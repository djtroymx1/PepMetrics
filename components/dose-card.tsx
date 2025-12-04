"use client"

import { Check, X, AlertCircle, Clock, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { TimingBadge } from "@/components/timing-badge"
import type { ScheduledDose } from "@/lib/types"

interface DoseCardProps {
  dose: ScheduledDose
  onMarkTaken?: () => void
  onMarkSkipped?: () => void
  onReset?: () => void
  showDate?: boolean
  compact?: boolean
  className?: string
}

export function DoseCard({
  dose,
  onMarkTaken,
  onMarkSkipped,
  onReset,
  showDate = false,
  compact = false,
  className,
}: DoseCardProps) {
  const isActionable = dose.status === 'pending' || dose.status === 'overdue'
  const isPast = dose.status === 'taken' || dose.status === 'skipped'

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 transition-all",
        dose.status === 'overdue' && "border-red-500/50 bg-red-500/5",
        dose.status === 'taken' && "border-green-500/30 bg-green-500/5 opacity-75",
        dose.status === 'skipped' && "border-muted opacity-50",
        dose.status === 'pending' && "border-border hover:border-primary/50",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Peptide Name */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-semibold truncate",
              compact ? "text-sm" : "text-base"
            )}>
              {dose.peptideName}
            </h3>
            {dose.totalDoses > 1 && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {dose.doseNumber}/{dose.totalDoses}
              </span>
            )}
          </div>

          {/* Dose Amount */}
          <p className={cn(
            "font-mono tabular-nums text-muted-foreground",
            compact ? "text-xs" : "text-sm"
          )}>
            {dose.dose}
          </p>

          {/* Timing and Date */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <TimingBadge
              timing={dose.timingPreference}
              showFastingIcon={dose.requiresFasting}
              size="sm"
              variant="subtle"
            />
            {showDate && (
              <span className="text-xs text-muted-foreground">
                {new Date(dose.scheduledDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            {dose.scheduledTime && (
              <span className="text-xs text-muted-foreground font-mono">
                @ {dose.scheduledTime}
              </span>
            )}
          </div>

          {/* Status Indicator */}
          {dose.status === 'overdue' && (
            <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              <span>Overdue</span>
            </div>
          )}
          {dose.status === 'taken' && (
            <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
              <Check className="h-3 w-3" />
              <span>Taken</span>
            </div>
          )}
          {dose.status === 'skipped' && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <X className="h-3 w-3" />
              <span>Skipped</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {(isActionable && (onMarkTaken || onMarkSkipped)) || (onReset && (dose.status === 'taken' || dose.status === 'skipped')) ? (
          <div className="flex flex-col gap-2">
            {onMarkTaken && (
              <button
                onClick={onMarkTaken}
                className={cn(
                  "flex items-center justify-center rounded-lg transition-colors",
                  compact ? "h-8 w-8" : "h-10 w-10",
                  "bg-green-500 text-white hover:bg-green-600"
                )}
                title="Mark as taken"
              >
                <Check className={compact ? "h-4 w-4" : "h-5 w-5"} />
              </button>
            )}
            {onMarkSkipped && (
              <button
                onClick={onMarkSkipped}
                className={cn(
                  "flex items-center justify-center rounded-lg transition-colors",
                  compact ? "h-8 w-8" : "h-10 w-10",
                  "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                title="Skip this dose"
              >
                <X className={compact ? "h-4 w-4" : "h-5 w-5"} />
              </button>
            )}
            {onReset && (dose.status === 'taken' || dose.status === 'skipped') && (
              <button
                onClick={onReset}
                className={cn(
                  "flex items-center justify-center rounded-lg border border-border transition-colors",
                  compact ? "h-8 w-8" : "h-10 w-10",
                  "hover:bg-muted"
                )}
                title="Undo / clear this log"
              >
                <RotateCcw className={compact ? "h-4 w-4" : "h-5 w-5"} />
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

// Compact inline version for lists
interface DoseInlineProps {
  dose: ScheduledDose
  onMarkTaken?: () => void
  className?: string
}

export function DoseInline({ dose, onMarkTaken, className }: DoseInlineProps) {
  const isActionable = dose.status === 'pending' || dose.status === 'overdue'

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-2 px-3 rounded-lg",
        dose.status === 'overdue' && "bg-red-500/5",
        dose.status === 'taken' && "bg-green-500/5 opacity-75",
        dose.status === 'pending' && "bg-muted/50",
        className
      )}
    >
      {/* Status Icon */}
      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full",
        dose.status === 'overdue' && "bg-red-500/10",
        dose.status === 'taken' && "bg-green-500/10",
        dose.status === 'pending' && "bg-primary/10",
        dose.status === 'skipped' && "bg-muted",
      )}>
        {dose.status === 'taken' && <Check className="h-4 w-4 text-green-500" />}
        {dose.status === 'overdue' && <AlertCircle className="h-4 w-4 text-red-500" />}
        {dose.status === 'pending' && <Clock className="h-4 w-4 text-primary" />}
        {dose.status === 'skipped' && <X className="h-4 w-4 text-muted-foreground" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{dose.peptideName}</p>
        <p className="text-xs text-muted-foreground font-mono">{dose.dose}</p>
      </div>

      {/* Timing */}
      <TimingBadge timing={dose.timingPreference} size="sm" variant="subtle" />

      {/* Action */}
      {isActionable && onMarkTaken && (
        <button
          onClick={onMarkTaken}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          <Check className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Empty state for no doses
interface NoDosesProps {
  message?: string
  className?: string
}

export function NoDoses({ message = "No doses scheduled", className }: NoDosesProps) {
  return (
    <div className={cn("text-center py-8", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
        <Check className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
