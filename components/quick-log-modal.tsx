"use client"

import { useState } from "react"
import { X, Syringe, Utensils, Weight, Droplets, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"

interface QuickLogModalProps {
  isOpen: boolean
  onClose: () => void
}

type LogType = "injection" | "meal" | "weight" | "water"

export function QuickLogModal({ isOpen, onClose }: QuickLogModalProps) {
  const [logType, setLogType] = useState<LogType>("injection")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 mb-4 sm:mb-0 rounded-lg border border-border bg-card shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 sticky top-0 bg-card z-10">
          <h2 className="text-xl font-semibold">Quick Log</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Log Type Tabs */}
        <div className="flex border-b border-border sticky top-[65px] bg-card z-10">
          {[
            { type: "injection" as LogType, icon: Syringe, label: "Injection" },
            { type: "meal" as LogType, icon: Utensils, label: "Meal" },
            { type: "weight" as LogType, icon: Weight, label: "Weight" },
            { type: "water" as LogType, icon: Droplets, label: "Water" },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setLogType(type)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                logType === type
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {logType === "injection" && <InjectionForm onClose={onClose} />}
          {logType === "meal" && <MealForm onClose={onClose} />}
          {logType === "weight" && <WeightForm onClose={onClose} />}
          {logType === "water" && <WaterForm onClose={onClose} />}
        </div>
      </div>
    </div>
  )
}

function InjectionForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [peptide, setPeptide] = useState("Retatrutide")
  const [dose, setDose] = useState("")
  const [doseUnit, setDoseUnit] = useState<"mcg" | "mg" | "IU">("mcg")
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [notes, setNotes] = useState("")

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in")
      return
    }
    if (!dose || parseFloat(dose) <= 0) {
      setError("Please enter a valid dosage")
      return
    }

    setLoading(true)
    setError(null)

    // Combine today's date with the selected time
    const today = new Date().toISOString().split('T')[0]
    const injectionTime = new Date(`${today}T${time}:00`)

    const { error: insertError } = await supabase.from('injections').insert({
      user_id: user.id,
      peptide_name: peptide,
      dose_value: parseFloat(dose),
      dose_unit: doseUnit,
      injection_site: selectedSite,
      injection_time: injectionTime.toISOString(),
      notes: notes || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      onClose()
    }
  }

  const sites = [
    { id: "left-abdomen", label: "Left Abdomen", x: 35, y: 45 },
    { id: "right-abdomen", label: "Right Abdomen", x: 65, y: 45 },
    { id: "left-thigh", label: "Left Thigh", x: 35, y: 75 },
    { id: "right-thigh", label: "Right Thigh", x: 65, y: 75 },
    { id: "left-arm", label: "Left Arm", x: 20, y: 35 },
    { id: "right-arm", label: "Right Arm", x: 80, y: 35 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Peptide</label>
          <select
            value={peptide}
            onChange={(e) => setPeptide(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option>Retatrutide</option>
            <option>BPC-157</option>
            <option>MOTS-c</option>
            <option>TB-500</option>
            <option>Tesamorelin</option>
            <option>Epithalon</option>
            <option>GHK-Cu</option>
            <option>SS-31</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Dosage</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="250"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
              step="0.01"
            />
            <select
              value={doseUnit}
              onChange={(e) => setDoseUnit(e.target.value as "mcg" | "mg" | "IU")}
              className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="mcg">mcg</option>
              <option value="mg">mg</option>
              <option value="IU">IU</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Injection Site</label>
        <div>
          <div className="relative w-full aspect-[2/3] max-w-xs mx-auto rounded-lg border border-border bg-muted/50 p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="12" r="8" fill="none" stroke="#27272a" strokeWidth="1.5" />
              <rect x="42" y="20" width="16" height="35" rx="2" fill="none" stroke="#27272a" strokeWidth="1.5" />
              <line x1="42" y1="25" x2="25" y2="40" stroke="#27272a" strokeWidth="1.5" />
              <line x1="58" y1="25" x2="75" y2="40" stroke="#27272a" strokeWidth="1.5" />
              <line x1="45" y1="55" x2="40" y2="85" stroke="#27272a" strokeWidth="1.5" />
              <line x1="55" y1="55" x2="60" y2="85" stroke="#27272a" strokeWidth="1.5" />

              {sites.map((site) => (
                <circle
                  key={site.id}
                  cx={site.x}
                  cy={site.y}
                  r="4"
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedSite === site.id
                      ? "fill-primary stroke-primary"
                      : "fill-muted stroke-border hover:fill-primary/20",
                  )}
                  strokeWidth="2"
                  onClick={() => setSelectedSite(site.id)}
                />
              ))}
            </svg>
          </div>

          {selectedSite && (
            <p className="text-sm text-center mt-3 font-medium text-primary">
              {sites.find((s) => s.id === selectedSite)?.label}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
        <textarea
          placeholder="Any reactions, side effects, or observations..."
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

      <div className="flex gap-3 justify-end">
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
          Log Injection
        </button>
      </div>
    </div>
  )
}

function MealForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in")
      return
    }

    setLoading(true)
    setError(null)

    const { error: insertError } = await supabase.from('meals').insert({
      user_id: user.id,
      meal_type: mealType,
      meal_time: new Date().toISOString(),
      calories: calories ? parseInt(calories) : null,
      protein_g: protein ? parseFloat(protein) : null,
      carbs_g: carbs ? parseFloat(carbs) : null,
      description: description || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      onClose()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Meal Type</label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value as typeof mealType)}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-2">Calories</label>
          <input
            type="number"
            placeholder="450"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Protein (g)</label>
          <input
            type="number"
            placeholder="35"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Carbs (g)</label>
          <input
            type="number"
            placeholder="45"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          placeholder="Grilled chicken, brown rice, steamed broccoli..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary"
          rows={3}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="flex gap-3 justify-end">
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
          Log Meal
        </button>
      </div>
    </div>
  )
}

function WeightForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [weight, setWeight] = useState("")
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs")
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [notes, setNotes] = useState("")

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in")
      return
    }
    if (!weight || parseFloat(weight) <= 0) {
      setError("Please enter a valid weight")
      return
    }

    setLoading(true)
    setError(null)

    const today = new Date().toISOString().split('T')[0]
    const measuredAt = new Date(`${today}T${time}:00`)

    const { error: insertError } = await supabase.from('weights').insert({
      user_id: user.id,
      value: parseFloat(weight),
      unit: unit,
      measured_at: measuredAt.toISOString(),
      notes: notes || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      onClose()
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="185.2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
              step="0.1"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as "lbs" | "kg")}
              className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
        <textarea
          placeholder="Weighed after fasting, before breakfast..."
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

      <div className="flex gap-3 justify-end">
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
          Log Weight
        </button>
      </div>
    </div>
  )
}

function WaterForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [glasses, setGlasses] = useState(0)

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in")
      return
    }
    if (glasses <= 0) {
      setError("Please select at least one glass")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const amountOz = glasses * 8 // 8 oz per glass

      const { error: insertError } = await supabase.from('water_intake').insert({
        user_id: user.id,
        amount_oz: amountOz,
        logged_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error('Water intake insert error:', insertError)
        setError(insertError.message)
        setLoading(false)
      } else {
        setLoading(false)
        onClose()
      }
    } catch (err) {
      console.error('Water intake exception:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Tap to add glasses of water (8 oz each)</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => setGlasses(Math.max(0, glasses - 1))}
            className="h-10 w-10 rounded-full border border-border hover:bg-muted transition-colors"
          >
            -
          </button>
          <div className="text-4xl font-semibold tabular-nums w-20 text-center">{glasses}</div>
          <button
            onClick={() => setGlasses(glasses + 1)}
            className="h-10 w-10 rounded-full border border-border hover:bg-muted transition-colors"
          >
            +
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {(glasses * 8).toFixed(0)} oz / {(glasses * 0.237).toFixed(1)} liters
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <button
            key={num}
            onClick={() => setGlasses(num)}
            className={cn(
              "aspect-square rounded-lg border transition-colors",
              glasses >= num ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted",
            )}
          >
            <Droplets className="h-6 w-6 mx-auto" />
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="flex gap-3 justify-end">
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
          Log Water
        </button>
      </div>
    </div>
  )
}
