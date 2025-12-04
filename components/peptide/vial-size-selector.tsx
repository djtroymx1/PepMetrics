"use client"

import { useMemo, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getPeptideById, getStackById } from "@/lib/data/peptides"

export interface VialSizeSelectorProps {
  peptideId: string | null
  value: number | null
  onChange: (value: number | null) => void
  className?: string
  disabled?: boolean
}

export function VialSizeSelector({
  peptideId,
  value,
  onChange,
  className,
  disabled = false,
}: VialSizeSelectorProps) {
  const [inputValue, setInputValue] = useState(value ? String(value) : '')

  // Sync input with external value changes
  useEffect(() => {
    setInputValue(value ? String(value) : '')
  }, [value])

  // Get common vial sizes as suggestions
  const commonSizes = useMemo(() => {
    if (!peptideId || peptideId === 'custom') {
      return []
    }

    const peptide = getPeptideById(peptideId)
    if (peptide) {
      return [...peptide.vialSizes].sort((a, b) => a - b)
    }

    const stack = getStackById(peptideId)
    if (stack && stack.vialSizes.length > 0) {
      return [...stack.vialSizes].sort((a, b) => a - b)
    }

    return []
  }, [peptideId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)

    // Parse the number, stripping any non-numeric chars except decimal
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''))
    onChange(isNaN(num) || num <= 0 ? null : num)
  }

  const handleQuickSelect = (size: number) => {
    setInputValue(String(size))
    onChange(size)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium">
        Vial Size (mg)
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          inputMode="decimal"
          placeholder="Enter vial size"
          disabled={disabled || !peptideId}
          className={cn(
            "flex-1 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-mono",
            "focus:border-primary focus:ring-1 focus:ring-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          value={inputValue}
          onChange={handleInputChange}
        />
        <span className="flex items-center text-sm text-muted-foreground">mg</span>
      </div>

      {/* Quick select buttons for common sizes */}
      {peptideId && commonSizes.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Common sizes (click to use):</p>
          <div className="flex flex-wrap gap-1.5">
            {commonSizes.map((size) => (
              <button
                key={size}
                type="button"
                disabled={disabled}
                onClick={() => handleQuickSelect(size)}
                className={cn(
                  "px-2 py-1 text-xs rounded-md border transition-colors font-mono",
                  value === size
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-muted text-muted-foreground",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {size}mg
              </button>
            ))}
          </div>
        </div>
      )}

      {!peptideId && (
        <p className="text-xs text-muted-foreground">
          Select a peptide first
        </p>
      )}
    </div>
  )
}

// Compact inline version for forms
export function VialSizeSelectorInline({
  peptideId,
  value,
  onChange,
  className,
  disabled = false,
}: VialSizeSelectorProps) {
  const [inputValue, setInputValue] = useState(value ? String(value) : '')

  useEffect(() => {
    setInputValue(value ? String(value) : '')
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''))
    onChange(isNaN(num) || num <= 0 ? null : num)
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <input
        type="text"
        inputMode="decimal"
        placeholder="Size"
        disabled={disabled || !peptideId}
        className={cn(
          "w-20 rounded-lg border border-border bg-muted px-2 py-2 text-sm font-mono",
          "focus:border-primary focus:ring-1 focus:ring-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        value={inputValue}
        onChange={handleInputChange}
      />
      <span className="text-xs text-muted-foreground">mg</span>
    </div>
  )
}
