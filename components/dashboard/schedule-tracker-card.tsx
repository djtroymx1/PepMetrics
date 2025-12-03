"use client"

import { Tracker } from "@tremor/react"
import { Clock, Syringe, Utensils, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScheduleItem {
  time: string
  type: "injection" | "meal"
  title: string
  details?: string
  completed?: boolean
}

interface ScheduleTrackerCardProps {
  items: ScheduleItem[]
}

export function ScheduleTrackerCard({ items }: ScheduleTrackerCardProps) {
  const completedCount = items.filter(item => item.completed).length

  // Create tracker data for the week visualization
  const trackerData = items.map(item => ({
    color: item.completed ? "emerald" : item.type === "injection" ? "teal" : "amber",
    tooltip: `${item.time} - ${item.title}${item.completed ? " (Done)" : ""}`,
  }))

  return (
    <div className="rounded-2xl bg-card p-6 border border-border h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Today's Schedule</p>
          <h3 className="text-xl font-semibold">{completedCount}/{items.length} Completed</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="mb-5">
        <Tracker data={trackerData} className="mt-2" />
      </div>

      {/* Schedule List */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 rounded-xl p-3 transition-all",
              item.completed ? "bg-muted/50" : "bg-muted hover:bg-muted/80",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                item.completed
                  ? "bg-emerald-500/10"
                  : item.type === "injection"
                    ? "bg-primary/10"
                    : "bg-amber-500/10",
              )}
            >
              {item.completed ? (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              ) : item.type === "injection" ? (
                <Syringe className="h-4 w-4 text-primary" />
              ) : (
                <Utensils className="h-4 w-4 text-amber-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={cn("font-medium text-sm", item.completed && "text-muted-foreground line-through")}>
                  {item.title}
                </p>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">{item.time}</span>
              </div>
              {item.details && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
