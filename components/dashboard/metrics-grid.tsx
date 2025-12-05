"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SparkAreaChart } from "@tremor/react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { ArrowDown, ArrowUp, Moon, Activity, Scale } from "lucide-react";

type ChartData = {
  day: string;
  val: number;
};

export function MetricsGrid() {
  const { user } = useAuth();
  const [weightData, setWeightData] = useState<ChartData[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [eightWeekChange, setEightWeekChange] = useState<number | null>(null);
  const [eightWeekPercent, setEightWeekPercent] = useState<number | null>(null);

  // Placeholder for sleep/HRV
  const sleepData = [
    { day: "Mon", val: 75 },
    { day: "Tue", val: 80 },
    { day: "Wed", val: 82 },
    { day: "Thu", val: 78 },
    { day: "Fri", val: 85 },
    { day: "Sat", val: 88 },
    { day: "Sun", val: 82 },
  ];

  useEffect(() => {
    async function loadMetrics() {
      if (!user) return;
      const supabase = createClient();

      // Fetch Weight (last 60 days ~ 8 weeks)
      const { data: weights } = await supabase
        .from("weights")
        .select("value, measured_at")
        .eq("user_id", user.id)
        .order("measured_at", { ascending: true })
        .limit(60);

      if (weights && weights.length > 0) {
        // Cast to unknown first if needed, but usually Supabase types infer correctly if generated.
        // If not, we can assert the shape.
        const typedWeights = weights as {
          value: number;
          measured_at: string;
        }[];

        const formatted = typedWeights.map((w) => ({
          day: new Date(w.measured_at).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          val: w.value,
        }));
        setWeightData(formatted);

        const latest = weights[weights.length - 1].value;
        setCurrentWeight(latest);

        // Calculate 8-week change (or oldest available)
        const oldest = weights[0].value;
        const change = latest - oldest;
        setEightWeekChange(Number(change.toFixed(1)));
        setEightWeekPercent(Number(((change / oldest) * 100).toFixed(1)));
      }
    }

    loadMetrics();
  }, [user]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Weight Card */}
      <Card className="bg-card/50 border-white/5 backdrop-blur-sm group hover:bg-white/5 transition-colors duration-300">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-teal-400" /> Weight
            </div>
            {eightWeekChange !== null && (
              <div
                className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  eightWeekChange <= 0
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {eightWeekChange <= 0 ? (
                  <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUp className="w-3 h-3" />
                )}
                {Math.abs(eightWeekPercent || 0)}%
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-white tracking-tight">
              {currentWeight || "--"}
            </span>
            <span className="text-xs font-medium text-white/40">lbs</span>
          </div>

          <div className="text-xs text-white/40 mb-4 font-medium">
            {eightWeekChange && eightWeekChange < 0 ? "Down" : "Up"}{" "}
            <span className="text-white/80">
              {Math.abs(eightWeekChange || 0)} lbs
            </span>{" "}
            in 8w
          </div>

          <div className="h-12 -mx-2">
            <SparkAreaChart
              data={
                weightData.length > 0 ? weightData : [{ day: "Now", val: 0 }]
              }
              categories={["val"]}
              index="day"
              colors={["teal"]}
              className="h-full w-full"
              showTooltip={false}
              showGridLines={false}
              showYAxis={false}
              showXAxis={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sleep Card */}
      <Card className="bg-card/50 border-white/5 backdrop-blur-sm group hover:bg-white/5 transition-colors duration-300">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <Moon className="w-3.5 h-3.5 text-violet-400" /> Sleep
            </div>
            <div className="text-[10px] font-bold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full">
              Avg 7h 45m
            </div>
          </div>

          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-white tracking-tight">
              82
            </span>
            <span className="text-xs font-medium text-white/40">Score</span>
          </div>

          <div className="text-xs text-white/40 mb-4 font-medium">
            +4 pts vs 7d avg
          </div>

          <div className="h-12 -mx-2">
            <SparkAreaChart
              data={sleepData}
              categories={["val"]}
              index="day"
              colors={["violet"]}
              className="h-full w-full"
              showTooltip={false}
              showGridLines={false}
              showYAxis={false}
              showXAxis={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* HRV Card (Full Width) */}
      <Card className="col-span-2 bg-card/50 border-white/5 backdrop-blur-sm group hover:bg-white/5 transition-colors duration-300">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-rose-400" /> HRV Status
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">
                45
              </span>
              <span className="text-sm font-medium text-white/40">ms</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                Optimal
              </span>
              <span className="text-xs text-white/40 font-medium">
                +8% vs baseline
              </span>
            </div>
          </div>

          <div className="w-1/2 h-16">
            <SparkAreaChart
              data={sleepData} // Placeholder data
              categories={["val"]}
              index="day"
              colors={["rose"]}
              className="h-full w-full"
              showTooltip={false}
              showGridLines={false}
              showYAxis={false}
              showXAxis={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
