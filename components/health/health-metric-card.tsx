"use client"

import { SparkAreaChart, BadgeDelta } from "@tremor/react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface HealthMetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  sparkData?: { value: number }[]
  status?: "success" | "warning" | "neutral"
  color?: "teal" | "violet" | "rose" | "amber" | "emerald" | "indigo"
}

const colorConfig = {
  teal: {
    bg: "bg-teal-500/10",
    text: "text-teal-500",
    spark: "teal" as const,
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-500",
    spark: "violet" as const,
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    spark: "rose" as const,
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    spark: "amber" as const,
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    spark: "emerald" as const,
  },
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-500",
    spark: "indigo" as const,
  },
}

const statusConfig = {
  success: "border-l-emerald-500",
  warning: "border-l-amber-500",
  neutral: "border-l-muted",
}

export function HealthMetricCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  sparkData,
  status = "neutral",
  color = "teal",
}: HealthMetricCardProps) {
  const colors = colorConfig[color]

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 border-l-4 transition-all hover:shadow-md",
        statusConfig[status]
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", colors.bg)}>
          <Icon className={cn("h-4 w-4", colors.text)} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend && (
            <BadgeDelta
              deltaType={trend.isPositive ? "increase" : "decrease"}
              size="xs"
              className="mt-1"
            >
              {trend.value}%
            </BadgeDelta>
          )}
        </div>

        {sparkData && sparkData.length > 0 && (
          <div className="w-20 h-8">
            <SparkAreaChart
              data={sparkData}
              categories={["value"]}
              index="value"
              colors={[colors.spark]}
              className="h-8 w-20"
              curveType="monotone"
            />
          </div>
        )}
      </div>
    </div>
  )
}
