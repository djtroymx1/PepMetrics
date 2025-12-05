"use client"

import { useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { getStackById, getStackComponents } from "@/lib/data/peptides"
import type { StackComponentConcentration } from "@/lib/types"

export interface StackConcentrationInputProps {
  stackId: string
  value: StackComponentConcentration[]
  onChange: (value: StackComponentConcentration[]) => void
  className?: string
  disabled?: boolean
}

export function StackConcentrationInput({
  stackId,
  value,
  onChange,
  className,
  disabled = false,
}: StackConcentrationInputProps) {
  const stack = useMemo(() => getStackById(stackId), [stackId])
  const components = useMemo(() => stack ? getStackComponents(stack) : [], [stack])

  // Initialize concentrations from stack components if empty
  useEffect(() => {
    if (stack && components.length > 0 && value.length === 0) {
      const initial: StackComponentConcentration[] = components.map((peptide, i) => ({
        peptideId: stack.components[i].peptideId,
        peptideName: peptide?.name || 'Unknown',
        amount: 0,
      }))
      onChange(initial)
    }
  }, [stack, components, value.length, onChange])

  const handleAmountChange = (index: number, amount: string) => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ''))
    const newValue = [...value]
    if (newValue[index]) {
      newValue[index] = {
        ...newValue[index],
        amount: isNaN(num) || num < 0 ? 0 : num,
      }
      onChange(newValue)
    }
  }

  if (!stack || components.length === 0) {
    return null
  }

  // Calculate total for display
  const total = value.reduce((sum, c) => sum + (c.amount || 0), 0)

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium">
        Vial Concentrations (mg per component)
      </label>

      <div className="space-y-2">
        {components.map((peptide, index) => {
          const concentration = value[index]
          return (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-28 truncate" title={peptide?.name}>
                {peptide?.name || 'Unknown'}
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  disabled={disabled}
                  className={cn(
                    "w-20 rounded-lg border border-border bg-muted px-3 py-2 text-sm font-mono text-right",
                    "focus:border-primary focus:ring-1 focus:ring-primary",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  value={concentration?.amount || ''}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                />
                <span className="text-sm text-muted-foreground">mg</span>
              </div>
            </div>
          )
        })}
      </div>

      {total > 0 && (
        <p className="text-xs text-muted-foreground">
          Total vial strength: <span className="font-mono">{total}mg</span>
        </p>
      )}
    </div>
  )
}
