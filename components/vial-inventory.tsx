"use client"

import { Droplet, AlertTriangle, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Vial {
  id: string
  peptide: string
  concentration: string
  vialSize: string
  remaining: number
  reconDate: string
  expiryDate: string
  status: "good" | "low" | "expired"
}

const mockVials: Vial[] = [
  {
    id: "1",
    peptide: "Retatrutide",
    concentration: "200 mcg/unit",
    vialSize: "10 mg",
    remaining: 70,
    reconDate: "Nov 20, 2024",
    expiryDate: "Dec 20, 2024",
    status: "good",
  },
  {
    id: "2",
    peptide: "BPC-157",
    concentration: "250 mcg/unit",
    vialSize: "5 mg",
    remaining: 25,
    reconDate: "Nov 15, 2024",
    expiryDate: "Dec 15, 2024",
    status: "low",
  },
  {
    id: "3",
    peptide: "MOTS-c",
    concentration: "500 mcg/unit",
    vialSize: "10 mg",
    remaining: 55,
    reconDate: "Nov 25, 2024",
    expiryDate: "Dec 25, 2024",
    status: "good",
  },
  {
    id: "4",
    peptide: "TB-500",
    concentration: "500 mcg/unit",
    vialSize: "5 mg",
    remaining: 10,
    reconDate: "Nov 10, 2024",
    expiryDate: "Dec 10, 2024",
    status: "low",
  },
]

export function VialInventory() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Vial Inventory</h2>
        <Droplet className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-3">
        {mockVials.map((vial) => (
          <div
            key={vial.id}
            className={cn(
              "rounded-lg border p-3 transition-all",
              vial.status === "good" && "border-border bg-muted/50",
              vial.status === "low" && "border-amber-500/30 bg-amber-500/5",
              vial.status === "expired" && "border-red-500/30 bg-red-500/5 opacity-60",
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{vial.peptide}</h3>
                <p className="text-xs text-muted-foreground font-mono tabular-nums">{vial.concentration}</p>
              </div>
              {vial.status === "low" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
              {vial.status === "expired" && (
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">Expired</span>
              )}
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Remaining</span>
                <span className="text-xs font-medium tabular-nums font-mono">{vial.remaining}%</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-background">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    vial.remaining > 30 && "bg-green-500",
                    vial.remaining <= 30 && vial.remaining > 0 && "bg-amber-500",
                    vial.remaining === 0 && "bg-red-500",
                  )}
                  style={{ width: `${vial.remaining}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono">{vial.vialSize}</span>
              <span className="font-mono">Exp: {vial.expiryDate}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-muted hover:border-primary/50 transition-all">
        <Plus className="h-4 w-4" />
        Add New Vial
      </button>
    </div>
  )
}
