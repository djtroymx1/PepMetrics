"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { ProtocolList } from "@/components/protocol-list"
import { AddProtocolModal } from "@/components/add-protocol-modal"
import { Plus } from "lucide-react"

export default function ProtocolsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-balance">Protocol Management</h1>
              <p className="text-muted-foreground mt-1">Manage your peptide protocols and track doses</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Protocol
            </button>
          </div>

          {/* Protocol List */}
          <ProtocolList />

          {/* Add Protocol Modal */}
          <AddProtocolModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        </div>
      </main>
    </div>
  )
}
