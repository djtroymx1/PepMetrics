"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Syringe, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  FlaskConical,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Protocols", href: "/protocols", icon: Syringe },
  { name: "Health", href: "/health", icon: Activity },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "AI Insights", href: "/insights", icon: Sparkles },
  { name: "Bloodwork", href: "/bloodwork", icon: FlaskConical },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300 hidden lg:block",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Syringe className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">PepMetrics</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary mx-auto">
              <Syringe className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const isAI = item.name === "AI Insights"

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  collapsed && "justify-center px-2",
                  isActive
                    ? isAI 
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isAI && !isActive && "text-accent")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="border-t border-border p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                T
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Troy</p>
                <p className="text-xs text-muted-foreground truncate">Pro Member</p>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground mx-auto">
              T
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
