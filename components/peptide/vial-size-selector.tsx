"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { formatVialSize, getPeptideById, getStackById, type Peptide, type PeptideStack } from "@/lib/data/peptides"

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
  // Get available vial sizes based on selected peptide or stack
  const { vialSizes, item } = useMemo(() => {
    if (!peptideId || peptideId === 'custom') {
      return { vialSizes: [], item: null }
    }

    // Check if it's a peptide
    const peptide = getPeptideById(peptideId)
    if (peptide) {
      return { vialSizes: peptide.vialSizes, item: peptide }
    }

    // Check if it's a stack
    const stack = getStackById(peptideId)
    if (stack) {
      return { vialSizes: stack.vialSizes, item: stack }
    }

    return { vialSizes: [], item: null }
  }, [peptideId])

  // Sort vial sizes for display
  const sortedSizes = useMemo(() => {
    return [...vialSizes].sort((a, b) => a - b)
  }, [vialSizes])

  // No peptide selected or custom peptide
  if (!peptideId || peptideId === 'custom' || sortedSizes.length === 0) {
    return (
      <div className={cn("space-y-2", className)}>
        <label className="block text-sm font-medium text-muted-foreground">
          Vial Size
        </label>
        <input
          type="text"
          placeholder="e.g., 5mg, 10mg"
          disabled={disabled || !peptideId}
          className={cn(
            "w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm",
            "focus:border-primary focus:ring-1 focus:ring-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          value={value ? `${value}mg` : ''}
          onChange={(e) => {
            const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''))
            onChange(isNaN(num) ? null : num)
          }}
        />
        {!peptideId && (
          <p className="text-xs text-muted-foreground">
            Select a peptide first
          </p>
        )}
      </div>
    )
  }

  // Dropdown mode when peptide has predefined vial sizes
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium">
        Vial Size
      </label>

      {/* Button group for few options */}
      {sortedSizes.length <= 6 ? (
        <div className="flex flex-wrap gap-2">
          {sortedSizes.map((size) => (
            <button
              key={size}
              type="button"
              disabled={disabled}
              onClick={() => onChange(size)}
              className={cn(
                "px-3 py-2 text-sm rounded-lg border transition-colors font-mono",
                value === size
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {formatVialSize(size)}
            </button>
          ))}
        </div>
      ) : (
        // Dropdown for many options
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm",
            "focus:border-primary focus:ring-1 focus:ring-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <option value="">Select vial size...</option>
          {sortedSizes.map((size) => (
            <option key={size} value={size}>
              {formatVialSize(size)}
            </option>
          ))}
        </select>
      )}

      {/* Info about selected item */}
      {item && 'totalStrength' in item && item.totalStrength && (
        <p className="text-xs text-muted-foreground">
          Stack total strength: {item.totalStrength}mg
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
  const { vialSizes } = useMemo(() => {
    if (!peptideId || peptideId === 'custom') {
      return { vialSizes: [] }
    }

    const peptide = getPeptideById(peptideId)
    if (peptide) {
      return { vialSizes: peptide.vialSizes }
    }

    const stack = getStackById(peptideId)
    if (stack) {
      return { vialSizes: stack.vialSizes }
    }

    return { vialSizes: [] }
  }, [peptideId])

  const sortedSizes = useMemo(() => {
    return [...vialSizes].sort((a, b) => a - b)
  }, [vialSizes])

  if (!peptideId || peptideId === 'custom' || sortedSizes.length === 0) {
    return (
      <input
        type="text"
        placeholder="Vial size"
        disabled={disabled || !peptideId}
        className={cn(
          "w-24 rounded-lg border border-border bg-muted px-3 py-2 text-sm font-mono",
          "focus:border-primary focus:ring-1 focus:ring-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        value={value ? `${value}` : ''}
        onChange={(e) => {
          const num = parseFloat(e.target.value.replace(/[^0-9.]/g, ''))
          onChange(isNaN(num) ? null : num)
        }}
      />
    )
  }

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
      disabled={disabled}
      className={cn(
        "w-28 rounded-lg border border-border bg-muted px-2 py-2 text-sm font-mono",
        "focus:border-primary focus:ring-1 focus:ring-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <option value="">Size...</option>
      {sortedSizes.map((size) => (
        <option key={size} value={size}>
          {formatVialSize(size)}
        </option>
      ))}
    </select>
  )
}
