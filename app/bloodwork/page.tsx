import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { FlaskConical, Upload, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from "lucide-react"

const biomarkerCategories = [
  {
    name: "Hormones",
    markers: [
      { name: "Testosterone (Total)", value: 685, unit: "ng/dL", min: 300, max: 1000, optimal: [500, 900], status: "optimal", trend: "up" },
      { name: "Free Testosterone", value: 18.2, unit: "pg/mL", min: 5, max: 25, optimal: [12, 22], status: "optimal", trend: "stable" },
      { name: "IGF-1", value: 245, unit: "ng/mL", min: 100, max: 350, optimal: [180, 280], status: "optimal", trend: "up" },
      { name: "Estradiol", value: 32, unit: "pg/mL", min: 10, max: 50, optimal: [20, 40], status: "optimal", trend: "stable" },
    ]
  },
  {
    name: "Metabolic",
    markers: [
      { name: "Fasting Glucose", value: 92, unit: "mg/dL", min: 65, max: 100, optimal: [70, 90], status: "normal", trend: "down" },
      { name: "HbA1c", value: 5.2, unit: "%", min: 4.0, max: 5.7, optimal: [4.5, 5.4], status: "optimal", trend: "down" },
      { name: "Fasting Insulin", value: 6.8, unit: "uIU/mL", min: 2.0, max: 25, optimal: [2, 8], status: "optimal", trend: "down" },
    ]
  },
  {
    name: "Lipids",
    markers: [
      { name: "Total Cholesterol", value: 185, unit: "mg/dL", min: 100, max: 200, optimal: [150, 190], status: "optimal", trend: "down" },
      { name: "LDL", value: 98, unit: "mg/dL", min: 0, max: 100, optimal: [50, 90], status: "normal", trend: "down" },
      { name: "HDL", value: 62, unit: "mg/dL", min: 40, max: 100, optimal: [55, 80], status: "optimal", trend: "up" },
      { name: "Triglycerides", value: 95, unit: "mg/dL", min: 0, max: 150, optimal: [50, 100], status: "optimal", trend: "down" },
    ]
  },
  {
    name: "Inflammation",
    markers: [
      { name: "hs-CRP", value: 0.8, unit: "mg/L", min: 0, max: 3, optimal: [0, 1], status: "optimal", trend: "down" },
      { name: "Homocysteine", value: 9.2, unit: "umol/L", min: 4, max: 15, optimal: [6, 10], status: "optimal", trend: "stable" },
    ]
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "optimal": return "text-green-500"
    case "normal": return "text-blue-400"
    case "elevated": return "text-amber-500"
    case "high": return "text-red-500"
    case "low": return "text-amber-500"
    default: return "text-muted-foreground"
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "up": return <TrendingUp className="h-4 w-4 text-green-500" />
    case "down": return <TrendingDown className="h-4 w-4 text-blue-400" />
    default: return <Minus className="h-4 w-4 text-muted-foreground" />
  }
}

function BiomarkerBar({ value, min, max, optimal }: { value: number, min: number, max: number, optimal: number[] }) {
  const range = max - min
  const position = ((value - min) / range) * 100
  const optimalStart = ((optimal[0] - min) / range) * 100
  const optimalWidth = ((optimal[1] - optimal[0]) / range) * 100

  return (
    <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
      {/* Optimal zone */}
      <div 
        className="absolute h-full bg-green-500/30" 
        style={{ left: `${optimalStart}%`, width: `${optimalWidth}%` }}
      />
      {/* Value indicator */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background"
        style={{ left: `calc(${position}% - 6px)` }}
      />
    </div>
  )
}

export default function BloodworkPage() {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <FlaskConical className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-semibold">Bloodwork</h1>
              </div>
              <p className="text-muted-foreground">
                Track biomarkers and see how your protocols affect key health indicators
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Upload className="h-4 w-4" />
              Upload Lab Report
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Optimal Markers</span>
              </div>
              <p className="text-3xl font-semibold">12</p>
              <p className="text-sm text-muted-foreground mt-1">out of 14 total</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-muted-foreground">Needs Attention</span>
              </div>
              <p className="text-3xl font-semibold">2</p>
              <p className="text-sm text-muted-foreground mt-1">markers to monitor</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Last Updated</span>
              </div>
              <p className="text-lg font-semibold">Nov 15, 2024</p>
              <p className="text-sm text-muted-foreground mt-1">Baseline established Oct 1</p>
            </div>
          </div>

          {/* Biomarker Categories */}
          <div className="space-y-6">
            {biomarkerCategories.map((category) => (
              <div key={category.name} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-muted/30">
                  <h2 className="font-semibold">{category.name}</h2>
                </div>
                <div className="divide-y divide-border">
                  {category.markers.map((marker) => (
                    <div key={marker.name} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{marker.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            marker.status === "optimal" ? "bg-green-500/10 text-green-500" :
                            marker.status === "normal" ? "bg-blue-500/10 text-blue-400" :
                            "bg-amber-500/10 text-amber-500"
                          }`}>
                            {marker.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-lg font-semibold">
                            {marker.value}
                          </span>
                          <span className="text-sm text-muted-foreground">{marker.unit}</span>
                          {getTrendIcon(marker.trend)}
                        </div>
                      </div>
                      <BiomarkerBar 
                        value={marker.value} 
                        min={marker.min} 
                        max={marker.max} 
                        optimal={marker.optimal} 
                      />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{marker.min}</span>
                        <span className="text-green-500">Optimal: {marker.optimal[0]}-{marker.optimal[1]}</span>
                        <span>{marker.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
