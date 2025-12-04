'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ChevronRight, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Insight, InsightSeverity } from '@/lib/types'

interface WidgetData {
  hasInsights: boolean
  latestInsight?: Insight
  weekStart?: string
  weekEnd?: string
  insightCount?: number
  dataQuality?: 'excellent' | 'good' | 'fair' | 'insufficient'
}

const SEVERITY_STYLES: Record<InsightSeverity, { bg: string; text: string; icon: string }> = {
  info: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', icon: 'text-blue-500' },
  notable: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', icon: 'text-amber-500' },
  alert: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', icon: 'text-red-500' },
}

function TrendIcon({ type }: { type: string }) {
  if (type === 'trend') {
    return <TrendingUp className="h-4 w-4" />
  }
  if (type === 'anomaly') {
    return <AlertCircle className="h-4 w-4" />
  }
  return <Sparkles className="h-4 w-4" />
}

export function WeeklyInsightsWidget() {
  const [data, setData] = useState<WidgetData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLatestInsight() {
      try {
        const response = await fetch('/api/insights?limit=1')

        if (!response.ok) {
          if (response.status === 401) {
            setData({ hasInsights: false })
            return
          }
          throw new Error('Failed to fetch insights')
        }

        const result = await response.json()

        if (result.insights && result.insights.length > 0) {
          const latest = result.insights[0]
          // Pick the most notable insight to feature
          const featuredInsight = latest.insights?.find((i: Insight) => i.severity === 'alert')
            || latest.insights?.find((i: Insight) => i.severity === 'notable')
            || latest.insights?.[0]

          setData({
            hasInsights: true,
            latestInsight: featuredInsight,
            weekStart: latest.weekStart,
            weekEnd: latest.weekEnd,
            insightCount: latest.insights?.length || 0,
          })
        } else {
          setData({ hasInsights: false })
        }
      } catch (err) {
        console.error('Error fetching insights for widget:', err)
        setData({ hasInsights: false })
      } finally {
        setLoading(false)
      }
    }

    fetchLatestInsight()
  }, [])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 w-32 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.hasInsights) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Generate your first AI analysis to see personalized insights about your protocols and health data.
          </p>
          <Link
            href="/insights"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Get Started
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    )
  }

  const { latestInsight, weekStart, weekEnd, insightCount } = data
  const severity = latestInsight?.severity || 'info'
  const styles = SEVERITY_STYLES[severity]

  // Format date range
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Insights</CardTitle>
          </div>
          {weekStart && weekEnd && (
            <span className="text-xs text-muted-foreground">
              {formatDate(weekStart)} - {formatDate(weekEnd)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {latestInsight ? (
          <div className="space-y-3">
            {/* Featured insight */}
            <div className={cn('rounded-lg p-3', styles.bg)}>
              <div className="flex items-start gap-2">
                <div className={cn('mt-0.5', styles.icon)}>
                  <TrendIcon type={latestInsight.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={cn('font-medium text-sm', styles.text)}>
                    {latestInsight.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {latestInsight.body}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {insightCount} insights discovered
              </span>
              <Link
                href="/insights"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              No insights generated yet
            </p>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Generate Analysis
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
