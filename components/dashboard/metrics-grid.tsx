"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SparkAreaChart } from "@tremor/react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { ArrowDown, ArrowUp, Moon, Activity, Scale, Plus, X, Check, Loader2 } from "lucide-react";
import Link from "next/link";

type ChartData = {
  day: string;
  val: number;
};

type GarminRow = {
  data_date: string;
  sleep: { score?: number; total_hours?: number } | null;
  hrv_avg: number | null;
};

export function MetricsGrid() {
  const { user } = useAuth();
  const [weightData, setWeightData] = useState<ChartData[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [eightWeekChange, setEightWeekChange] = useState<number | null>(null);
  const [eightWeekPercent, setEightWeekPercent] = useState<number | null>(null);

  // Weight logging state
  const [isWeightInputOpen, setIsWeightInputOpen] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);
  const [weightLogSuccess, setWeightLogSuccess] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const weightInputRef = useRef<HTMLInputElement>(null);

  // Sleep state
  const [sleepData, setSleepData] = useState<ChartData[]>([]);
  const [lastSleepScore, setLastSleepScore] = useState<number | null>(null);
  const [sleepDelta, setSleepDelta] = useState<number | null>(null);

  // HRV state
  const [hrvData, setHrvData] = useState<ChartData[]>([]);
  const [lastHrv, setLastHrv] = useState<number | null>(null);
  const [hrvBaseline, setHrvBaseline] = useState<number | null>(null);
  const [hrvDeltaPercent, setHrvDeltaPercent] = useState<number | null>(null);

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

        const oldest = weights[0].value;
        const change = latest - oldest;
        setEightWeekChange(Number(change.toFixed(1)));
        setEightWeekPercent(Number(((change / oldest) * 100).toFixed(1)));
      }

      // Fetch Garmin data for Sleep/HRV (last 14 days)
      const { data: garminData } = await supabase
        .from("garmin_data")
        .select("data_date, sleep, hrv_avg")
        .eq("user_id", user.id)
        .order("data_date", { ascending: false })
        .limit(14);

      if (garminData && garminData.length > 0) {
        const typedGarmin = (garminData as GarminRow[]).reverse();

        // Sleep data
        const sleepScores = typedGarmin
          .filter((g) => g.sleep?.score != null)
          .map((g) => ({
            day: new Date(g.data_date + "T00:00:00").toLocaleDateString(
              "en-US",
              { weekday: "short" }
            ),
            val: g.sleep!.score!,
          }));

        if (sleepScores.length > 0) {
          setSleepData(sleepScores.slice(-7));
          setLastSleepScore(sleepScores[sleepScores.length - 1].val);
          const avg =
            sleepScores.reduce((sum, s) => sum + s.val, 0) / sleepScores.length;
          setSleepDelta(
            Math.round(sleepScores[sleepScores.length - 1].val - avg)
          );
        }

        // HRV data
        const hrvValues = typedGarmin
          .filter((g) => g.hrv_avg != null)
          .map((g) => ({
            day: new Date(g.data_date + "T00:00:00").toLocaleDateString(
              "en-US",
              { weekday: "short" }
            ),
            val: g.hrv_avg!,
          }));

        if (hrvValues.length > 0) {
          setHrvData(hrvValues.slice(-7));
          setLastHrv(Math.round(hrvValues[hrvValues.length - 1].val));
          const baseline =
            hrvValues.reduce((sum, h) => sum + h.val, 0) / hrvValues.length;
          setHrvBaseline(Math.round(baseline));
          const deltaPercent =
            ((hrvValues[hrvValues.length - 1].val - baseline) / baseline) * 100;
          setHrvDeltaPercent(Math.round(deltaPercent));
        }
      }
    }

    loadMetrics();
  }, [user, refreshCounter]);

  // Focus input when weight input opens
  useEffect(() => {
    if (isWeightInputOpen && weightInputRef.current) {
      weightInputRef.current.focus();
    }
  }, [isWeightInputOpen]);

  const logWeight = async () => {
    if (!user || isLoggingWeight) return;
    const value = parseFloat(weightInput);
    if (isNaN(value) || value <= 0) return;

    setIsLoggingWeight(true);
    setWeightLogSuccess(false);

    const supabase = createClient();

    const { error } = await supabase.from("weights").insert({
      user_id: user.id,
      value: value,
      unit: "lbs",
      measured_at: new Date().toISOString(),
    });

    if (!error) {
      setCurrentWeight(value);
      setWeightLogSuccess(true);
      setRefreshCounter((c) => c + 1);

      // Clear success state and close input after 1.5 seconds
      setTimeout(() => {
        setWeightLogSuccess(false);
        setIsWeightInputOpen(false);
        setWeightInput("");
      }, 1500);
    }

    setIsLoggingWeight(false);
  };

  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      logWeight();
    } else if (e.key === "Escape") {
      setIsWeightInputOpen(false);
      setWeightInput("");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Weight Card */}
      <Card className="glass-surface-strong border backdrop-blur-sm group hover:glass-surface transition-colors duration-300 relative">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-teal-400" /> Weight
            </div>
            <div className="flex items-center gap-2">
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
              {!isWeightInputOpen && (
                <button
                  onClick={() => setIsWeightInputOpen(true)}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
                  title="Log weight"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Inline weight input */}
          {isWeightInputOpen && (
            <div className="mb-3 flex items-center gap-2">
              <input
                ref={weightInputRef}
                type="number"
                step="0.1"
                placeholder={currentWeight?.toString() || "185.0"}
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                onKeyDown={handleWeightKeyDown}
                className="flex-1 h-8 rounded-lg border border-border/60 glass-track px-2 text-sm font-mono tabular-nums text-foreground placeholder:text-muted-foreground focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
                disabled={isLoggingWeight}
              />
              <span className="text-xs text-muted-foreground">lbs</span>
              <button
                onClick={logWeight}
                disabled={isLoggingWeight || !weightInput}
                className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                  weightLogSuccess
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 disabled:opacity-50"
                }`}
              >
                {isLoggingWeight ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : weightLogSuccess ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => {
                  setIsWeightInputOpen(false);
                  setWeightInput("");
                }}
                className="flex items-center justify-center w-7 h-7 rounded-lg glass-track text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-foreground tracking-tight">
              {currentWeight || "--"}
            </span>
            <span className="text-xs font-medium text-muted-foreground">lbs</span>
          </div>

          <div className="text-xs text-muted-foreground mb-4 font-medium">
            {eightWeekChange && eightWeekChange < 0 ? "Down" : "Up"}{" "}
            <span className="text-foreground">
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
      <Card className="glass-surface-strong border backdrop-blur-sm group hover:glass-surface transition-colors duration-300">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Moon className="w-3.5 h-3.5 text-violet-400" /> Sleep
            </div>
            {sleepDelta !== null && (
              <div
                className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  sleepDelta >= 0
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {sleepDelta >= 0 ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(sleepDelta)} pts
              </div>
            )}
          </div>

          {lastSleepScore !== null ? (
            <>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-foreground tracking-tight">
                  {lastSleepScore}
                </span>
                <span className="text-xs font-medium text-muted-foreground">Score</span>
              </div>

              <div className="text-xs text-muted-foreground mb-4 font-medium">
                {sleepDelta !== null && sleepDelta >= 0 ? "+" : ""}
                {sleepDelta} pts vs 7d avg
              </div>

              <div className="h-12 -mx-2">
                <SparkAreaChart
                  data={sleepData.length > 0 ? sleepData : [{ day: "Now", val: 0 }]}
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
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">No sleep data yet</p>
              <Link
                href="/health"
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                Import Garmin data →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* HRV Card (Full Width) */}
      <Card className="col-span-2 glass-surface-strong border backdrop-blur-sm group hover:glass-surface transition-colors duration-300">
        <CardContent className="p-5 flex items-center justify-between">
          {lastHrv !== null ? (
            <>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <Activity className="w-3.5 h-3.5 text-rose-400" /> HRV Status
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground tracking-tight">
                    {lastHrv}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">ms</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                      hrvDeltaPercent !== null && hrvDeltaPercent >= 0
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {hrvDeltaPercent !== null && hrvDeltaPercent >= 5
                      ? "Optimal"
                      : hrvDeltaPercent !== null && hrvDeltaPercent >= -5
                      ? "Normal"
                      : "Low"}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {hrvDeltaPercent !== null && hrvDeltaPercent >= 0 ? "+" : ""}
                    {hrvDeltaPercent}% vs baseline
                  </span>
                </div>
              </div>

              <div className="w-1/2 h-16">
                <SparkAreaChart
                  data={hrvData.length > 0 ? hrvData : [{ day: "Now", val: 0 }]}
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
            </>
          ) : (
            <div className="w-full py-2 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <Activity className="w-3.5 h-3.5 text-rose-400" /> HRV Status
              </div>
              <p className="text-sm text-muted-foreground mb-2">No HRV data yet</p>
              <Link
                href="/health"
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Import Garmin data →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
