"use client"

import { useState, useMemo } from "react"
import { X, Loader2, Search, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { PEPTIDES, PEPTIDE_CATEGORIES, getPeptideById, type PeptideDefinition } from "@/lib/peptides"
import { addProtocol } from "@/lib/storage"
import type { FrequencyType, TimingPreference, DayOfWeek, Protocol } from "@/lib/types"
import { TIMING_INFO, DAY_OF_WEEK_SHORT } from "@/lib/types"

interface AddProtocolModalProps {
  isOpen: boolean
  onClose: () => void
  onProtocolAdded?: (protocol: Protocol) => void
}

const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export function AddProtocolModal({ isOpen, onClose, onProtocolAdded }: AddProtocolModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [peptideId, setPeptideId] = useState<string>("")
  const [customPeptideName, setCustomPeptideName] = useState("")
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

  // Peptide search
  const [searchQuery, setSearchQuery] = useState("")
  const [showPeptideDropdown, setShowPeptideDropdown] = useState(false)

  const selectedPeptide = useMemo(() => getPeptideById(peptideId), [peptideId])

  const filteredPeptides = useMemo(() => {
    if (!searchQuery) return PEPTIDES
    const query = searchQuery.toLowerCase()
    return PEPTIDES.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const groupedPeptides = useMemo(() => {
    const groups: Record<string, PeptideDefinition[]> = {}
    for (const peptide of filteredPeptides) {
      if (!groups[peptide.category]) {
        groups[peptide.category] = []
      }
      groups[peptide.category].push(peptide)
    }
    return groups
  }, [filteredPeptides])

  const handleSelectPeptide = (peptide: PeptideDefinition) => {
    setPeptideId(peptide.id)
    setSearchQuery(peptide.name)
    setShowPeptideDropdown(false)
    // Set default dose if available
    if (peptide.commonDoses.length > 0) {
      setDose(peptide.commonDoses[0])
    }
    // Set default timing based on fasting requirement
    if (peptide.requiresFasting) {
      setTimingPreference("morning-fasted")
    }
  }

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
      const protocolData: Omit<Protocol, 'id' | 'createdAt' | 'updatedAt'> = {
        odId: crypto.randomUUID(),
        peptideId: peptideId || 'custom',
        customPeptideName: peptideId === 'custom' || !peptideId ? customPeptideName : undefined,
        dose: dose.trim(),
        frequencyType,
        specificDays: frequencyType === 'specific-days' ? specificDays : undefined,
        intervalDays: frequencyType === 'every-x-days' ? parseInt(intervalDays) : undefined,
        cycleOnDays: frequencyType === 'cycling' ? parseInt(cycleOnDays) : undefined,
        cycleOffDays: frequencyType === 'cycling' ? parseInt(cycleOffDays) : undefined,
        cycleStartDate: frequencyType === 'cycling' ? startDate : undefined,
        timingPreference,
        preferredTime: preferredTime || undefined,
        dosesPerDay: parseInt(dosesPerDay),
        status: 'active',
        startDate,
      }

      const newProtocol = addProtocol(protocolData)
      onProtocolAdded?.(newProtocol)
      resetForm()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create protocol")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setPeptideId("")
    setCustomPeptideName("")
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
    setSearchQuery("")
    setError(null)
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
          {/* Peptide Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Peptide *</label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search peptides..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowPeptideDropdown(true)
                    if (!e.target.value) setPeptideId("")
                  }}
                  onFocus={() => setShowPeptideDropdown(true)}
                  className="w-full rounded-lg border border-border bg-muted pl-9 pr-9 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {showPeptideDropdown && (
                <div className="absolute z-20 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                  {/* Custom option */}
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted border-b border-border"
                    onClick={() => {
                      setPeptideId("custom")
                      setShowPeptideDropdown(false)
                      setSearchQuery("")
                    }}
                  >
                    <span className="font-medium">+ Add Custom Peptide</span>
                  </button>

                  {Object.entries(groupedPeptides).map(([category, peptides]) => (
                    <div key={category}>
                      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 uppercase tracking-wider">
                        {PEPTIDE_CATEGORIES[category as keyof typeof PEPTIDE_CATEGORIES]}
                      </div>
                      {peptides.map((peptide) => (
                        <button
                          key={peptide.id}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm hover:bg-muted",
                            peptideId === peptide.id && "bg-primary/10"
                          )}
                          onClick={() => handleSelectPeptide(peptide)}
                        >
                          <div className="font-medium">{peptide.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {peptide.typicalFrequency} {peptide.requiresFasting ? "- Fasting required" : ""}
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

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

            {/* Selected peptide info */}
            {selectedPeptide && selectedPeptide.id !== 'custom' && (
              <div className="mt-2 text-xs text-muted-foreground">
                {selectedPeptide.notes}
              </div>
            )}
          </div>

          {/* Dose */}
          <div>
            <label className="block text-sm font-medium mb-2">Dose *</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., 250mcg, 2mg"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            {selectedPeptide && selectedPeptide.commonDoses.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedPeptide.commonDoses.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDose(d)}
                    className={cn(
                      "px-2 py-0.5 text-xs rounded-md transition-colors",
                      dose === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
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
              Create Protocol
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
