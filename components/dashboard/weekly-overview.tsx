"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getWeeklySchedule } from "@/lib/scheduling";
import { getProtocols, getDoseLogs } from "@/lib/storage";
import { useEffect, useState } from "react";
import type { DaySchedule } from "@/lib/types";

export function WeeklyOverview() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);

  useEffect(() => {
    const protocols = getProtocols();
    const logs = getDoseLogs();
    const activeProtocols = protocols.filter((p) => p.status === "active");

    // Get schedule for this week (Mon-Sun)
    // Note: getWeeklySchedule returns next 7 days, we might want a fixed Mon-Sun week view
    // For now, let's use the existing helper which gives us a 7-day lookahead
    const weeklyData = getWeeklySchedule(activeProtocols, logs);
    setSchedule(weeklyData);
  }, []);

  return (
    <Card className="bg-card/30 border-white/5 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          {schedule.map((day) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString("en-US", {
              weekday: "narrow",
            }); // M, T, W...

            // Determine status color
            // Green: All doses taken
            // Yellow: Some taken, some pending/overdue
            // Gray: Future/No doses
            // Red: Past and overdue

            let statusColor = "bg-white/10"; // Default/Empty
            const totalDoses = day.doses.length;
            const takenDoses = day.doses.filter(
              (d) => d.status === "taken"
            ).length;

            if (totalDoses > 0) {
              if (takenDoses === totalDoses) {
                statusColor =
                  "bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]";
              } else if (takenDoses > 0) {
                statusColor =
                  "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]";
              } else if (day.isPast) {
                statusColor = "bg-red-500/50";
              } else {
                statusColor = "bg-white/20"; // Pending future
              }
            }

            return (
              <div
                key={day.date}
                className="flex flex-col items-center gap-2 group cursor-default"
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    day.isToday
                      ? "text-white"
                      : "text-white/40 group-hover:text-white/70"
                  } transition-colors`}
                >
                  {dayName}
                </span>

                <div
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${statusColor}
                    ${
                      day.isToday
                        ? "scale-125 ring-2 ring-white/10 ring-offset-2 ring-offset-black"
                        : ""
                    }
                `}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
