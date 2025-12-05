"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { HeroSection } from "@/components/dashboard/hero-section";
import { FastingTimer } from "@/components/dashboard/fasting-timer";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { WeeklyOverview } from "@/components/dashboard/weekly-overview";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-32 lg:pb-0">
        <div className="p-4 lg:p-8 max-w-md mx-auto lg:max-w-4xl space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">
              Good morning, Troy
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s your health command center.
            </p>
          </div>

          {/* Zone 1: Hero Section (Injection Schedule) */}
          <HeroSection />

          {/* Zone 2: Fasting & Actions */}
          <FastingTimer />

          {/* Zone 2.5: Weekly Overview */}
          <WeeklyOverview />

          {/* Zone 3: Metrics Grid */}
          <MetricsGrid />
        </div>
      </main>
    </div>
  );
}
