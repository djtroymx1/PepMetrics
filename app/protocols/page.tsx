"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import {
  ProtocolListCard,
  VialInventoryCard,
  ReconCalculatorCard,
} from "@/components/protocols"
import { Plus, Syringe } from "lucide-react"

export default function ProtocolsPage() {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Syringe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-balance">Protocol Management</h1>
                <p className="text-muted-foreground mt-1">Manage your peptide protocols and vial inventory</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              New Protocol
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ProtocolListCard />
            </div>
            <div className="space-y-6">
              <VialInventoryCard />
              <ReconCalculatorCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
