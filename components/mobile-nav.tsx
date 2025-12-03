"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Syringe, Activity, TrendingUp, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuickLogModal } from "./quick-log-modal"

const mobileNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Protocols", href: "/protocols", icon: Syringe },
  { name: "Health", href: "/health", icon: Activity },
  { name: "Progress", href: "/progress", icon: TrendingUp },
]

export function MobileNav() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden">
        <div className="flex items-center justify-around">
          {mobileNav.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            // Add Quick Log button in the middle
            if (index === 2) {
              return (
                <div key="divider" className="flex items-center gap-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex h-14 w-14 -mt-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-6 w-6" />
                  </button>

                  <Link
                    href={mobileNav[3].href}
                    className={cn(
                      "flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors",
                      pathname === mobileNav[3].href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Progress</span>
                  </Link>
                </div>
              )
            }

            // Skip the last item since it's rendered with the Quick Log button
            if (index === 3) return null

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
          })}
        </div>
      </nav>

      <QuickLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
