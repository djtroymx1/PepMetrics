"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import {
  WeightTrendCard,
  MeasurementsTracker,
  PhotoGallery,
  CheckinTable,
} from "@/components/progress"
import { Camera, TrendingUp } from "lucide-react"

export default function ProgressPage() {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-balance">Progress Tracking</h1>
                <p className="text-muted-foreground mt-1">Track your body composition and progress photos</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Camera className="h-4 w-4" />
              Add Photo
            </button>
          </div>

          {/* Weight Trend */}
          <div className="mb-6">
            <WeightTrendCard />
          </div>

          {/* Measurements and Photos */}
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <div className="lg:col-span-1">
              <MeasurementsTracker />
            </div>
            <div className="lg:col-span-2">
              <PhotoGallery />
            </div>
          </div>

          {/* Daily Check-ins */}
          <CheckinTable />
        </div>
      </main>
    </div>
  )
}
