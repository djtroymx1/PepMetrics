"use client"

import { Clock, Syringe, Utensils, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScheduleItem {
  time: string
  type: "injection" | "meal"
  title: string
  details?: string
  completed?: boolean
}

const scheduleData: ScheduleItem[] = [
  {
    time: "06:30 AM",
    type: "injection",
    title: "MOTS-c",
    details: "10mg - Subcutaneous",
    completed: true,
  },
  {
    time: "07:00 AM",
    type: "injection",
    title: "Retatrutide",
    details: "2mg - Left abdomen",
    completed: true,
  },
  {
    time: "12:00 PM",
    type: "meal",
    title: "Break Fast",
    details: "Eating window opens",
    completed: false,
  },
  {
    time: "06:00 PM",
    type: "injection",
    title: "BPC-157",
    details: "250mcg - Right shoulder",
    completed: false,
  },
  {
    time: "08:00 PM",
    type: "meal",
    title: "Last Meal",
    details: "Begin 16h fast",
    completed: false,
  },
]

export function ScheduleCard() {
  const completedCount = scheduleData.filter(item => item.completed).length
  
  return (
    <div className="rounded-2xl bg-card p-6 border border-border h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Today's Schedule</p>
          <h3 className="text-xl font-semibold">{completedCount}/{scheduleData.length} Completed</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        {scheduleData.map((item, index) => (
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
                  ? "bg-green-500/10" 
                  : item.type === "injection" 
                    ? "bg-primary/10" 
                    : "bg-amber-500/10",
              )}
            >
              {item.completed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
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
