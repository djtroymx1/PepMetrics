"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Syringe, Activity, TrendingUp, Settings as SettingsIcon, Calendar, Sparkles, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-4 gap-y-1 px-2 pt-2 pb-2">
        {mobileNav.map(renderLink)}
      </div>
    </nav>
  )
}
