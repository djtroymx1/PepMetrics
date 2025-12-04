"use client"

import { useState, useEffect } from "react"
import { X, Syringe, Utensils, Weight, Droplets, Loader2, Check, Clock, AlertCircle, Shield, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"
import { getProtocols, getDoseLogs, markDoseAsTaken, markDoseAsSkipped } from "@/lib/storage"
import { getDosesToday, getOverdueDoses } from "@/lib/scheduling"
import { TimingBadge } from "@/components/timing-badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Protocol, DoseLog, ScheduledDose } from "@/lib/types"

interface QuickLogModalProps {
  isOpen: boolean
  onClose: () => void
  onDoseLogged?: () => void
}

type LogType = "injection" | "meal" | "weight" | "water"

export function QuickLogModal({ isOpen, onClose, onDoseLogged }: QuickLogModalProps) {
  const [logType, setLogType] = useState<LogType>("injection")
  const { user, loading: authLoading } = useAuth()

  const handleClose = () => {
    onClose()
  }

  const handleDoseLogged = () => {
    onDoseLogged?.()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 mb-4 sm:mb-0 rounded-lg border border-border bg-card shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 sticky top-0 bg-card z-10">
          <h2 className="text-xl font-semibold">Quick Log</h2>
          <button onClick={handleClose} className="rounded-md p-1 hover:bg-muted transition-colors">
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
          {logType === "injection" && <InjectionForm onDoseLogged={handleDoseLogged} onClose={handleClose} />}
          {logType === "meal" && <MealForm user={user} authLoading={authLoading} onClose={handleClose} />}
          {logType === "weight" && <WeightForm user={user} authLoading={authLoading} onClose={handleClose} />}
          {logType === "water" && <WaterForm user={user} authLoading={authLoading} onClose={handleClose} />}
        </div>
      </div>
    </div>
  )
}

// New injection form that works with the protocol/scheduling system
function InjectionForm({ onDoseLogged, onClose }: { onDoseLogged: () => void, onClose: () => void }) {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([])
  const [pendingDoses, setPendingDoses] = useState<ScheduledDose[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const prots = getProtocols()
    const logs = getDoseLogs()
    setProtocols(prots)
    setDoseLogs(logs)

    // Get today's pending/overdue doses
    const todayDoses = getDosesToday(prots.filter(p => p.status === 'active'), logs)
    const overdueDoses = getOverdueDoses(prots.filter(p => p.status === 'active'), logs)

    // Combine and filter for actionable doses
    const actionable = [...overdueDoses, ...todayDoses].filter(
      d => d.status === 'pending' || d.status === 'overdue'
    )

    // Remove duplicates (by protocolId + scheduledDate + doseNumber)
    const unique = actionable.filter((dose, index, self) =>
      index === self.findIndex(d =>
        d.protocolId === dose.protocolId &&
        d.scheduledDate === dose.scheduledDate &&
        d.doseNumber === dose.doseNumber
      )
    )

    setPendingDoses(unique)
    setLoading(false)
  }, [])

  const handleMarkTaken = (dose: ScheduledDose) => {
    markDoseAsTaken(
      dose.protocolId,
      dose.scheduledDate,
      dose.doseNumber,
      dose.peptideName,
      dose.dose
    )
    onDoseLogged()
  }

  const handleMarkSkipped = (dose: ScheduledDose) => {
    markDoseAsSkipped(
      dose.protocolId,
      dose.scheduledDate,
      dose.doseNumber,
      dose.peptideName,
      dose.dose
    )
    onDoseLogged()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (protocols.filter(p => p.status === 'active').length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-4">
          <Syringe className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-2">No Active Protocols</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create a protocol first to track your peptide doses.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          Close
        </button>
      </div>
    )
  }

  if (pendingDoses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-4">
          <Check className="h-6 w-6 text-green-500" />
        </div>
        <h3 className="font-medium mb-2">All Caught Up!</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You have no pending doses right now.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          Close
        </button>
      </div>
    )
  }

  // Group doses by status (overdue first, then pending)
  const overdueDoses = pendingDoses.filter(d => d.status === 'overdue')
  const todaysPendingDoses = pendingDoses.filter(d => d.status === 'pending')

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select a dose to mark as taken or skipped.
      </p>

      {/* Overdue Doses */}
      {overdueDoses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-medium text-red-500">Overdue</h3>
          </div>
          <div className="space-y-2">
            {overdueDoses.map((dose, idx) => (
              <DoseActionCard
                key={`${dose.protocolId}-${dose.scheduledDate}-${dose.doseNumber}-${idx}`}
                dose={dose}
                onMarkTaken={() => handleMarkTaken(dose)}
                onMarkSkipped={() => handleMarkSkipped(dose)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Today's Pending Doses */}
      {todaysPendingDoses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Due Today</h3>
          </div>
          <div className="space-y-2">
            {todaysPendingDoses.map((dose, idx) => (
              <DoseActionCard
                key={`${dose.protocolId}-${dose.scheduledDate}-${dose.doseNumber}-${idx}`}
                dose={dose}
                onMarkTaken={() => handleMarkTaken(dose)}
                onMarkSkipped={() => handleMarkSkipped(dose)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// Card component for each actionable dose
function DoseActionCard({
  dose,
  onMarkTaken,
  onMarkSkipped
}: {
  dose: ScheduledDose
  onMarkTaken: () => void
  onMarkSkipped: () => void
}) {
  return (
    <TooltipProvider>
      <div className={cn(
        "flex items-center justify-between p-4 rounded-lg border",
        dose.status === 'overdue'
          ? "border-red-500/30 bg-red-500/5"
          : "border-border bg-card"
      )}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-medium truncate">{dose.peptideName}</span>
            {dose.dosesPerDay > 1 && (
              <span className="text-xs text-muted-foreground">
                (Dose {dose.doseNumber}/{dose.dosesPerDay})
              </span>
            )}
            {dose.fdaApproved && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center">
                    <Shield className="h-3.5 w-3.5 text-green-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>FDA Approved</TooltipContent>
              </Tooltip>
            )}
            {dose.requiresFasting && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{dose.fastingNotes || 'Fasting required for optimal results'}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-mono tabular-nums">{dose.dose}</span>
            {dose.vialSize && (
              <span className="text-xs">({dose.vialSize}mg vial)</span>
            )}
            <TimingBadge timing={dose.timing} size="sm" variant="subtle" />
          </div>
          {dose.status === 'overdue' && (
            <p className="text-xs text-red-500 mt-1">
              From {new Date(dose.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onMarkSkipped}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            title="Skip"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={onMarkTaken}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
          >
            <Check className="h-4 w-4" />
            Take
          </button>
        </div>
      </div>
    </TooltipProvider>
  )
}

type FormProps = { user: ReturnType<typeof useAuth>["user"], authLoading: boolean, onClose: () => void }

function MealForm({ user, authLoading, onClose }: FormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
    if (authLoading) {
      setError("Checking session, please wait")
      return
    }
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
          disabled={loading || authLoading}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {(loading || authLoading) && <Loader2 className="h-4 w-4 animate-spin" />}
          Log Meal
        </button>
      </div>
    </div>
  )
}

function WeightForm({ user, authLoading, onClose }: FormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [weight, setWeight] = useState("")
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs")
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [notes, setNotes] = useState("")

  const handleSubmit = async () => {
    if (authLoading) {
      setError("Checking session, please wait")
      return
    }
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
          disabled={loading || authLoading}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {(loading || authLoading) && <Loader2 className="h-4 w-4 animate-spin" />}
          Log Weight
        </button>
      </div>
    </div>
  )
}

function WaterForm({ user, authLoading, onClose }: FormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [glasses, setGlasses] = useState(0)

  const handleSubmit = async () => {
    if (authLoading) {
      setError("Checking session, please wait")
      return
    }
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
          disabled={loading || authLoading}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {(loading || authLoading) && <Loader2 className="h-4 w-4 animate-spin" />}
          Log Water
        </button>
      </div>
    </div>
  )
}
