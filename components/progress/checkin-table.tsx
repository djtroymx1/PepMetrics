"use client"

import { Tracker, BadgeDelta } from "@tremor/react"
import { CheckCircle2, Circle, ClipboardCheck } from "lucide-react"
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

// Create tracker data for visualization
const trackerData = checkIns.map((checkIn) => ({
  color: checkIn.completed
    ? (checkIn.energy + checkIn.mood + checkIn.sleep) / 3 >= 7
      ? "emerald"
      : "amber"
    : "gray",
  tooltip: checkIn.completed
    ? `${checkIn.date}: Energy ${checkIn.energy}, Mood ${checkIn.mood}, Sleep ${checkIn.sleep}`
    : `${checkIn.date}: Not completed`,
}))

const ScoreBadge = ({ value, inverted = false }: { value: number; inverted?: boolean }) => {
  if (value === 0) return <span className="text-muted-foreground">-</span>

  const isGood = inverted ? value <= 3 : value >= 7
  const isOkay = inverted ? value <= 5 : value >= 5

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-lg text-sm font-mono tabular-nums font-semibold",
        isGood
          ? "bg-emerald-500/10 text-emerald-500"
          : isOkay
            ? "bg-amber-500/10 text-amber-500"
            : "bg-rose-500/10 text-rose-500",
      )}
    >
      {value}
    </span>
  )
}

export function CheckinTable() {
  const completedCount = checkIns.filter((c) => c.completed).length

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <ClipboardCheck className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Daily Check-Ins</h2>
            <p className="text-sm text-muted-foreground">Track how you feel each day (1-10 scale)</p>
          </div>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          Today's Check-In
        </button>
      </div>

      {/* Week overview tracker */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Week Overview</p>
          <p className="text-xs text-muted-foreground">
            {completedCount}/{checkIns.length} completed
          </p>
        </div>
        <Tracker data={trackerData} className="mt-2" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Date
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Energy
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Mood
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Hunger
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sleep
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {checkIns.map((checkIn) => (
              <tr key={checkIn.date} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-sm font-medium">{checkIn.date}</td>
                <td className="py-3 px-4 text-center">
                  <ScoreBadge value={checkIn.energy} />
                </td>
                <td className="py-3 px-4 text-center">
                  <ScoreBadge value={checkIn.mood} />
                </td>
                <td className="py-3 px-4 text-center">
                  <ScoreBadge value={checkIn.hunger} inverted />
                </td>
                <td className="py-3 px-4 text-center">
                  <ScoreBadge value={checkIn.sleep} />
                </td>
                <td className="py-3 px-4 text-center">
                  {checkIn.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mx-auto" />
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
