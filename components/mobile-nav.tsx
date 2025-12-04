"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Syringe, Activity, TrendingUp, Settings as SettingsIcon, Plus, Calendar, Sparkles, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuickLogModal } from "./quick-log-modal"

const mobileNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Protocols", href: "/protocols", icon: Syringe },
  { name: "Health", href: "/health", icon: Activity },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "AI Insights", href: "/insights", icon: Sparkles },
  { name: "Bloodwork", href: "/bloodwork", icon: FlaskConical },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
]

export function MobileNav() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const renderLink = (item: (typeof mobileNav)[number]) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium leading-4 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{item.name}</span>
      </Link>
    )
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="relative grid grid-cols-4 gap-y-1 px-2 pt-6 pb-2">
          {mobileNav.map(renderLink)}

          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute left-1/2 -top-6 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 ring-4 ring-primary/20 transition hover:translate-y-[-2px] hover:bg-primary/90"
            aria-label="Open quick log"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <QuickLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
