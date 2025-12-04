"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckIn {
  date: string
  energy: number
  mood: number
  hunger: number
  sleep: number
  completed: boolean
}

const checkIns: CheckIn[] = [
  { date: "Feb 19", energy: 8, mood: 9, hunger: 3, sleep: 8, completed: true },
  { date: "Feb 18", energy: 7, mood: 8, hunger: 4, sleep: 7, completed: true },
  { date: "Feb 17", energy: 9, mood: 9, hunger: 2, sleep: 9, completed: true },
  { date: "Feb 16", energy: 6, mood: 7, hunger: 5, sleep: 6, completed: true },
  { date: "Feb 15", energy: 8, mood: 8, hunger: 3, sleep: 8, completed: true },
  { date: "Feb 14", energy: 7, mood: 8, hunger: 4, sleep: 7, completed: true },
  { date: "Feb 13", energy: 0, mood: 0, hunger: 0, sleep: 0, completed: false },
]

export function DailyCheckIns() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Daily Check-Ins</h2>
          <p className="text-sm text-text-secondary">Track how you feel each day (1-10 scale)</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
          Today&apos;s Check-In
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-text-muted">Date</th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-text-muted">
                Energy
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-text-muted">
                Mood
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-text-muted">
                Hunger
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-text-muted">
                Sleep Quality
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-text-muted">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {checkIns.map((checkIn) => (
              <tr key={checkIn.date} className="hover:bg-elevated transition-colors">
                <td className="py-3 px-4 text-sm font-medium">{checkIn.date}</td>
                <td className="py-3 px-4 text-center">
                  {checkIn.completed ? (
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-sm font-mono tabular-nums font-medium",
                        checkIn.energy >= 7
                          ? "bg-success/10 text-success"
                          : checkIn.energy >= 5
                            ? "bg-warning/10 text-warning"
                            : "bg-error/10 text-error",
                      )}
                    >
                      {checkIn.energy}
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {checkIn.completed ? (
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-sm font-mono tabular-nums font-medium",
                        checkIn.mood >= 7
                          ? "bg-success/10 text-success"
                          : checkIn.mood >= 5
                            ? "bg-warning/10 text-warning"
                            : "bg-error/10 text-error",
                      )}
                    >
                      {checkIn.mood}
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {checkIn.completed ? (
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-sm font-mono tabular-nums font-medium",
                        checkIn.hunger <= 3
                          ? "bg-success/10 text-success"
                          : checkIn.hunger <= 5
                            ? "bg-warning/10 text-warning"
                            : "bg-error/10 text-error",
                      )}
                    >
                      {checkIn.hunger}
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {checkIn.completed ? (
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-sm font-mono tabular-nums font-medium",
                        checkIn.sleep >= 7
                          ? "bg-success/10 text-success"
                          : checkIn.sleep >= 5
                            ? "bg-warning/10 text-warning"
                            : "bg-error/10 text-error",
                      )}
                    >
                      {checkIn.sleep}
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {checkIn.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success mx-auto" />
                  ) : (
                    <Circle className="h-5 w-5 text-text-muted mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
