'use client'

import Link from 'next/link'
import { FileSpreadsheet, Database, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateVariant = 'no-garmin' | 'insufficient-data' | 'no-analysis'

interface InsightsEmptyStateProps {
  variant: EmptyStateVariant
  onGenerate?: () => void
  className?: string
}

const VARIANTS = {
  'no-garmin': {
    icon: FileSpreadsheet,
    title: 'Import Your Garmin Data',
    description: 'To generate AI insights, you need to import your health metrics from Garmin Connect. This data helps us find correlations with your peptide protocols.',
    action: 'Import Garmin Data',
    actionHref: '/health',
    showGenerateButton: false,
  },
  'insufficient-data': {
    icon: Database,
    title: 'More Data Needed',
    description: 'We need at least 7 days of Garmin data and a few dose logs to generate meaningful insights. Keep logging your doses and import more health data.',
    action: 'View Health Data',
    actionHref: '/health',
    showGenerateButton: false,
  },
  'no-analysis': {
    icon: Sparkles,
    title: 'No Analysis Yet',
    description: "You haven't generated any AI insights yet. Click the button below to analyze your protocols and health metrics.",
    action: null,
    actionHref: null,
    showGenerateButton: true,
  },
}

export function InsightsEmptyState({
  variant,
  onGenerate,
  className,
}: InsightsEmptyStateProps) {
  const config = VARIANTS[variant]
  const Icon = config.icon

  return (
    <Card className={cn('', className)}>
      <CardContent className="flex flex-col items-center text-center py-12 px-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {config.description}
        </p>

        {config.action && config.actionHref && (
          <Button asChild>
            <Link href={config.actionHref} className="gap-2">
              {config.action}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}

        {config.showGenerateButton && onGenerate && (
          <Button onClick={onGenerate} size="lg" className="gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Weekly Analysis
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * A smaller inline empty state for specific sections
 */
interface InlineEmptyStateProps {
  message: string
  className?: string
}

export function InlineEmptyState({ message, className }: InlineEmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-8 px-4 text-center rounded-lg border border-dashed border-border',
      className
    )}>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
