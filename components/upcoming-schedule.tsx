"use client"

import { Clock, Syringe, Utensils, Camera, CheckSquare, Weight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScheduleEvent {
  id: string
  date: string
  time: string
  type: "injection" | "meal" | "weight" | "photo" | "check-in"
  title: string
  details?: string
  completed: boolean
}

const upcomingEvents: ScheduleEvent[] = [
  {
    id: "1",
    date: "Today",
    time: "06:00 PM",
    type: "injection",
    title: "BPC-157",
    details: "250mcg - Right shoulder",
    completed: false,
  },
  {
    id: "2",
    date: "Today",
    time: "08:00 PM",
    type: "meal",
    title: "Dinner (Window Closes)",
    details: "Target: 800 cal",
    completed: false,
  },
  {
    id: "3",
    date: "Today",
    time: "09:00 PM",
    type: "check-in",
    title: "Daily Check-In",
    details: "Rate energy, mood, hunger, sleep",
    completed: false,
  },
  {
    id: "4",
    date: "Tomorrow",
    time: "08:00 AM",
    type: "injection",
    title: "Semaglutide",
    details: "0.5mg - Left abdomen",
    completed: false,
  },
  {
    id: "5",
    date: "Tomorrow",
    time: "12:00 PM",
    type: "meal",
    title: "Lunch (Eating Window Opens)",
    details: "Target: 600 cal",
    completed: false,
  },
  {
    id: "6",
    date: "Feb 21",
    time: "07:00 AM",
    type: "weight",
    title: "Weekly Weigh-In",
    details: "Record weight and measurements",
    completed: false,
  },
  {
    id: "7",
    date: "Feb 21",
    time: "08:00 AM",
    type: "photo",
    title: "Progress Photos",
    details: "Front, side, and back views",
    completed: false,
  },
]

const getEventIcon = (type: string) => {
  switch (type) {
    case "injection":
      return Syringe
    case "meal":
      return Utensils
    case "weight":
      return Weight
    case "photo":
      return Camera
    case "check-in":
      return CheckSquare
    default:
      return Clock
  }
}

const getEventColor = (type: string) => {
  switch (type) {
    case "injection":
      return "text-primary bg-primary/10"
    case "meal":
      return "text-warning bg-warning/10"
    case "weight":
      return "text-success bg-success/10"
    case "photo":
      return "text-secondary bg-secondary/10"
    case "check-in":
      return "text-text-muted bg-text-muted/10"
    default:
      return "text-text-muted bg-elevated"
  }
}

export function UpcomingSchedule() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
      </div>

      <div className="space-y-3">
        {upcomingEvents.map((event) => {
          const Icon = getEventIcon(event.type)

          return (
            <div
              key={event.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-elevated p-3 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                  getEventColor(event.type),
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-text-muted">{event.date}</span>
                  <span className="text-xs text-text-muted">•</span>
                  <span className="font-mono text-xs text-text-muted tabular-nums">{event.time}</span>
                </div>
                <p className="font-medium text-sm mb-0.5">{event.title}</p>
                {event.details && <p className="text-xs text-text-muted">{event.details}</p>}
              </div>
            </div>
          )
        })}
      </div>

      <button className="mt-4 w-full rounded-md border border-border py-2 text-sm font-medium hover:bg-elevated transition-colors">
        View All Events
      </button>
    </div>
  )
}
