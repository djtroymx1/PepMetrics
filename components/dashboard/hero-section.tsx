"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getProtocols, getDoseLogs, markDoseAsTaken } from "@/lib/storage";
import { getDosesToday } from "@/lib/scheduling";
import type { ScheduledDose } from "@/lib/types";

export function HeroSection() {
  const [todaysDoses, setTodaysDoses] = useState<ScheduledDose[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    const protocols = getProtocols();
    const logs = getDoseLogs();
    const activeProtocols = protocols.filter((p) => p.status === "active");

    const today = getDosesToday(activeProtocols, logs);
    setTodaysDoses(today);
    setCompletedCount(today.filter((d) => d.status === "taken").length);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, [loadData]);

  const handleComplete = (dose: ScheduledDose) => {
    markDoseAsTaken(
      dose.protocolId,
      dose.scheduledDate,
      dose.doseNumber,
      dose.peptideName,
      dose.dose
    );

    toast.success("Dose Logged", {
      description: `${dose.peptideName} marked as taken`,
      duration: 3000,
    });

    // Optimistic update
    setTodaysDoses((prev) =>
      prev.map((d) =>
        d.protocolId === dose.protocolId && d.doseNumber === dose.doseNumber
          ? { ...d, status: "taken" }
          : d
      )
    );
    setCompletedCount((prev) => prev + 1);
  };

  if (loading)
    return <div className="h-48 animate-pulse glass-track rounded-3xl" />;

  const progressPercentage =
    todaysDoses.length > 0 ? (completedCount / todaysDoses.length) * 100 : 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-medium text-foreground tracking-tight">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
        <span className="text-xs font-medium text-muted-foreground glass-track px-2 py-1 rounded-full">
          {completedCount} of {todaysDoses.length} Complete
        </span>
      </div>

      <Card className="bg-gradient-to-br from-card/90 to-card/70 border border-border/60 shadow-2xl relative overflow-hidden backdrop-blur-xl glass-surface-strong">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <CardContent className="p-5 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Daily Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5 bg-foreground/10" />
          </div>

          {/* Dose List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {todaysDoses.length > 0 ? (
                todaysDoses.map((dose, index) => (
                  <motion.div
                    key={`${dose.protocolId}-${dose.doseNumber}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div
                    className={`
                                relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
                                ${
                                  dose.status === "taken"
                                    ? "glass-surface border opacity-70"
                                    : "glass-surface-strong border hover:shadow-lg hover:shadow-foreground/10"
                                }
                            `}
                  >
                    <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            dose.status !== "taken" && handleComplete(dose)
                          }
                          disabled={dose.status === "taken"}
                          className={`
                                            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                                            ${
                                              dose.status === "taken"
                                                ? "bg-teal-500/20 text-teal-600"
                                                : "glass-track text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
                                            }
                                        `}
                        >
                          <Check
                            className={`w-5 h-5 ${
                              dose.status === "taken" ? "stroke-[3px]" : ""
                            }`}
                          />
                        </button>

                        <div>
                          <h3
                            className={`font-semibold text-base ${
                              dose.status === "taken"
                                ? "text-muted-foreground line-through"
                                : "text-foreground"
                            }`}
                          >
                            {dose.peptideName}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-muted-foreground glass-track px-1.5 py-0.5 rounded">
                              {dose.dose}
                            </span>
                            {dose.requiresFasting &&
                              dose.status !== "taken" && (
                                <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider bg-amber-400/10 px-1.5 py-0.5 rounded">
                                  Fasting Req
                                </span>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {dose.status === "taken" ? (
                          <span className="text-xs font-medium text-teal-600">
                            Done
                          </span>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-medium text-muted-foreground">
                              Due Now
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {dose.timingPreference}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No doses scheduled for today.</p>
                  <Link
                    href="/calendar"
                    className="text-primary text-sm hover:underline mt-2 inline-block"
                  >
                    View Calendar
                  </Link>
                </div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
