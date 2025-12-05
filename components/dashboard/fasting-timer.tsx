"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Plus, Play, Square, Utensils, Zap, Loader2, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  getFastingStart,
  saveFastingStart,
  clearFastingStart,
} from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function FastingRing({ elapsed, goal }: { elapsed: number; goal: number }) {
  const progress = Math.min(elapsed / goal, 1);
  const circumference = 2 * Math.PI * 52; // slightly larger radius

  // Color logic based on phase
  // < 12h: Blue (Fed/Early)
  // 12-16h: Teal (Fat Burning)
  // > 16h: Violet (Autophagy)
  let strokeColor = "text-blue-500";
  if (elapsed >= 12) strokeColor = "text-teal-500";
  if (elapsed >= 16) strokeColor = "text-violet-500";

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-36 h-36 mx-auto">
      {/* Background Track */}
      <svg className="w-full h-full -rotate-90 drop-shadow-lg">
        <circle
          cx="72"
          cy="72"
          r="52"
          stroke="currentColor"
          className="text-foreground/10"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress Arc */}
        <motion.circle
          cx="72"
          cy="72"
          r="52"
          stroke="currentColor"
          className={strokeColor}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          strokeDasharray={circumference}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground tracking-tighter">
          {formatTime(elapsed)}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
          Elapsed
        </span>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours % 24}h ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMins % 60}m ago`;
  } else if (diffMins > 0) {
    return `${diffMins}m ago`;
  }
  return "Just now";
}

export function FastingTimer() {
  const { user } = useAuth();
  const [fastingStart, setFastingStart] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [lastMealTime, setLastMealTime] = useState<Date | null>(null);
  const [lastMealDisplay, setLastMealDisplay] = useState<string>("--");
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);
  const [mealLogSuccess, setMealLogSuccess] = useState(false);
  const [mealLogCounter, setMealLogCounter] = useState(0);

  const loadData = useCallback(() => {
    const start = getFastingStart();
    setFastingStart(start);
    if (start) {
      const now = new Date();
      const diffHours = (now.getTime() - start.getTime()) / (1000 * 60 * 60);
      setElapsed(diffHours);
    } else {
      setElapsed(0);
    }
  }, []);

  // Fetch last meal from Supabase
  useEffect(() => {
    async function fetchLastMeal() {
      if (!user) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("meals")
        .select("meal_time")
        .eq("user_id", user.id)
        .order("meal_time", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const mealTime = new Date(data[0].meal_time);
        setLastMealTime(mealTime);
        setLastMealDisplay(formatTimeAgo(mealTime));
      }
    }
    fetchLastMeal();
  }, [user, mealLogCounter]); // Re-fetch when meal is logged

  // Update last meal display every minute
  useEffect(() => {
    if (!lastMealTime) return;
    const interval = setInterval(() => {
      setLastMealDisplay(formatTimeAgo(lastMealTime));
    }, 60000);
    return () => clearInterval(interval);
  }, [lastMealTime]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      if (fastingStart) {
        const now = new Date();
        const diffHours =
          (now.getTime() - fastingStart.getTime()) / (1000 * 60 * 60);
        setElapsed(diffHours);
      }
    }, 60000);

    window.addEventListener("storage", loadData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", loadData);
    };
  }, [loadData, fastingStart]);

  const toggleFasting = () => {
    if (fastingStart) {
      clearFastingStart();
      setFastingStart(null);
      setElapsed(0);
    } else {
      const now = new Date();
      saveFastingStart(now);
      setFastingStart(now);
    }
  };

  const logMeal = async () => {
    if (!user || isLoggingMeal) return;

    setIsLoggingMeal(true);
    setMealLogSuccess(false);

    const supabase = createClient();
    const now = new Date();

    const { error } = await supabase.from("meals").insert({
      user_id: user.id,
      meal_type: "meal",
      meal_time: now.toISOString(),
    });

    if (!error) {
      // Update UI immediately
      setLastMealTime(now);
      setLastMealDisplay("Just now");
      setMealLogSuccess(true);
      setMealLogCounter((c) => c + 1);

      // Reset fasting timer
      saveFastingStart(now);
      setFastingStart(now);
      setElapsed(0);

      // Clear success state after 2 seconds
      setTimeout(() => setMealLogSuccess(false), 2000);
    }

    setIsLoggingMeal(false);
  };

  const isSafeToInject = elapsed >= 2;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left Column: Fasting Timer (60%) */}
      <Card className="col-span-7 glass-surface-strong border backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-foreground/10 to-transparent opacity-50" />
        <CardContent className="p-5 flex flex-col items-center justify-center h-full relative z-10">
          <div className="w-full flex justify-between items-center mb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" /> Fasting
            </div>
            {isSafeToInject && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-help"
                    >
                      SAFE TO INJECT
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-xs">
                      <span className="font-semibold">Fasting peptides:</span>{" "}
                      Retatrutide, MOTS-c, Tesamorelin
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      These work best when taken 2+ hours after eating
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <FastingRing elapsed={elapsed} goal={16} />

          <Button
            variant="ghost"
            size="sm"
            className={`mt-4 h-9 px-4 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300
                ${
                  fastingStart
                    ? "border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    : "border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                }`}
            onClick={toggleFasting}
          >
            {fastingStart ? (
              <>
                <Square className="mr-2 h-3 w-3 fill-current" /> END FAST
              </>
            ) : (
              <>
                <Play className="mr-2 h-3 w-3 fill-current" /> START FAST
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Right Column: Meal Log (40%) */}
      <Card className="col-span-5 glass-surface-strong border backdrop-blur-sm flex flex-col">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Utensils className="w-3 h-3 text-blue-400" /> Nutrition
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-foreground leading-none">
                Log Meal
              </div>
              <div className="text-[10px] font-medium text-muted-foreground">
                Last:{" "}
                <span className="text-muted-foreground">
                  {lastMealTime ? lastMealDisplay : "No meals logged"}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className={`w-full mt-4 h-10 border-dashed transition-all duration-300 group ${
              mealLogSuccess
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                : "border-border/60 bg-muted/40 hover:bg-primary/10 hover:border-primary/50 hover:text-primary text-foreground/80"
            }`}
            onClick={logMeal}
            disabled={isLoggingMeal || !user}
          >
            {isLoggingMeal ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : mealLogSuccess ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            )}
            {mealLogSuccess ? "Logged!" : "Log Meal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
