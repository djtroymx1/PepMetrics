"use client"

import { ProgressBar } from "@tremor/react"
import { Droplet, AlertTriangle, Plus, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Vial {
  id: string
  peptide: string
  concentration: string
  vialSize: string
  remaining: number
  reconDate: string
  expiryDate: string
  daysUntilExpiry: number
  status: "good" | "low" | "expired"
}

const mockVials: Vial[] = [
  {
    id: "1",
    peptide: "Retatrutide",
    concentration: "200 mcg/unit",
    vialSize: "10 mg",
    remaining: 70,
    reconDate: "Nov 20",
    expiryDate: "Dec 20",
    daysUntilExpiry: 17,
    status: "good",
  },
  {
    id: "2",
    peptide: "BPC-157",
    concentration: "250 mcg/unit",
    vialSize: "5 mg",
    remaining: 25,
    reconDate: "Nov 15",
    expiryDate: "Dec 15",
    daysUntilExpiry: 12,
    status: "low",
  },
  {
    id: "3",
    peptide: "MOTS-c",
    concentration: "500 mcg/unit",
    vialSize: "10 mg",
    remaining: 55,
    reconDate: "Nov 25",
    expiryDate: "Dec 25",
    daysUntilExpiry: 22,
    status: "good",
  },
  {
    id: "4",
    peptide: "TB-500",
    concentration: "500 mcg/unit",
    vialSize: "5 mg",
    remaining: 10,
    reconDate: "Nov 10",
    expiryDate: "Dec 10",
    daysUntilExpiry: 7,
    status: "low",
  },
]

export function VialInventoryCard() {
  const lowCount = mockVials.filter(v => v.status === "low").length

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
            <Droplet className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Vial Inventory</h2>
            <p className="text-xs text-muted-foreground">{mockVials.length} vials tracked</p>
          </div>
        </div>
        {lowCount > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
            <AlertTriangle className="h-3 w-3" />
            {lowCount} low
          </span>
        )}
      </div>

      <div className="space-y-3">
        {mockVials.map((vial) => (
          <div
            key={vial.id}
            className={cn(
              "rounded-xl border p-3 transition-all hover:shadow-sm",
              vial.status === "good" && "border-border bg-muted/30",
              vial.status === "low" && "border-amber-500/30 bg-amber-500/5",
              vial.status === "expired" && "border-red-500/30 bg-red-500/5 opacity-60",
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{vial.peptide}</h3>
                  {vial.status === "low" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                </div>
                <p className="text-xs text-muted-foreground font-mono tabular-nums">{vial.concentration}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono tabular-nums font-semibold">{vial.remaining}%</p>
                <p className="text-xs text-muted-foreground font-mono">{vial.vialSize}</p>
              </div>
            </div>

            <ProgressBar
              value={vial.remaining}
              color={
                vial.remaining > 50 ? "emerald" :
                vial.remaining > 30 ? "amber" :
                "rose"
              }
              className="mt-2"
              showAnimation={true}
            />

            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {vial.daysUntilExpiry}d until exp
              </span>
              <span className="font-mono">Exp: {vial.expiryDate}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium hover:bg-muted hover:border-primary/50 transition-all">
        <Plus className="h-4 w-4" />
        Add New Vial
      </button>
    </div>
  )
}
