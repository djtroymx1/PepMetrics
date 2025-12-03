"use client"

import { ProgressBar, BadgeDelta } from "@tremor/react"
import { Calendar, Clock, Target, ChevronRight, MoreVertical, Syringe, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface Protocol {
  id: string
  name: string
  peptides: string[]
  dosage: string
  frequency: string
  duration: string
  startDate: string
  progress: number
  status: "active" | "paused" | "completed"
  phase?: string
  nextDose?: string
  completedDoses?: number
  totalDoses?: number
}

interface ProtocolCardProps {
  protocol: Protocol
  isSelected?: boolean
  onSelect?: () => void
}

export function ProtocolCard({ protocol, isSelected, onSelect }: ProtocolCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
        isSelected && "ring-2 ring-primary/30 border-primary/50",
        protocol.status === "paused" && "opacity-75"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              protocol.status === "active" && "bg-primary/10",
              protocol.status === "paused" && "bg-amber-500/10",
              protocol.status === "completed" && "bg-muted"
            )}>
              <Syringe className={cn(
                "h-5 w-5",
                protocol.status === "active" && "text-primary",
                protocol.status === "paused" && "text-amber-500",
                protocol.status === "completed" && "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="font-semibold">{protocol.name}</h3>
              {protocol.phase && (
                <p className="text-xs text-muted-foreground">{protocol.phase}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 ml-12">
            {protocol.peptides.map((peptide) => (
              <span
                key={peptide}
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
              >
                {peptide}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1",
              protocol.status === "active" && "bg-emerald-500/10 text-emerald-500",
              protocol.status === "paused" && "bg-amber-500/10 text-amber-500",
              protocol.status === "completed" && "bg-muted text-muted-foreground",
            )}
          >
            {protocol.status === "active" && <Play className="h-3 w-3" />}
            {protocol.status === "paused" && <Pause className="h-3 w-3" />}
            {protocol.status}
          </span>
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Dosage</p>
            <p className="text-sm font-medium font-mono tabular-nums">{protocol.dosage}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Frequency</p>
            <p className="text-sm font-medium">{protocol.frequency}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">{protocol.duration}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Progress</span>
          <div className="flex items-center gap-2">
            {protocol.completedDoses && protocol.totalDoses && (
              <span className="text-xs text-muted-foreground">
                {protocol.completedDoses}/{protocol.totalDoses} doses
              </span>
            )}
            <span className="text-xs font-semibold tabular-nums font-mono">{protocol.progress}%</span>
          </div>
        </div>
        <ProgressBar
          value={protocol.progress}
          color={
            protocol.status === "completed" ? "gray" :
            protocol.status === "paused" ? "amber" :
            protocol.progress >= 75 ? "emerald" :
            protocol.progress >= 50 ? "teal" :
            "blue"
          }
          className="mt-2"
          showAnimation={true}
        />
      </div>

      {protocol.nextDose && protocol.status === "active" && (
        <div className="flex items-center justify-between text-sm bg-muted/50 rounded-lg px-3 py-2">
          <span className="text-muted-foreground">Next dose:</span>
          <span className="font-medium">{protocol.nextDose}</span>
        </div>
      )}

      {isSelected && (
        <button className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          View Details
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
