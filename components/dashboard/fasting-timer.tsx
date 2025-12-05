"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Plus, Play, Square, Utensils, Zap } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  getFastingStart,
  saveFastingStart,
  clearFastingStart,
} from "@/lib/storage";
import { QuickLogModal } from "@/components/quick-log-modal";

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
          className="text-white/5"
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
        <span className="text-3xl font-bold text-white tracking-tighter">
          {formatTime(elapsed)}
        </span>
        <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest mt-1">
          Elapsed
        </span>
      </div>
    </div>
  );
}

export function FastingTimer() {
  const [fastingStart, setFastingStart] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const isSafeToInject = elapsed >= 2;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left Column: Fasting Timer (60%) */}
      <Card className="col-span-7 bg-card/50 border-white/5 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-50" />
        <CardContent className="p-5 flex flex-col items-center justify-center h-full relative z-10">
          <div className="w-full flex justify-between items-center mb-2">
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" /> Fasting
            </div>
            {isSafeToInject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              >
                SAFE TO INJECT
              </motion.div>
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
      <Card className="col-span-5 bg-card/50 border-white/5 backdrop-blur-sm flex flex-col">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Utensils className="w-3 h-3 text-blue-400" /> Nutrition
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-white leading-none">
                Log Meal
              </div>
              <div className="text-[10px] font-medium text-white/40">
                Last: <span className="text-white/60">2h 15m ago</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 h-10 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/50 hover:text-primary text-white/60 transition-all duration-300 group"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />{" "}
            Add
          </Button>
        </CardContent>
      </Card>

      <QuickLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
