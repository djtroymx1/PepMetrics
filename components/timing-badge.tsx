"use client"

import { Sunrise, Sun, Sunset, Moon, Clock, UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TimingPreference } from "@/lib/types"
import { TIMING_INFO } from "@/lib/types"

interface TimingBadgeProps {
  timing: TimingPreference
  showFastingIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'subtle' | 'outline'
  className?: string
}

const ICONS = {
  sunrise: Sunrise,
  sun: Sun,
  sunset: Sunset,
  moon: Moon,
  clock: Clock,
}

const SIZE_CLASSES = {
  sm: 'text-xs px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-1 gap-1.5',
  lg: 'text-sm px-2.5 py-1.5 gap-2',
}

const ICON_SIZES = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

const VARIANT_CLASSES = {
  default: 'bg-muted text-muted-foreground',
  subtle: 'bg-transparent text-muted-foreground',
  outline: 'border border-border text-muted-foreground',
}

const TIMING_COLORS: Record<TimingPreference, string> = {
  'morning-fasted': 'text-amber-500',
  'morning-with-food': 'text-orange-400',
  'afternoon': 'text-yellow-500',
  'evening': 'text-purple-400',
  'before-bed': 'text-indigo-400',
  'any-time': 'text-muted-foreground',
}

export function TimingBadge({
  timing,
  showFastingIcon = true,
  size = 'md',
  variant = 'default',
  className,
}: TimingBadgeProps) {
  const info = TIMING_INFO[timing]
  const Icon = ICONS[info.icon]
  const requiresFasting = info.requiresFasting

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className
      )}
    >
      <Icon className={cn(ICON_SIZES[size], TIMING_COLORS[timing])} />
      <span>{info.shortLabel}</span>
      {showFastingIcon && requiresFasting && (
        <UtensilsCrossed className={cn(ICON_SIZES[size], "text-amber-500")} />
      )}
    </span>
  )
}

// Standalone fasting indicator
interface FastingIndicatorProps {
  requiresFasting: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FastingIndicator({ requiresFasting, size = 'md', className }: FastingIndicatorProps) {
  if (!requiresFasting) return null

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-amber-500/10 text-amber-500 font-medium",
        SIZE_CLASSES[size],
        className
      )}
    >
      <UtensilsCrossed className={ICON_SIZES[size]} />
      <span>Fasted</span>
    </span>
  )
}

// Full timing display with label
interface TimingDisplayProps {
  timing: TimingPreference
  preferredTime?: string
  showFastingIcon?: boolean
  className?: string
}

export function TimingDisplay({
  timing,
  preferredTime,
  showFastingIcon = true,
  className,
}: TimingDisplayProps) {
  const info = TIMING_INFO[timing]
  const Icon = ICONS[info.icon]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex items-center gap-1.5", TIMING_COLORS[timing])}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{info.label}</span>
      </div>
      {preferredTime && (
        <span className="text-sm text-muted-foreground font-mono">
          @ {preferredTime}
        </span>
      )}
      {showFastingIcon && info.requiresFasting && (
        <span className="inline-flex items-center gap-1 text-xs text-amber-500">
          <UtensilsCrossed className="h-3 w-3" />
          fasted
        </span>
      )}
    </div>
  )
}
