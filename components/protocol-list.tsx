"use client"

import { useState, useEffect, useCallback } from "react"
import { Clock, MoreVertical, Plus, Loader2, Pause, Play, Trash2, ChevronDown, ChevronUp, AlertCircle, Check, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { getProtocols, updateProtocol, deleteProtocol as removeProtocol, getDoseLogs, markDoseAsTaken } from "@/lib/storage"
import { getPeptideById } from "@/lib/peptides"
import { getFrequencySummary, isDueToday, getCyclePhase, getDosesToday } from "@/lib/scheduling"
import { AddProtocolModal } from "@/components/add-protocol-modal"
import { TimingBadge } from "@/components/timing-badge"
import type { Protocol, DoseLog } from "@/lib/types"

export function ProtocolList() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null)
  const [showPaused, setShowPaused] = useState(false)

  const loadData = useCallback(() => {
    setProtocols(getProtocols())
    setDoseLogs(getDoseLogs())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleProtocolAdded = () => {
    loadData()
  }

  const handleToggleStatus = (id: string) => {
    const protocol = protocols.find(p => p.id === id)
    if (!protocol) return

    const newStatus = protocol.status === 'active' ? 'paused' : 'active'
    updateProtocol(id, { status: newStatus })
    loadData()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this protocol?')) {
      removeProtocol(id)
      loadData()
    }
  }

  const handleMarkTaken = (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId)
    if (!protocol) return

    const peptide = getPeptideById(protocol.peptideId)
    const peptideName = protocol.customPeptideName || peptide?.name || 'Unknown'
    const today = new Date().toISOString().split('T')[0]

    // Find which dose number to log
    const todaysDoses = getDosesToday([protocol], doseLogs)
    const nextPendingDose = todaysDoses.find(d => d.status === 'pending' || d.status === 'overdue')
    const doseNumber = nextPendingDose?.doseNumber || 1

    markDoseAsTaken(protocolId, today, doseNumber, peptideName, protocol.dose)
    loadData()
  }

  const handleEdit = (protocol: Protocol) => {
    setEditingProtocol(protocol)
    setIsAddModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddModalOpen(false)
    setEditingProtocol(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const activeProtocols = protocols.filter((p) => p.status === "active")
  const pausedProtocols = protocols.filter((p) => p.status === "paused")

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
        <AddProtocolModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProtocolAdded={handleProtocolAdded}
        />
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
        {activeProtocols.map((protocol) => (
          <ProtocolCard
            key={protocol.id}
            protocol={protocol}
            doseLogs={doseLogs}
            isSelected={selectedProtocol === protocol.id}
            onSelect={() => setSelectedProtocol(protocol.id)}
            onToggleStatus={() => handleToggleStatus(protocol.id)}
            onDelete={() => handleDelete(protocol.id)}
            onMarkTaken={() => handleMarkTaken(protocol.id)}
            onEdit={() => handleEdit(protocol)}
          />
        ))}
      </div>

      {/* Paused Protocols Section */}
      {pausedProtocols.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowPaused(!showPaused)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            {showPaused ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Paused Protocols ({pausedProtocols.length})
          </button>

          {showPaused && (
            <div className="space-y-3">
              {pausedProtocols.map((protocol) => (
                <ProtocolCard
                  key={protocol.id}
                  protocol={protocol}
                  doseLogs={doseLogs}
                  isSelected={selectedProtocol === protocol.id}
                  onSelect={() => setSelectedProtocol(protocol.id)}
                  onToggleStatus={() => handleToggleStatus(protocol.id)}
                  onDelete={() => handleDelete(protocol.id)}
                  onEdit={() => handleEdit(protocol)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <AddProtocolModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onProtocolAdded={handleProtocolAdded}
        editProtocol={editingProtocol}
        onProtocolUpdated={handleProtocolAdded}
      />
    </div>
  )
}

interface ProtocolCardProps {
  protocol: Protocol
  doseLogs: DoseLog[]
  isSelected: boolean
  onSelect: () => void
  onToggleStatus: () => void
  onDelete: () => void
  onMarkTaken?: () => void
  onEdit?: () => void
}

function ProtocolCard({
  protocol,
  doseLogs,
  isSelected,
  onSelect,
  onToggleStatus,
  onDelete,
  onMarkTaken,
  onEdit,
}: ProtocolCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const peptide = getPeptideById(protocol.peptideId)
  const peptideName = protocol.customPeptideName || peptide?.name || 'Unknown Peptide'
  const frequencySummary = getFrequencySummary(protocol)
  const dueToday = protocol.status === 'active' && isDueToday(protocol, doseLogs)
  const cyclePhase = protocol.frequencyType === 'cycling' ? getCyclePhase(protocol) : null

  // Check how many doses taken today
  const todaysDoses = getDosesToday([protocol], doseLogs)
  const dosesTakenToday = todaysDoses.filter(d => d.status === 'taken').length
  const allDosesTaken = dosesTakenToday >= protocol.dosesPerDay

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 transition-all cursor-pointer",
        protocol.status === 'paused' && "opacity-60",
        dueToday && !allDosesTaken && "border-primary/50 bg-primary/5",
        isSelected && "ring-2 ring-primary/30 border-primary/50",
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{peptideName}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                protocol.status === "active" && "bg-green-500/10 text-green-500",
                protocol.status === "paused" && "bg-amber-500/10 text-amber-500",
              )}
            >
              {protocol.status}
            </span>
            {cyclePhase && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  cyclePhase === 'on' ? "bg-blue-500/10 text-blue-500" : "bg-muted text-muted-foreground"
                )}
              >
                {cyclePhase === 'on' ? 'ON phase' : 'OFF phase'}
              </span>
            )}
          </div>

          {/* Dose and frequency info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <span className="font-mono tabular-nums">{protocol.dose}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {frequencySummary}
            </span>
            {protocol.dosesPerDay > 1 && (
              <span>{protocol.dosesPerDay}x daily</span>
            )}
          </div>

          {/* Timing badge */}
          <TimingBadge
            timing={protocol.timingPreference}
            showFastingIcon={peptide?.requiresFasting}
            size="sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mark as taken button - only show if due today and not all doses taken */}
          {dueToday && !allDosesTaken && onMarkTaken && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkTaken()
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <Check className="h-4 w-4" />
              Take{protocol.dosesPerDay > 1 ? ` (${dosesTakenToday + 1}/${protocol.dosesPerDay})` : ''}
            </button>
          )}

          {/* All doses taken indicator */}
          {allDosesTaken && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 text-green-500 text-xs font-medium">
              <Check className="h-3 w-3" />
              Done today
            </span>
          )}

          {/* Menu button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-border bg-card shadow-lg py-1">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleStatus()
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    {protocol.status === 'active' ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Resume
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Due today indicator */}
      {dueToday && !allDosesTaken && (
        <div className="flex items-center gap-1.5 text-xs text-primary">
          <AlertCircle className="h-3 w-3" />
          <span>Due today</span>
        </div>
      )}
    </div>
  )
}
