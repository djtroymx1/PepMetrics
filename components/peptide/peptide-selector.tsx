"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Search, ChevronDown, Check, AlertTriangle, Shield, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PEPTIDES,
  PEPTIDE_STACKS,
  PEPTIDE_CATEGORIES,
  STACK_CATEGORIES,
  CATEGORY_DISPLAY_NAMES,
  STACK_CATEGORY_DISPLAY_NAMES,
  getPeptideById,
  getStackById,
  getPeptideDisplayName,
  getStackComponents,
  formatDoseRange,
  type Peptide,
  type PeptideStack,
  type PeptideCategory,
  type StackCategory,
} from "@/lib/data/peptides"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type PeptideOrStack =
  | { type: 'peptide'; data: Peptide }
  | { type: 'stack'; data: PeptideStack }
  | { type: 'custom' }

export interface PeptideSelectorProps {
  value: string | null
  onChange: (value: string | null, item: PeptideOrStack | null) => void
  placeholder?: string
  className?: string
  showStacks?: boolean
  disabled?: boolean
}

export function PeptideSelector({
  value,
  onChange,
  placeholder = "Search peptides...",
  className,
  showStacks = true,
  disabled = false,
}: PeptideSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get selected item for display
  const selectedItem = useMemo((): PeptideOrStack | null => {
    if (!value) return null
    if (value === 'custom') return { type: 'custom' }

    const peptide = getPeptideById(value)
    if (peptide) return { type: 'peptide', data: peptide }

    const stack = getStackById(value)
    if (stack) return { type: 'stack', data: stack }

    return null
  }, [value])

  // Filter peptides based on search
  const filteredPeptides = useMemo(() => {
    if (!searchQuery) return PEPTIDES
    const query = searchQuery.toLowerCase()
    return PEPTIDES.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brandNames.some(bn => bn.toLowerCase().includes(query)) ||
      p.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Filter stacks based on search
  const filteredStacks = useMemo(() => {
    if (!showStacks) return []
    if (!searchQuery) return PEPTIDE_STACKS
    const query = searchQuery.toLowerCase()
    return PEPTIDE_STACKS.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query)
    )
  }, [searchQuery, showStacks])

  // Group peptides by category
  const groupedPeptides = useMemo(() => {
    const groups: Partial<Record<PeptideCategory, Peptide[]>> = {}
    for (const peptide of filteredPeptides) {
      if (!groups[peptide.category]) {
        groups[peptide.category] = []
      }
      groups[peptide.category]!.push(peptide)
    }
    return groups
  }, [filteredPeptides])

  // Group stacks by category
  const groupedStacks = useMemo(() => {
    const groups: Partial<Record<StackCategory, PeptideStack[]>> = {}
    for (const stack of filteredStacks) {
      if (!groups[stack.category]) {
        groups[stack.category] = []
      }
      groups[stack.category]!.push(stack)
    }
    return groups
  }, [filteredStacks])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (id: string, item: PeptideOrStack) => {
    onChange(id, item)
    setIsOpen(false)
    if (item.type === 'peptide') {
      setSearchQuery(item.data.name)
    } else if (item.type === 'stack') {
      setSearchQuery(item.data.name)
    } else {
      setSearchQuery("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsOpen(true)
    if (!e.target.value) {
      onChange(null, null)
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  // Get display text for the input
  const getDisplayText = () => {
    if (isOpen) return searchQuery
    if (!selectedItem) return ""
    if (selectedItem.type === 'custom') return "Custom Peptide"
    if (selectedItem.type === 'peptide') return selectedItem.data.name
    if (selectedItem.type === 'stack') return selectedItem.data.name
    return ""
  }

  return (
    <TooltipProvider>
      <div ref={containerRef} className={cn("relative", className)}>
        {/* Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={getDisplayText()}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
            className={cn(
              "w-full rounded-lg border border-border bg-muted pl-9 pr-9 py-2.5 text-sm",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
          <ChevronDown
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>

        {/* Selected item badges */}
        {selectedItem && !isOpen && selectedItem.type !== 'custom' && (
          <div className="flex items-center gap-2 mt-2">
            {selectedItem.type === 'peptide' && (
              <>
                {selectedItem.data.fdaApproved && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                    <Shield className="h-3 w-3" />
                    FDA Approved
                  </span>
                )}
                {selectedItem.data.fastingRequired && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium cursor-help">
                        <AlertTriangle className="h-3 w-3" />
                        Fasting Required
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{selectedItem.data.fastingNotes || 'Fasting required for optimal results'}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            )}
            {selectedItem.type === 'stack' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-xs font-medium cursor-help">
                    <Layers className="h-3 w-3" />
                    Stack ({selectedItem.data.components.length} peptides)
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">Components:</p>
                    {getStackComponents(selectedItem.data).map((p, i) => (
                      <p key={i} className="text-sm">
                        {p ? p.name : 'Unknown'}
                        {selectedItem.data.components[i].amount && ` (${selectedItem.data.components[i].amount}mg)`}
                      </p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
            {/* Custom option */}
            <button
              className={cn(
                "w-full text-left px-3 py-2.5 text-sm hover:bg-muted border-b border-border",
                value === 'custom' && "bg-primary/10"
              )}
              onClick={() => handleSelect('custom', { type: 'custom' })}
            >
              <span className="font-medium">+ Add Custom Peptide</span>
            </button>

            {/* Individual Peptides Section */}
            {Object.keys(groupedPeptides).length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/30 uppercase tracking-wider">
                  Individual Peptides
                </div>
                {PEPTIDE_CATEGORIES.map(category => {
                  const peptides = groupedPeptides[category]
                  if (!peptides || peptides.length === 0) return null

                  return (
                    <div key={category}>
                      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                        {CATEGORY_DISPLAY_NAMES[category]}
                      </div>
                      {peptides.map(peptide => (
                        <PeptideOption
                          key={peptide.id}
                          peptide={peptide}
                          isSelected={value === peptide.id}
                          onSelect={() => handleSelect(peptide.id, { type: 'peptide', data: peptide })}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Stacks Section */}
            {showStacks && Object.keys(groupedStacks).length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/30 uppercase tracking-wider border-t border-border">
                  Pre-Made Stacks
                </div>
                {STACK_CATEGORIES.map(category => {
                  const stacks = groupedStacks[category]
                  if (!stacks || stacks.length === 0) return null

                  return (
                    <div key={category}>
                      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                        {STACK_CATEGORY_DISPLAY_NAMES[category]}
                      </div>
                      {stacks.map(stack => (
                        <StackOption
                          key={stack.id}
                          stack={stack}
                          isSelected={value === stack.id}
                          onSelect={() => handleSelect(stack.id, { type: 'stack', data: stack })}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            )}

            {/* No results */}
            {filteredPeptides.length === 0 && filteredStacks.length === 0 && searchQuery && (
              <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                No peptides found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

// Individual peptide option in dropdown
function PeptideOption({
  peptide,
  isSelected,
  onSelect,
}: {
  peptide: Peptide
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      className={cn(
        "w-full text-left px-3 py-2.5 text-sm hover:bg-muted flex items-start gap-3",
        isSelected && "bg-primary/10"
      )}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{peptide.name}</span>
          {peptide.brandNames.length > 0 && (
            <span className="text-muted-foreground text-xs truncate">
              ({peptide.brandNames.join(', ')})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{peptide.frequency}</span>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground">{formatDoseRange(peptide.doseRange)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {peptide.fdaApproved && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Shield className="h-4 w-4 text-green-500" />
            </TooltipTrigger>
            <TooltipContent>FDA Approved</TooltipContent>
          </Tooltip>
        )}
        {peptide.fastingRequired && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{peptide.fastingNotes || 'Fasting required'}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isSelected && <Check className="h-4 w-4 text-primary" />}
      </div>
    </button>
  )
}

// Stack option in dropdown
function StackOption({
  stack,
  isSelected,
  onSelect,
}: {
  stack: PeptideStack
  isSelected: boolean
  onSelect: () => void
}) {
  const components = getStackComponents(stack)

  return (
    <button
      className={cn(
        "w-full text-left px-3 py-2.5 text-sm hover:bg-muted flex items-start gap-3",
        isSelected && "bg-primary/10"
      )}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-purple-500 flex-shrink-0" />
          <span className="font-medium truncate">{stack.name}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          {components.slice(0, 3).map((p, i) => (
            <span key={i} className="text-xs text-muted-foreground">
              {p?.name || 'Unknown'}{i < Math.min(components.length, 3) - 1 && ' +'}
            </span>
          ))}
          {components.length > 3 && (
            <span className="text-xs text-muted-foreground">+{components.length - 3} more</span>
          )}
        </div>
        {stack.totalStrength && (
          <span className="text-xs text-muted-foreground mt-0.5 block">
            Total: {stack.totalStrength}mg
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {stack.fastingRequired && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent>Fasting required</TooltipContent>
          </Tooltip>
        )}
        {isSelected && <Check className="h-4 w-4 text-primary" />}
      </div>
    </button>
  )
}
