'use client'

import { useState } from 'react'
import {
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { Insight, InsightType, InsightSeverity, InsightConfidence } from '@/lib/types'
import { INSIGHT_TYPE_INFO, INSIGHT_SEVERITY_INFO, INSIGHT_CONFIDENCE_INFO } from '@/lib/types'

interface InsightCardProps {
  insight: Insight
  className?: string
}

// Map insight types to icons
const TYPE_ICONS: Record<InsightType, React.ComponentType<{ className?: string }>> = {
  correlation: TrendingUp,
  timing: Clock,
  compliance: CheckCircle,
  anomaly: AlertTriangle,
  trend: Activity,
}

export function InsightCard({ insight, className }: InsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const typeInfo = INSIGHT_TYPE_INFO[insight.type]
  const severityInfo = INSIGHT_SEVERITY_INFO[insight.severity]
  const confidenceInfo = INSIGHT_CONFIDENCE_INFO[insight.confidence]
  const Icon = TYPE_ICONS[insight.type]

  const hasDataPoints = insight.data_points && Object.keys(insight.data_points).length > 0

  return (
    <Card className={cn('overflow-hidden', className)}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full text-left">
          <div className="p-4">
            {/* Header row */}
            <div className="flex items-start gap-3">
              {/* Type icon */}
              <div className={cn(
                'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                severityInfo.bgColor
              )}>
                <Icon className={cn('h-5 w-5', typeInfo.color)} />
              </div>

              {/* Title and badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-medium text-sm">{insight.title}</h3>

                  {/* Severity badge */}
                  {insight.severity !== 'info' && (
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      severityInfo.bgColor,
                      severityInfo.textColor
                    )}>
                      {severityInfo.label}
                    </span>
                  )}
                </div>

                {/* Confidence indicator */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{typeInfo.label}</span>
                  <span className="text-border">•</span>
                  <span>{confidenceInfo.label} correlation</span>
                </div>
              </div>

              {/* Expand/collapse indicator */}
              <div className="flex-shrink-0 text-muted-foreground">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0 space-y-3">
            {/* Body text */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.body}
            </p>

            {/* Metrics pills */}
            {insight.metrics.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {insight.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            )}

            {/* Data points */}
            {hasDataPoints && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Supporting data:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(insight.data_points).map(([key, value]) => (
                    <div
                      key={key}
                      className="px-2 py-1.5 rounded-md bg-muted/50 text-center"
                    >
                      <p className="text-xs text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

/**
 * Skeleton loader for insight cards
 */
export function InsightCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
    </Card>
  )
}
