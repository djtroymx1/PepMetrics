"use client"

import { BadgeDelta, SparkAreaChart } from "@tremor/react"
import type { LucideIcon } from "lucide-react"

interface MetricBadgeCardProps {
  label: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: {
    value: number
    direction: "up" | "down"
    isGood?: boolean // Whether this direction is positive for health
  }
  sparkData?: { value: number }[]
  color?: "teal" | "violet" | "rose" | "amber" | "emerald"
}

const colorMap = {
  teal: {
    bg: "bg-[#14b8a6]/10",
    text: "text-[#14b8a6]",
    spark: "teal",
  },
  violet: {
    bg: "bg-[#8b5cf6]/10",
    text: "text-[#8b5cf6]",
    spark: "violet",
  },
  rose: {
    bg: "bg-[#f43f5e]/10",
    text: "text-[#f43f5e]",
    spark: "rose",
  },
  amber: {
    bg: "bg-[#f59e0b]/10",
    text: "text-[#f59e0b]",
    spark: "amber",
  },
  emerald: {
    bg: "bg-[#22c55e]/10",
    text: "text-[#22c55e]",
    spark: "emerald",
  },
}

export function MetricBadgeCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  sparkData,
  color = "teal",
}: MetricBadgeCardProps) {
  const colors = colorMap[color]

  // Determine delta type based on direction and whether it's good
  const getDeltaType = () => {
    if (!trend) return "unchanged"
    const isPositive = trend.isGood ?? (trend.direction === "up")
    if (trend.direction === "up") {
      return isPositive ? "increase" : "moderateIncrease"
    }
    return isPositive ? "decrease" : "moderateDecrease"
  }

  return (
    <div className="rounded-2xl bg-card p-5 shadow-md border border-border hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold tabular-nums">{value}</span>
            {unit && <span className="text-base text-muted-foreground ml-1">{unit}</span>}
          </div>

          {trend && (
            <BadgeDelta
              deltaType={getDeltaType()}
              size="sm"
            >
              {trend.value}% vs last week
            </BadgeDelta>
          )}
        </div>

        {sparkData && sparkData.length > 0 && (
          <div className="w-24 h-10">
            <SparkAreaChart
              data={sparkData}
              categories={["value"]}
              index="value"
              colors={[colors.spark as "teal" | "violet" | "rose" | "amber" | "emerald"]}
              className="h-10 w-24"
              curveType="monotone"
            />
          </div>
        )}
      </div>
    </div>
  )
}
