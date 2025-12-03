"use client"

import { useState } from "react"
import { NumberInput } from "@tremor/react"
import { Calculator, Syringe } from "lucide-react"

export function ReconCalculatorCard() {
  const [peptideAmount, setPeptideAmount] = useState<number>(5)
  const [bacteriostaticWater, setBacteriostaticWater] = useState<number>(2)
  const [desiredDose, setDesiredDose] = useState<number>(250)

  const calculateVolume = () => {
    if (!peptideAmount || !bacteriostaticWater || !desiredDose || peptideAmount === 0) {
      return "0.00"
    }

    const concentration = peptideAmount / bacteriostaticWater
    const volume = desiredDose / (concentration * 1000)
    return volume.toFixed(2)
  }

  const calculateUnits = () => {
    const volume = parseFloat(calculateVolume())
    return (volume * 100).toFixed(0) // IU on insulin syringe
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 border-t-4 border-t-violet-500">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
          <Calculator className="h-5 w-5 text-violet-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Reconstitution Calc</h2>
          <p className="text-xs text-muted-foreground">Calculate your injection volume</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Peptide Amount (mg)
          </label>
          <input
            type="number"
            value={peptideAmount}
            onChange={(e) => setPeptideAmount(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-mono tabular-nums focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Bacteriostatic Water (mL)
          </label>
          <input
            type="number"
            value={bacteriostaticWater}
            onChange={(e) => setBacteriostaticWater(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-mono tabular-nums focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Desired Dose (mcg)
          </label>
          <input
            type="number"
            value={desiredDose}
            onChange={(e) => setDesiredDose(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-mono tabular-nums focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            step="1"
          />
        </div>

        <div className="pt-4 border-t border-border">
          <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                <Syringe className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Injection Volume</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono tabular-nums text-violet-500">
                    {calculateVolume()}
                  </span>
                  <span className="text-sm text-muted-foreground">mL</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 font-mono">
              Draw to <span className="font-semibold text-foreground">{calculateUnits()} units</span> on insulin syringe
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
