"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { QuickLogModal } from "./quick-log-modal"

export function QuickLogFab() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex fixed bottom-6 right-6 z-40 h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 ring-4 ring-primary/20 transition hover:translate-y-[-2px] hover:bg-primary/90"
        aria-label="Open quick log"
      >
        <Plus className="h-6 w-6" />
      </button>

      <QuickLogModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
