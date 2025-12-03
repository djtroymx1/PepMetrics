"use client"

import { useState } from "react"
import { Droplet, AlertTriangle, Plus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useVials } from "@/hooks/use-vials"
import { AddVialModal } from "@/components/add-vial-modal"

// Format date for display
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Calculate remaining percentage
function calculateRemaining(remaining: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((remaining / total) * 100)
}

export function VialInventory() {
  const { vials, loading, error } = useVials()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Vial Inventory</h2>
          <Droplet className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Vial Inventory</h2>
          <Droplet className="h-5 w-5 text-primary" />
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center">
          <p className="text-sm text-red-500">Error loading vials</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Vial Inventory</h2>
        <Droplet className="h-5 w-5 text-primary" />
      </div>

      {vials.length === 0 ? (
        <div className="text-center py-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3">
            <Droplet className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">No vials tracked</p>
          <p className="text-xs text-muted-foreground">Add a vial to start tracking inventory</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vials.map((vial) => {
            const remaining = calculateRemaining(Number(vial.remaining_mg), Number(vial.total_mg))
            const isExpired = vial.status === 'expired' || (vial.expiry_date && new Date(vial.expiry_date) < new Date())

            return (
              <div
                key={vial.id}
                className={cn(
                  "rounded-lg border p-3 transition-all",
                  vial.status === "good" && "border-border bg-muted/50",
                  vial.status === "low" && "border-amber-500/30 bg-amber-500/5",
                  (vial.status === "expired" || isExpired) && "border-red-500/30 bg-red-500/5 opacity-60",
                  vial.status === "empty" && "border-muted bg-muted/30 opacity-50",
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{vial.peptide_name}</h3>
                    <p className="text-xs text-muted-foreground font-mono tabular-nums">
                      {vial.concentration || `${vial.total_mg} mg vial`}
                    </p>
                  </div>
                  {vial.status === "low" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {(vial.status === "expired" || isExpired) && (
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">Expired</span>
                  )}
                  {vial.status === "empty" && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Empty</span>
                  )}
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Remaining</span>
                    <span className="text-xs font-medium tabular-nums font-mono">{remaining}%</span>
                  </div>
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        remaining > 30 && "bg-green-500",
                        remaining <= 30 && remaining > 0 && "bg-amber-500",
                        remaining === 0 && "bg-red-500",
                      )}
                      style={{ width: `${remaining}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">{vial.total_mg} mg</span>
                  <span className="font-mono">
                    {vial.expiry_date ? `Exp: ${formatDate(vial.expiry_date)}` : 'No expiry set'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-muted hover:border-primary/50 transition-all"
      >
        <Plus className="h-4 w-4" />
        Add New Vial
      </button>

      <AddVialModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
