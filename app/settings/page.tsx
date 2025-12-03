import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Settings,
  User,
  Bell,
  Shield,
  Download,
  Trash2,
  Watch,
  Smartphone,
  FileText,
  ChevronRight,
  CheckCircle,
  ExternalLink,
  Palette
} from "lucide-react"

const integrations = [
  {
    id: "garmin",
    name: "Garmin Connect",
    description: "Sync sleep, HRV, stress, and activity data",
    icon: Watch,
    connected: false,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "apple-health",
    name: "Apple Health",
    description: "Import health data from your iPhone",
    icon: Smartphone,
    connected: false,
    comingSoon: true,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
]

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-semibold">Settings</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your account, integrations, and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Profile</h2>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                    T
                  </div>
                  <div>
                    <p className="text-lg font-medium">Troy</p>
                    <p className="text-sm text-muted-foreground">Pro Member</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="display-name" className="block text-sm font-medium mb-2">Display Name</label>
                    <input
                      id="display-name"
                      type="text"
                      defaultValue="Troy"
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <input
                      id="email"
                      type="email"
                      defaultValue="troy@example.com"
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Units</label>
                    <select className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                      <option>Imperial (lbs, oz)</option>
                      <option>Metric (kg, ml)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Appearance</h2>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Integrations Section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Watch className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Integrations</h2>
                </div>
              </div>
              <div className="divide-y divide-border">
                {integrations.map((integration) => {
                  const Icon = integration.icon
                  return (
                    <div key={integration.id} className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${integration.bgColor}`}>
                          <Icon className={`h-6 w-6 ${integration.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{integration.name}</p>
                            {integration.comingSoon && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      {integration.connected ? (
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-sm text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            Connected
                          </span>
                          <button className="text-sm text-muted-foreground hover:text-foreground">
                            Manage
                          </button>
                        </div>
                      ) : integration.comingSoon ? (
                        <button 
                          disabled
                          className="px-4 py-2 rounded-lg text-sm text-muted-foreground bg-muted cursor-not-allowed"
                        >
                          Coming Soon
                        </button>
                      ) : (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                          Connect
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Notifications Section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Notifications</h2>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Injection Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminded before scheduled injections</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-primary transition-colors">
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Fasting Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify when fasting window is complete</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-primary transition-colors">
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Inventory Warnings</p>
                    <p className="text-sm text-muted-foreground">Alert when vials are running low</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-primary transition-colors">
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly AI Insights</p>
                    <p className="text-sm text-muted-foreground">Receive weekly summary and recommendations</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-muted transition-colors">
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-muted-foreground transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Data Management Section */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Data Management</h2>
                </div>
              </div>
              <div className="divide-y divide-border">
                <button className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium">Export Data</p>
                      <p className="text-sm text-muted-foreground">Download all your data as JSON or CSV</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
                <button className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium">Privacy Policy</p>
                      <p className="text-sm text-muted-foreground">How we handle your data</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
                <button className="w-full p-5 flex items-center justify-between hover:bg-red-500/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <div className="text-left">
                      <p className="font-medium text-red-500">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
