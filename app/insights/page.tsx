'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { InsightCard, InsightCardSkeleton } from "@/components/insight-card"
import { WeeklySummary, WeeklySummarySkeleton } from "@/components/weekly-summary"
import { GenerateAnalysisButton } from "@/components/generate-analysis-button"
import { InsightsEmptyState } from "@/components/insights-empty-state"
import { InsightsChat } from "@/components/insights-chat"
import { Sparkles } from "lucide-react"
import type { WeeklyInsights, InsightsState } from "@/lib/types"
import { useProtocolsSync } from "@/hooks/use-protocols-sync"
import { useDoseLogsSync } from "@/hooks/use-dose-logs-sync"

export default function InsightsPage() {
  const [state, setState] = useState<InsightsState>('loading')
  const [insights, setInsights] = useState<WeeklyInsights | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [missingDetails, setMissingDetails] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  const { syncFromLocalStorage: syncProtocols } = useProtocolsSync()
  const { syncFromLocalStorage: syncDoseLogs } = useDoseLogsSync()
  const hasSyncedRef = useRef(false)

  // Sync localStorage data to Supabase so AI features can access it
  const syncDataToSupabase = useCallback(async () => {
    try {
      // Sync protocols and dose logs in parallel
      const [protocolResult, doseLogResult] = await Promise.all([
        syncProtocols(),
        syncDoseLogs(),
      ])

      // Log sync results for debugging
      if (protocolResult?.synced || doseLogResult?.synced) {
        console.log('Data synced:', {
          protocols: protocolResult?.synced || 0,
          doseLogs: doseLogResult?.synced || 0,
        })
      }
    } catch (err) {
      console.error('Error syncing data:', err)
      // Don't block the page load if sync fails
    }
  }, [syncProtocols, syncDoseLogs])

  // Sync data and fetch existing insights on mount
  useEffect(() => {
    const initializeData = async () => {
      // Only sync once per page load
      if (!hasSyncedRef.current) {
        hasSyncedRef.current = true
        await syncDataToSupabase()
      }
      fetchInsights()
    }
    initializeData()
  }, [syncDataToSupabase])

  const fetchInsights = async () => {
    setState('loading')
    setError(null)
    setMissingDetails(null)

    try {
      const response = await fetch('/api/insights')

      if (!response.ok) {
        if (response.status === 401) {
          setState('empty')
          return
        }
        throw new Error('Failed to fetch insights')
      }

      const data = await response.json()

      if (data.latest) {
        setInsights(data.latest)
        setState('ready')
      } else {
        setState('empty')
      }
    } catch (err) {
      console.error('Error fetching insights:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setState('error')
    }
  }

  const handleGenerate = useCallback(async () => {
    setState('generating')
    setError(null)
    setSyncStatus('Syncing your data...')

    try {
      // Always sync before generating to ensure latest data is available
      await syncDataToSupabase()
      setSyncStatus(null)

      const response = await fetch('/api/insights/generate', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.missingData) {
          // Insufficient data
          setState('no-data')

          const statsLine = data.stats
            ? `Garmin days: ${data.stats.daysOfGarminData}, dose logs: ${data.stats.daysOfDoseLogs}, active protocols: ${data.stats.activeProtocols}, completeness: ${data.stats.completenessScore}%`
            : null

          const windowLine = data.analysisWindow
            ? `Analyzed window: ${data.analysisWindow.start} to ${data.analysisWindow.end}`
            : null

          const details = [
            data.message,
            ...(data.missingData || []),
            statsLine,
            windowLine,
          ].filter(Boolean).join('\n')

          setError(data.message)
          setMissingDetails(details)
          return
        }
        throw new Error(data.error || 'Failed to generate insights')
      }

      // If we got cached results, fetch fresh data
      if (data.cached) {
        await fetchInsights()
      } else {
        // Set the new insights directly
        setInsights({
          id: data.insightsId,
          userId: '',
          weekStart: data.weekStart,
          weekEnd: data.weekEnd,
          metricsSummary: {},
          protocolSummary: {},
          correlationData: [],
          insights: data.insights.insights,
          weeklySummary: data.insights.weekly_summary,
          recommendations: data.insights.recommendations,
          generatedAt: new Date().toISOString(),
          modelVersion: 'claude-sonnet-4-20250514',
        })
        setState('ready')
      }
    } catch (err) {
      console.error('Error generating insights:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setState('error')
      setSyncStatus(null)
    }
  }, [syncDataToSupabase])

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-32 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="text-3xl font-semibold">AI Insights</h1>
            </div>
            <p className="text-muted-foreground">
              Personalized analysis and correlations from your tracking data
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Insights Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Loading State */}
              {state === 'loading' && (
                <>
                  <WeeklySummarySkeleton />
                  <div className="space-y-4">
                    <InsightCardSkeleton />
                    <InsightCardSkeleton />
                    <InsightCardSkeleton />
                  </div>
                </>
              )}

              {/* Generating State */}
              {state === 'generating' && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">
                    {syncStatus || 'Analyzing your data...'}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {syncStatus
                      ? 'Preparing your protocols and dose logs for analysis...'
                      : 'Our AI is examining your protocols, health metrics, and looking for meaningful patterns.'
                    }
                  </p>
                </div>
              )}

              {/* Empty State - No insights yet */}
              {state === 'empty' && (
                <InsightsEmptyState
                  variant="no-analysis"
                  onGenerate={handleGenerate}
                />
              )}

              {/* No Data State */}
              {state === 'no-data' && (
                <>
                  {missingDetails && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700 dark:text-amber-300 whitespace-pre-line">
                      {missingDetails}
                    </div>
                  )}
                  <InsightsEmptyState variant="insufficient-data" />
                </>
              )}

              {/* Error State */}
              {state === 'error' && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
                  <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {error || 'Failed to load insights'}
                  </p>
                  <button
                    onClick={fetchInsights}
                    className="text-sm text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Ready State - Show insights */}
              {state === 'ready' && insights && (
                <>
                  {/* Generate new button */}
                  <div className="flex justify-end">
                    <GenerateAnalysisButton
                      onGenerate={handleGenerate}
                      onSuccess={fetchInsights}
                      variant="compact"
                    />
                  </div>

                  {/* Weekly Summary */}
                  <WeeklySummary
                    summary={insights.weeklySummary}
                    recommendations={insights.recommendations}
                    weekStart={insights.weekStart}
                    weekEnd={insights.weekEnd}
                  />

                  {/* Insight Cards */}
                  {insights.insights.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Discovered Patterns</h2>
                      <div className="space-y-4">
                        {insights.insights.map((insight, index) => (
                          <InsightCard key={index} insight={insight} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Chat Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <InsightsChat className="h-[600px]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
