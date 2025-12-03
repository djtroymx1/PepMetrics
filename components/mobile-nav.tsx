"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Syringe, Activity, TrendingUp, Settings as SettingsIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuickLogModal } from "./quick-log-modal"

const mobileNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Protocols", href: "/protocols", icon: Syringe },
  { name: "Health", href: "/health", icon: Activity },
  { name: "Progress", href: "/progress", icon: TrendingUp },
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
          "flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{item.name}</span>
      </Link>
    )
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden">
        <div className="flex items-center justify-around">
          {mobileNav.slice(0, 2).map(renderLink)}

          <div className="flex items-center gap-0">
            {renderLink(mobileNav[2])}

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex h-14 w-14 -mt-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              aria-label="Open quick log"
            >
              <Plus className="h-6 w-6" />
            </button>

            {renderLink(mobileNav[3])}
          </div>

          {mobileNav.slice(4).map(renderLink)}
        </div>
      </nav>

      <QuickLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
