"use client"

import { useState } from "react"
import { Calendar, Clock, Target, ChevronRight, MoreVertical, Plus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProtocols } from "@/hooks/use-protocols"
import { AddProtocolModal } from "@/components/add-protocol-modal"
import type { Protocol } from "@/types/database"

// Calculate progress based on start date and duration
function calculateProgress(startDate: string, duration: string | null): number {
  if (!duration || duration.toLowerCase() === 'ongoing') return 100

  const start = new Date(startDate)
  const now = new Date()
  const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  // Parse duration (e.g., "8 weeks", "24 weeks", "12 weeks")
  const match = duration.match(/(\d+)\s*weeks?/i)
  if (!match) return 50

  const totalDays = parseInt(match[1]) * 7
  const progress = Math.min(100, Math.round((daysSinceStart / totalDays) * 100))
  return Math.max(0, progress)
}

export function ProtocolList() {
  const { protocols, loading, error } = useProtocols()
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
        <p className="text-red-500">Error loading protocols: {error}</p>
      </div>
    )
  }

  const activeProtocols = protocols.filter((p) => p.status === "active")

  if (protocols.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Protocols</h2>
        </div>
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium mb-2">No protocols yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first protocol to start tracking your peptide regimen.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Protocol
          </button>
        </div>
        <AddProtocolModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active Protocols</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {activeProtocols.length} active
          </span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted hover:border-primary/50 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {protocols.map((protocol) => {
          const progress = calculateProgress(protocol.start_date, protocol.duration)

          return (
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
                        protocol.status === "archived" && "bg-muted text-muted-foreground",
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
                    <p className="text-sm font-medium font-mono tabular-nums">{protocol.dosage || '-'}</p>
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
                    <p className="text-sm font-medium">{protocol.duration || 'Ongoing'}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium tabular-nums font-mono">{progress}%</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
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
          )
        })}
      </div>
      <AddProtocolModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
