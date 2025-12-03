"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative h-6 w-11 rounded-full bg-muted transition-colors hover:bg-muted/80"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-primary transition-transform flex items-center justify-center ${
          theme === "light" ? "left-6" : "left-1"
        }`}
      >
        {theme === "light" ? (
          <Sun className="h-3 w-3 text-primary-foreground" />
        ) : (
          <Moon className="h-3 w-3 text-primary-foreground" />
        )}
      </span>
    </button>
  )
}
