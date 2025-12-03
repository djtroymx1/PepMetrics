import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { ProtocolList } from "@/components/protocol-list"
import { VialInventory } from "@/components/vial-inventory"
import { ReconstitutionCalculator } from "@/components/reconstitution-calculator"
import { Plus } from "lucide-react"

export default function ProtocolsPage() {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-balance">Protocol Management</h1>
              <p className="text-muted-foreground mt-1">Manage your peptide protocols and vial inventory</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              New Protocol
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ProtocolList />
            </div>
            <div className="space-y-6">
              <VialInventory />
              <ReconstitutionCalculator />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
