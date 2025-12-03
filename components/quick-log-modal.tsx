"use client"

import { useState } from "react"
import { X, Syringe, Utensils, Weight, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"

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
      <div className="relative w-full max-w-2xl mx-4 mb-4 sm:mb-0 rounded-lg border border-border bg-surface shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-xl font-semibold">Quick Log</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-elevated transition-colors">
            <X className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        {/* Log Type Tabs */}
        <div className="flex border-b border-border">
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
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {logType === "injection" && <InjectionForm />}
          {logType === "meal" && <MealForm />}
          {logType === "weight" && <WeightForm />}
          {logType === "water" && <WaterForm />}
        </div>
      </div>
    </div>
  )
}

function InjectionForm() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Peptide</label>
          <select className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
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
              className="flex-1 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
              step="0.01"
            />
            <select className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
              <option>mcg</option>
              <option>mg</option>
              <option>IU</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Injection Site</label>
        <BodyMap />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Time</label>
        <input
          type="time"
          defaultValue={new Date().toTimeString().slice(0, 5)}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono tabular-nums focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
        <textarea
          placeholder="Any reactions, side effects, or observations..."
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary"
          rows={3}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
          Cancel
        </button>
        <button className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          Log Injection
        </button>
      </div>
    </div>
  )
}

function BodyMap() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null)

  const sites = [
    { id: "left-abdomen", label: "Left Abdomen", x: 35, y: 45 },
    { id: "right-abdomen", label: "Right Abdomen", x: 65, y: 45 },
    { id: "left-thigh", label: "Left Thigh", x: 35, y: 75 },
    { id: "right-thigh", label: "Right Thigh", x: 65, y: 75 },
    { id: "left-arm", label: "Left Arm", x: 20, y: 35 },
    { id: "right-arm", label: "Right Arm", x: 80, y: 35 },
  ]

  return (
    <div>
      <div className="relative w-full aspect-[2/3] max-w-xs mx-auto rounded-lg border border-border bg-elevated p-4">
        {/* Simple body outline */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Head */}
          <circle cx="50" cy="12" r="8" fill="none" stroke="#27272a" strokeWidth="1.5" />
          {/* Body */}
          <rect x="42" y="20" width="16" height="35" rx="2" fill="none" stroke="#27272a" strokeWidth="1.5" />
          {/* Arms */}
          <line x1="42" y1="25" x2="25" y2="40" stroke="#27272a" strokeWidth="1.5" />
          <line x1="58" y1="25" x2="75" y2="40" stroke="#27272a" strokeWidth="1.5" />
          {/* Legs */}
          <line x1="45" y1="55" x2="40" y2="85" stroke="#27272a" strokeWidth="1.5" />
          <line x1="55" y1="55" x2="60" y2="85" stroke="#27272a" strokeWidth="1.5" />

          {/* Injection site markers */}
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
                  : "fill-elevated stroke-border hover:fill-primary/20",
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
  )
}

function MealForm() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Meal Type</label>
        <select className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm">
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-2">Calories</label>
          <input
            type="number"
            placeholder="450"
            className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Protein (g)</label>
          <input
            type="number"
            placeholder="35"
            className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Carbs (g)</label>
          <input
            type="number"
            placeholder="45"
            className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          placeholder="Grilled chicken, brown rice, steamed broccoli..."
          className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm resize-none"
          rows={3}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-elevated transition-colors">
          Cancel
        </button>
        <button className="px-4 py-2 rounded-md bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
          Log Meal
        </button>
      </div>
    </div>
  )
}

function WeightForm() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="185.2"
              className="flex-1 rounded-md border border-border bg-elevated px-3 py-2 text-sm font-mono tabular-nums"
              step="0.1"
            />
            <select className="rounded-md border border-border bg-elevated px-3 py-2 text-sm">
              <option>lbs</option>
              <option>kg</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Time</label>
          <input
            type="time"
            defaultValue={new Date().toTimeString().slice(0, 5)}
            className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm font-mono tabular-nums"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
        <textarea
          placeholder="Weighed after fasting, before breakfast..."
          className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm resize-none"
          rows={2}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-elevated transition-colors">
          Cancel
        </button>
        <button className="px-4 py-2 rounded-md bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
          Log Weight
        </button>
      </div>
    </div>
  )
}

function WaterForm() {
  const [glasses, setGlasses] = useState(0)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-text-secondary mb-4">Tap to add glasses of water (8 oz each)</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => setGlasses(Math.max(0, glasses - 1))}
            className="h-10 w-10 rounded-full border border-border hover:bg-elevated transition-colors"
          >
            -
          </button>
          <div className="text-4xl font-semibold tabular-nums w-20 text-center">{glasses}</div>
          <button
            onClick={() => setGlasses(glasses + 1)}
            className="h-10 w-10 rounded-full border border-border hover:bg-elevated transition-colors"
          >
            +
          </button>
        </div>
        <p className="text-sm text-text-muted">
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
              glasses >= num ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-elevated",
            )}
          >
            <Droplets className="h-6 w-6 mx-auto" />
          </button>
        ))}
      </div>

      <div className="flex gap-3 justify-end">
        <button className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-elevated transition-colors">
          Cancel
        </button>
        <button className="px-4 py-2 rounded-md bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors">
          Log Water
        </button>
      </div>
    </div>
  )
}
