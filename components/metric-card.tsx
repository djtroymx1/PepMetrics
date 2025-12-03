import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: {
    value: number
    direction: "up" | "down"
  }
  status?: "success" | "warning" | "error" | "neutral"
}

export function MetricCard({ label, value, unit, icon: Icon, trend, status = "neutral" }: MetricCardProps) {
  const statusColors = {
    success: "text-[#22c55e]",
    warning: "text-[#f59e0b]",
    error: "text-[#ef4444]",
    neutral: "text-primary",
  }

  const bgColors = {
    success: "bg-[#22c55e]/10",
    warning: "bg-[#f59e0b]/10",
    error: "bg-[#ef4444]/10",
    neutral: "bg-primary/10",
  }

  return (
    <div className="rounded-2xl bg-card p-5 shadow-md border border-border hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bgColors[status])}>
          <Icon className={cn("h-5 w-5", statusColors[status])} />
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-semibold tabular-nums font-mono">{value}</span>
        {unit && <span className="text-base text-muted-foreground ml-1">{unit}</span>}
      </div>

      {trend && (
        <div className="flex items-center gap-1">
          <span className={cn("text-sm font-medium", trend.direction === "up" ? "text-[#22c55e]" : "text-[#ef4444]")}>
            {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-muted-foreground">vs last week</span>
        </div>
      )}
    </div>
  )
}
