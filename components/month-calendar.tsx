"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayEvent {
  type: "injection" | "meal" | "weight" | "photo" | "check-in"
  count?: number
}

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  events: DayEvent[]
}

export function MonthCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 19)) // Feb 19, 2024

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Generate calendar days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startingDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const days: CalendarDay[] = []

  // Previous month days
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      events: [],
    })
  }

  // Current month days with mock events
  for (let date = 1; date <= daysInMonth; date++) {
    const isToday = date === 19
    const events: DayEvent[] = []

    // Add mock events to some days
    if (date % 2 === 0) events.push({ type: "injection", count: 2 })
    if (date % 3 === 0) events.push({ type: "meal", count: 3 })
    if (date === 5 || date === 12 || date === 19) events.push({ type: "weight" })
    if (date === 5 || date === 19) events.push({ type: "photo" })
    if (date >= 13) events.push({ type: "check-in" })

    days.push({
      date,
      isCurrentMonth: true,
      isToday,
      events,
    })
  }

  // Next month days
  const remainingDays = 42 - days.length // 6 rows * 7 days
  for (let date = 1; date <= remainingDays; date++) {
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      events: [],
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{monthName}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md border border-border hover:bg-elevated transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-md border border-border text-sm font-medium hover:bg-elevated transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md border border-border hover:bg-elevated transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-text-muted py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "min-h-20 rounded-lg border p-2 cursor-pointer transition-colors",
              day.isCurrentMonth
                ? "border-border bg-elevated hover:border-primary/50"
                : "border-transparent bg-background/50 opacity-40",
              day.isToday && "border-primary bg-primary/10",
            )}
          >
            <div className={cn("text-sm font-medium mb-1", day.isToday && "text-primary")}>{day.date}</div>
            <div className="space-y-1">
              {day.events.map((event, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full",
                    event.type === "injection" && "bg-primary",
                    event.type === "meal" && "bg-warning",
                    event.type === "weight" && "bg-success",
                    event.type === "photo" && "bg-secondary",
                    event.type === "check-in" && "bg-text-muted",
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
