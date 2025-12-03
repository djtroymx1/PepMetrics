"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { ProgressBar, BadgeDelta } from "@tremor/react"
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

function getTrendIcon(trend: string) {
  switch (trend) {
    case "up": return <TrendingUp className="h-4 w-4 text-emerald-500" />
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
    <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
      {/* Optimal zone */}
      <div
        className="absolute h-full bg-emerald-500/20"
        style={{ left: `${optimalStart}%`, width: `${optimalWidth}%` }}
      />
      {/* Value indicator */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-md"
        style={{ left: `calc(${position}% - 8px)` }}
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
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
                <FlaskConical className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold">Bloodwork</h1>
                <p className="text-muted-foreground mt-1">
                  Track biomarkers and see how your protocols affect key health indicators
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Upload className="h-4 w-4" />
              Upload Lab Report
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-sm text-muted-foreground">Optimal Markers</span>
              </div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground mt-1">out of 14 total</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-sm text-muted-foreground">Needs Attention</span>
              </div>
              <p className="text-3xl font-bold">2</p>
              <p className="text-sm text-muted-foreground mt-1">markers to monitor</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Last Updated</span>
              </div>
              <p className="text-xl font-semibold">Nov 15, 2024</p>
              <p className="text-sm text-muted-foreground mt-1">Baseline established Oct 1</p>
            </div>
          </div>

          {/* Biomarker Categories */}
          <div className="space-y-6">
            {biomarkerCategories.map((category) => (
              <div key={category.name} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-muted/30">
                  <h2 className="font-semibold">{category.name}</h2>
                </div>
                <div className="divide-y divide-border">
                  {category.markers.map((marker) => (
                    <div key={marker.name} className="px-5 py-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{marker.name}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${
                            marker.status === "optimal" ? "bg-emerald-500/10 text-emerald-500" :
                            marker.status === "normal" ? "bg-blue-500/10 text-blue-400" :
                            "bg-amber-500/10 text-amber-500"
                          }`}>
                            {marker.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xl font-bold">
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
                        <span className="font-mono">{marker.min}</span>
                        <span className="text-emerald-500 font-medium">Optimal: {marker.optimal[0]}-{marker.optimal[1]}</span>
                        <span className="font-mono">{marker.max}</span>
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
