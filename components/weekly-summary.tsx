'use client'

import { Brain, Calendar, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface WeeklySummaryProps {
  summary: string
  recommendations: string[]
  weekStart: string
  weekEnd: string
  className?: string
}

export function WeeklySummary({
  summary,
  recommendations,
  weekStart,
  weekEnd,
  className,
}: WeeklySummaryProps) {
  // Format date range
  const formatDateRange = () => {
    const start = new Date(weekStart)
    const end = new Date(weekEnd)

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const startStr = start.toLocaleDateString('en-US', options)
    const endStr = end.toLocaleDateString('en-US', { ...options, year: 'numeric' })

    return `${startStr} - ${endStr}`
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription className="flex items-center gap-1.5 mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateRange()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary prose */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {summary.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h4 className="text-sm font-medium">Recommendations</h4>
            </div>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton loader for weekly summary
 */
export function WeeklySummarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse w-full" />
        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
        <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
      </CardContent>
    </Card>
  )
}
