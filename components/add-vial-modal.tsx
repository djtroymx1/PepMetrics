"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { useVials } from "@/hooks/use-vials"

interface AddVialModalProps {
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

export function AddVialModal({ isOpen, onClose }: AddVialModalProps) {
  const { createVial } = useVials()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [peptideName, setPeptideName] = useState("Retatrutide")
  const [totalMg, setTotalMg] = useState("")
  const [concentration, setConcentration] = useState("")
  const [reconstitutionVolume, setReconstitutionVolume] = useState("")
  const [reconstitutionDate, setReconstitutionDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [lotNumber, setLotNumber] = useState("")
  const [vendor, setVendor] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = async () => {
    if (!peptideName) {
      setError("Please select a peptide")
      return
    }
    if (!totalMg || parseFloat(totalMg) <= 0) {
      setError("Please enter a valid total amount")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createVial({
        peptide_name: peptideName,
        total_mg: parseFloat(totalMg),
        remaining_mg: parseFloat(totalMg), // Start with full vial
        concentration: concentration || null,
        reconstitution_volume_ml: reconstitutionVolume ? parseFloat(reconstitutionVolume) : null,
        reconstitution_date: reconstitutionDate || null,
        expiry_date: expiryDate || null,
        lot_number: lotNumber || null,
        vendor: vendor || null,
        status: 'good',
        notes: notes || null,
      })

      // Reset form and close
      setPeptideName("Retatrutide")
      setTotalMg("")
      setConcentration("")
      setReconstitutionVolume("")
      setReconstitutionDate("")
      setExpiryDate("")
      setLotNumber("")
      setVendor("")
      setNotes("")
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add vial")
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
          <h2 className="text-xl font-semibold">Add Vial</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Peptide *</label>
            <select
              value={peptideName}
              onChange={(e) => setPeptideName(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {PEPTIDE_OPTIONS.map((peptide) => (
                <option key={peptide} value={peptide}>{peptide}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Total Amount (mg) *</label>
              <input
                type="number"
                placeholder="e.g., 5"
                value={totalMg}
                onChange={(e) => setTotalMg(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Concentration</label>
              <input
                type="text"
                placeholder="e.g., 2.5 mg/mL"
                value={concentration}
                onChange={(e) => setConcentration(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Reconstitution Volume (mL)</label>
              <input
                type="number"
                placeholder="e.g., 2"
                value={reconstitutionVolume}
                onChange={(e) => setReconstitutionVolume(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reconstitution Date</label>
              <input
                type="date"
                value={reconstitutionDate}
                onChange={(e) => setReconstitutionDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lot Number</label>
              <input
                type="text"
                placeholder="Optional"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vendor</label>
            <input
              type="text"
              placeholder="e.g., Peptide Sciences"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              placeholder="Storage conditions, batch info, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary"
              rows={2}
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
              Add Vial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
