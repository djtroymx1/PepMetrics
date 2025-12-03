"use client"

import { useState } from "react"
import { Calendar, Clock, Target, ChevronRight, MoreVertical } from "lucide-react"
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
}

const mockProtocols: Protocol[] = [
  {
    id: "1",
    name: "Retatrutide Protocol",
    peptides: ["Retatrutide"],
    dosage: "2 mg",
    frequency: "Weekly",
    duration: "24 weeks",
    startDate: "2024-10-15",
    progress: 25,
    status: "active",
    phase: "Titration - Week 6",
  },
  {
    id: "2",
    name: "Recovery Stack",
    peptides: ["BPC-157", "TB-500"],
    dosage: "250/500 mcg",
    frequency: "Daily",
    duration: "8 weeks",
    startDate: "2024-11-01",
    progress: 45,
    status: "active",
  },
  {
    id: "3",
    name: "Glow Stack",
    peptides: ["GHK-Cu", "SS-31"],
    dosage: "Various",
    frequency: "Daily",
    duration: "12 weeks",
    startDate: "2024-10-20",
    progress: 35,
    status: "active",
  },
  {
    id: "4",
    name: "MOTS-c Protocol",
    peptides: ["MOTS-c"],
    dosage: "10 mg",
    frequency: "2x/week",
    duration: "Ongoing",
    startDate: "2024-10-01",
    progress: 100,
    status: "active",
  },
]

export function ProtocolList() {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active Protocols</h2>
        <span className="text-sm text-muted-foreground">
          {mockProtocols.filter((p) => p.status === "active").length} active
        </span>
      </div>

      <div className="space-y-3">
        {mockProtocols.map((protocol) => (
          <div
            key={protocol.id}
            className={cn(
              "rounded-xl border border-border bg-card p-5 cursor-pointer transition-all hover:border-primary/50",
              selectedProtocol === protocol.id && "ring-2 ring-primary/30 border-primary/50",
            )}
            onClick={() => setSelectedProtocol(protocol.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{protocol.name}</h3>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      protocol.status === "active" && "bg-green-500/10 text-green-500",
                      protocol.status === "paused" && "bg-amber-500/10 text-amber-500",
                      protocol.status === "completed" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {protocol.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {protocol.peptides.map((peptide) => (
                    <span key={peptide} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                      {peptide}
                    </span>
                  ))}
                </div>
                {protocol.phase && (
                  <p className="text-xs text-muted-foreground mt-2">{protocol.phase}</p>
                )}
              </div>
              <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium tabular-nums font-mono">{protocol.progress}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${protocol.progress}%` }}
                />
              </div>
            </div>

            {selectedProtocol === protocol.id && (
              <button className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                View Details
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
