"use client"

import { useState } from "react"
import { Calculator } from "lucide-react"

export function ReconstitutionCalculator() {
  const [peptideAmount, setPeptideAmount] = useState<string>("5")
  const [bacteriostaticWater, setBacteriostaticWater] = useState<string>("2")
  const [desiredDose, setDesiredDose] = useState<string>("250")

  const calculateVolume = () => {
    const amount = Number.parseFloat(peptideAmount)
    const water = Number.parseFloat(bacteriostaticWater)
    const dose = Number.parseFloat(desiredDose)

    if (isNaN(amount) || isNaN(water) || isNaN(dose) || amount === 0) {
      return "0.00"
    }

    const concentration = amount / water
    const volume = dose / (concentration * 1000)
    return volume.toFixed(2)
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5 border-t-2 border-t-secondary shadow-[0_0_20px_-10px_rgba(139,92,246,0.3)]">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-secondary" />
        <h2 className="text-lg font-semibold">Reconstitution Calc</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
            Peptide Amount (mg)
          </label>
          <input
            type="number"
            value={peptideAmount}
            onChange={(e) => setPeptideAmount(e.target.value)}
            className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm font-mono tabular-nums focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
            Bacteriostatic Water (mL)
          </label>
          <input
            type="number"
            value={bacteriostaticWater}
            onChange={(e) => setBacteriostaticWater(e.target.value)}
            className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm font-mono tabular-nums focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
            Desired Dose (mcg)
          </label>
          <input
            type="number"
            value={desiredDose}
            onChange={(e) => setDesiredDose(e.target.value)}
            className="w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm font-mono tabular-nums focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            step="1"
          />
        </div>

        <div className="pt-4 border-t border-border bg-gradient-to-br from-secondary/5 to-transparent rounded-lg p-4 -mx-1">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-text-muted uppercase tracking-wider">Injection Volume</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold font-mono tabular-nums text-secondary">{calculateVolume()}</span>
              <span className="text-sm text-text-muted">mL</span>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-2 font-mono">
            Draw {calculateVolume()} mL for each {desiredDose} mcg dose
          </p>
        </div>
      </div>
    </div>
  )
}
