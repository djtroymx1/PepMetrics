import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { MonthCalendar } from "@/components/month-calendar"
import { UpcomingSchedule } from "@/components/upcoming-schedule"
import { CalendarLegend } from "@/components/calendar-legend"

export default function CalendarPage() {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-balance">Calendar</h1>
            <p className="text-text-secondary mt-1">View your schedule and track all activities</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <MonthCalendar />
              <CalendarLegend />
            </div>
            <div>
              <UpcomingSchedule />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
