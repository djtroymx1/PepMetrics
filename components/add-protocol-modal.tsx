"use client"

import { useState } from "react"
import { X, Plus, Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProtocols } from "@/hooks/use-protocols"

interface AddProtocolModalProps {
  isOpen: boolean
  onClose: () => void
}

const PEPTIDE_OPTIONS = [
  "Retatrutide",
  "BPC-157",
  "MOTS-c",
  "TB-500",
  "Tesamorelin",
  "Epithalon",
  "GHK-Cu",
  "SS-31",
  "Semaglutide",
  "Tirzepatide",
  "CJC-1295",
  "Ipamorelin",
]

const FREQUENCY_OPTIONS = [
  "Daily",
  "Every other day",
  "2x weekly",
  "3x weekly",
  "Weekly",
  "Bi-weekly",
  "Monthly",
]

export function AddProtocolModal({ isOpen, onClose }: AddProtocolModalProps) {
  const { createProtocol } = useProtocols()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [peptides, setPeptides] = useState<string[]>([])
  const [newPeptide, setNewPeptide] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("Weekly")
  const [duration, setDuration] = useState("")
  const [phase, setPhase] = useState("")
  const [notes, setNotes] = useState("")

  const handleAddPeptide = () => {
    if (newPeptide && !peptides.includes(newPeptide)) {
      setPeptides([...peptides, newPeptide])
      setNewPeptide("")
    }
  }

  const handleRemovePeptide = (peptide: string) => {
    setPeptides(peptides.filter(p => p !== peptide))
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter a protocol name")
      return
    }
    if (peptides.length === 0) {
      setError("Please add at least one peptide")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createProtocol({
        name: name.trim(),
        peptides,
        dosage: dosage || null,
        frequency,
        duration: duration || null,
        start_date: new Date().toISOString().split('T')[0],
        status: 'active',
        phase: phase || null,
        notes: notes || null,
      })

      // Reset form and close
      setName("")
      setPeptides([])
      setDosage("")
      setFrequency("Weekly")
      setDuration("")
      setPhase("")
      setNotes("")
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create protocol")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-4 mb-4 sm:mb-0 rounded-lg border border-border bg-card shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border p-4 sticky top-0 bg-card z-10">
          <h2 className="text-xl font-semibold">Add Protocol</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Protocol Name *</label>
            <input
              type="text"
              placeholder="e.g., Weight Loss Stack, Recovery Protocol"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Peptides *</label>
            <div className="flex gap-2 mb-2">
              <select
                value={newPeptide}
                onChange={(e) => setNewPeptide(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Select a peptide...</option>
                {PEPTIDE_OPTIONS.filter(p => !peptides.includes(p)).map((peptide) => (
                  <option key={peptide} value={peptide}>{peptide}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddPeptide}
                disabled={!newPeptide}
                className="px-3 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {peptides.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {peptides.map((peptide) => (
                  <span
                    key={peptide}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-sm"
                  >
                    {peptide}
                    <button
                      onClick={() => handleRemovePeptide(peptide)}
                      className="hover:bg-primary/20 rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Dosage</label>
              <input
                type="text"
                placeholder="e.g., 250 mcg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Frequency *</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {FREQUENCY_OPTIONS.map((freq) => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <input
                type="text"
                placeholder="e.g., 8 weeks, Ongoing"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phase</label>
              <input
                type="text"
                placeholder="e.g., Loading, Maintenance"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              placeholder="Any additional notes about this protocol..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary"
              rows={3}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Protocol
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
