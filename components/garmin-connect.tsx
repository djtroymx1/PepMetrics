"use client"

import { useState } from "react"
import { 
  Watch, 
  Moon, 
  Heart, 
  Activity, 
  Zap, 
  CheckCircle, 
  RefreshCw,
  ChevronRight,
  Upload,
  Link2
} from "lucide-react"

interface GarminConnectProps {
  isConnected?: boolean
  lastSync?: string
  onConnect?: () => void
  onDisconnect?: () => void
}

export function GarminConnect({ 
  isConnected = false, 
  lastSync,
  onConnect,
  onDisconnect 
}: GarminConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    // This would trigger the OAuth flow
    // For now, simulate a connection
    setTimeout(() => {
      setIsConnecting(false)
      onConnect?.()
    }, 1500)
  }

  const features = [
    { icon: Moon, label: "Sleep Stages & Score", description: "Deep, light, REM, awake tracking" },
    { icon: Heart, label: "HRV & Heart Rate", description: "Nightly averages and trends" },
    { icon: Zap, label: "Stress & Body Battery", description: "All-day stress monitoring" },
    { icon: Activity, label: "Activities & Steps", description: "Workouts, steps, calories" },
  ]

  if (isConnected) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-green-500">Garmin Connected</p>
              <p className="text-sm text-muted-foreground">
                Last synced: {lastSync || "Just now"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
              <RefreshCw className="h-4 w-4" />
              Sync Now
            </button>
            <button 
              onClick={onDisconnect}
              className="px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Watch className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">Connect Your Garmin</h3>
            <p className="text-muted-foreground">
              Sync sleep, HRV, stress, and activity data automatically to correlate with your peptide protocols.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-4">What you'll get:</p>
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Link2 className="h-5 w-5" />
              Connect Garmin Account
            </>
          )}
        </button>

        {/* Alternative: CSV Import */}
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Upload className="h-4 w-4" />
            Or import CSV from Garmin Connect
            <ChevronRight className="h-4 w-4 ml-auto" />
          </button>
        </div>
      </div>
    </div>
  )
}
