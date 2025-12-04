"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { X, Loader2, AlertTriangle, Shield, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { PeptideSelector, VialSizeSelector, StackConcentrationInput, type PeptideOrStack } from "@/components/peptide"
import { getPeptideById, getStackById, formatDoseRange, getStackComponents } from "@/lib/data/peptides"
import { addProtocol, updateProtocol } from "@/lib/storage"
import type { FrequencyType, TimingPreference, DayOfWeek, Protocol, StackComponentConcentration } from "@/lib/types"
import { TIMING_INFO, DAY_OF_WEEK_SHORT } from "@/lib/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AddProtocolModalProps {
  isOpen: boolean
  onClose: () => void
  onProtocolAdded?: (protocol: Protocol) => void
  editProtocol?: Protocol | null
  onProtocolUpdated?: (protocol: Protocol) => void
}

const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export function AddProtocolModal({ isOpen, onClose, onProtocolAdded, editProtocol, onProtocolUpdated }: AddProtocolModalProps) {
  const isEditMode = !!editProtocol
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [peptideId, setPeptideId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<PeptideOrStack | null>(null)
  const [customPeptideName, setCustomPeptideName] = useState("")
  const [vialSize, setVialSize] = useState<number | null>(null)
  const [stackConcentrations, setStackConcentrations] = useState<StackComponentConcentration[]>([])
  const [dose, setDose] = useState("")
  const [frequencyType, setFrequencyType] = useState<FrequencyType>("daily")
  const [specificDays, setSpecificDays] = useState<DayOfWeek[]>([])
  const [intervalDays, setIntervalDays] = useState("2")
  const [cycleOnDays, setCycleOnDays] = useState("5")
  const [cycleOffDays, setCycleOffDays] = useState("2")
  const [timingPreference, setTimingPreference] = useState<TimingPreference>("morning-fasted")
  const [preferredTime, setPreferredTime] = useState("")
  const [dosesPerDay, setDosesPerDay] = useState("1")
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

  // Populate form when editing
  useEffect(() => {
    if (editProtocol && isOpen) {
      setPeptideId(editProtocol.peptideId)
      setCustomPeptideName(editProtocol.customPeptideName || "")
      setVialSize(editProtocol.vialSize ?? null)
      setStackConcentrations(editProtocol.stackConcentrations || [])
      setDose(editProtocol.dose)
      setFrequencyType(editProtocol.frequencyType)
      setSpecificDays(editProtocol.specificDays || [])
      setIntervalDays(String(editProtocol.intervalDays || 2))
      setCycleOnDays(String(editProtocol.cycleOnDays || 5))
      setCycleOffDays(String(editProtocol.cycleOffDays || 2))
      setTimingPreference(editProtocol.timingPreference)
      setPreferredTime(editProtocol.preferredTime || "")
      setDosesPerDay(String(editProtocol.dosesPerDay))
      setStartDate(editProtocol.startDate)

      // Set selectedItem based on peptideId
      const peptide = getPeptideById(editProtocol.peptideId)
      if (peptide) {
        setSelectedItem({ type: 'peptide', data: peptide })
      } else {
        const stack = getStackById(editProtocol.peptideId)
        if (stack) {
          setSelectedItem({ type: 'stack', data: stack })
        } else if (editProtocol.peptideId === 'custom') {
          setSelectedItem({ type: 'custom' })
        }
      }
    } else if (!editProtocol && isOpen) {
      // Reset form when opening in add mode
      resetForm()
    }
  }, [editProtocol, isOpen])

  // Get peptide/stack info for display
  const itemInfo = useMemo(() => {
    if (!peptideId || peptideId === 'custom') return null

    const peptide = getPeptideById(peptideId)
    if (peptide) return { type: 'peptide' as const, data: peptide }

    const stack = getStackById(peptideId)
    if (stack) return { type: 'stack' as const, data: stack }

    return null
  }, [peptideId])

  // Determine if this is a stack
  const isStack = itemInfo?.type === 'stack'

  // Handle peptide selection change
  const handlePeptideChange = useCallback((id: string | null, item: PeptideOrStack | null) => {
    setPeptideId(id)
    setSelectedItem(item)
    setVialSize(null)
    setStackConcentrations([])

    if (item?.type === 'peptide') {
      // Set defaults from peptide
      if (item.data.fastingRequired) {
        setTimingPreference("morning-fasted")
      }
    } else if (item?.type === 'stack') {
      // Set defaults from stack
      if (item.data.fastingRequired) {
        setTimingPreference("morning-fasted")
      }
    }
  }, [])

  const handleToggleDay = (day: DayOfWeek) => {
    setSpecificDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const handleSubmit = async () => {
    // Validation
    if (!peptideId && !customPeptideName.trim()) {
      setError("Please select a peptide or enter a custom name")
      return
    }
    if (!dose.trim()) {
      setError("Please enter a dose")
      return
    }
    if (frequencyType === 'specific-days' && specificDays.length === 0) {
      setError("Please select at least one day")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Determine peptide name for display
      let displayName = customPeptideName
      if (peptideId && peptideId !== 'custom') {
        if (itemInfo?.type === 'peptide') {
          displayName = itemInfo.data.name
        } else if (itemInfo?.type === 'stack') {
          displayName = itemInfo.data.name
        }
      }

      const protocolData = {
        odId: isEditMode ? editProtocol.odId : crypto.randomUUID(),
        peptideId: peptideId || 'custom',
        customPeptideName: peptideId === 'custom' || !peptideId ? customPeptideName : displayName,
        dose: dose.trim(),
        // For individual peptides, use vialSize; for stacks, use stackConcentrations
        vialSize: !isStack ? (vialSize ?? undefined) : undefined,
        stackConcentrations: isStack && stackConcentrations.length > 0 ? stackConcentrations : undefined,
        frequencyType,
        specificDays: frequencyType === 'specific-days' ? specificDays : undefined,
        intervalDays: frequencyType === 'every-x-days' ? parseInt(intervalDays) : undefined,
        cycleOnDays: frequencyType === 'cycling' ? parseInt(cycleOnDays) : undefined,
        cycleOffDays: frequencyType === 'cycling' ? parseInt(cycleOffDays) : undefined,
        cycleStartDate: frequencyType === 'cycling' ? startDate : undefined,
        timingPreference,
        preferredTime: preferredTime || undefined,
        dosesPerDay: parseInt(dosesPerDay),
        status: isEditMode ? editProtocol.status : 'active' as const,
        startDate,
      }

      if (isEditMode) {
        const updatedProtocol = updateProtocol(editProtocol.id, protocolData)
        if (updatedProtocol) {
          onProtocolUpdated?.(updatedProtocol)
        }
      } else {
        const newProtocol = addProtocol(protocolData)
        onProtocolAdded?.(newProtocol)
      }
      resetForm()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create protocol")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setPeptideId(null)
    setSelectedItem(null)
    setCustomPeptideName("")
    setVialSize(null)
    setStackConcentrations([])
    setDose("")
    setFrequencyType("daily")
    setSpecificDays([])
    setIntervalDays("2")
    setCycleOnDays("5")
    setCycleOffDays("2")
    setTimingPreference("morning-fasted")
    setPreferredTime("")
    setDosesPerDay("1")
    setStartDate(new Date().toISOString().split('T')[0])
    setError(null)
  }

  if (!isOpen) return null

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-lg mx-4 mb-4 sm:mb-0 rounded-lg border border-border bg-card shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border p-4 sticky top-0 bg-card z-10">
            <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Protocol' : 'Add Protocol'}</h2>
            <button onClick={onClose} className="rounded-md p-1 hover:bg-muted transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Peptide Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Peptide *</label>
              <PeptideSelector
                value={peptideId}
                onChange={handlePeptideChange}
                showStacks={true}
              />

              {/* Custom peptide name input */}
              {peptideId === 'custom' && (
                <input
                  type="text"
                  placeholder="Enter peptide name..."
                  value={customPeptideName}
                  onChange={(e) => setCustomPeptideName(e.target.value)}
                  className="w-full mt-2 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              )}

              {/* Selected item info */}
              {itemInfo && (
                <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                  {itemInfo.type === 'peptide' && (
                    <>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {itemInfo.data.fdaApproved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                            <Shield className="h-3 w-3" />
                            FDA Approved
                          </span>
                        )}
                        {itemInfo.data.fastingRequired && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium cursor-help">
                                <AlertTriangle className="h-3 w-3" />
                                Fasting Required
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{itemInfo.data.fastingNotes || 'Fasting required for optimal results'}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {itemInfo.data.frequency} | Dose: {formatDoseRange(itemInfo.data.doseRange)} | Route: {itemInfo.data.route}
                      </p>
                      {itemInfo.data.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{itemInfo.data.notes}</p>
                      )}
                    </>
                  )}
                  {itemInfo.type === 'stack' && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-xs font-medium">
                          <Layers className="h-3 w-3" />
                          Stack
                        </span>
                        {itemInfo.data.fastingRequired && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                            <AlertTriangle className="h-3 w-3" />
                            Fasting Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Contains:</p>
                      <div className="flex flex-wrap gap-1">
                        {getStackComponents(itemInfo.data).map((p, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                            {p?.name || 'Unknown'}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Vial Size / Stack Concentrations */}
            {peptideId && peptideId !== 'custom' && (
              isStack && itemInfo?.type === 'stack' ? (
                <StackConcentrationInput
                  stackId={peptideId}
                  value={stackConcentrations}
                  onChange={setStackConcentrations}
                />
              ) : (
                <VialSizeSelector
                  peptideId={peptideId}
                  value={vialSize}
                  onChange={setVialSize}
                />
              )
            )}

            {/* Custom peptide vial size */}
            {peptideId === 'custom' && (
              <VialSizeSelector
                peptideId={peptideId}
                value={vialSize}
                onChange={setVialSize}
              />
            )}

            {/* Dose */}
            <div>
              <label className="block text-sm font-medium mb-2">Dose *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 250mcg, 2mg, 0.1ml"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              {itemInfo?.type === 'peptide' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Typical range: {formatDoseRange(itemInfo.data.doseRange)}
                </p>
              )}
              {isStack && (
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your injection volume (e.g., 0.1ml) or total units
                </p>
              )}
            </div>

            {/* Frequency Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Frequency *</label>
              <div className="grid grid-cols-2 gap-2">
                {(['daily', 'specific-days', 'every-x-days', 'cycling'] as FrequencyType[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequencyType(freq)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-lg border transition-colors",
                      frequencyType === freq
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {freq === 'daily' && 'Daily'}
                    {freq === 'specific-days' && 'Specific Days'}
                    {freq === 'every-x-days' && 'Every X Days'}
                    {freq === 'cycling' && 'Cycling'}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency-specific options */}
            {frequencyType === 'specific-days' && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                        specificDays.includes(day)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      {DAY_OF_WEEK_SHORT[day]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {frequencyType === 'every-x-days' && (
              <div>
                <label className="block text-sm font-medium mb-2">Every how many days?</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(e.target.value)}
                  className="w-24 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <span className="ml-2 text-sm text-muted-foreground">days</span>
              </div>
            )}

            {frequencyType === 'cycling' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Days ON</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={cycleOnDays}
                    onChange={(e) => setCycleOnDays(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Days OFF</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={cycleOffDays}
                    onChange={(e) => setCycleOffDays(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Timing Preference */}
            <div>
              <label className="block text-sm font-medium mb-2">Timing Preference</label>
              <select
                value={timingPreference}
                onChange={(e) => setTimingPreference(e.target.value as TimingPreference)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {Object.entries(TIMING_INFO).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.label} {info.requiresFasting ? '(fasted)' : ''}
                  </option>
                ))}
              </select>
              {itemInfo?.type === 'peptide' && itemInfo.data.fastingRequired && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  This peptide works best when taken fasted
                </p>
              )}
            </div>

            {/* Preferred Time (optional) */}
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Time (optional)</label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Doses Per Day */}
            <div>
              <label className="block text-sm font-medium mb-2">Doses Per Day</label>
              <div className="flex gap-2">
                {['1', '2', '3'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDosesPerDay(num)}
                    className={cn(
                      "flex-1 px-3 py-2 text-sm rounded-lg border transition-colors",
                      dosesPerDay === num
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {num}x
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Actions */}
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
                {isEditMode ? 'Save Changes' : 'Create Protocol'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
