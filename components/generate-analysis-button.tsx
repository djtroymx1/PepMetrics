'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GenerateAnalysisButtonProps {
  onGenerate: () => Promise<void>
  onSuccess?: () => void
  disabled?: boolean
  className?: string
  variant?: 'default' | 'compact'
}

type ButtonState = 'idle' | 'generating' | 'success' | 'error'

export function GenerateAnalysisButton({
  onGenerate,
  onSuccess,
  disabled = false,
  className,
  variant = 'default',
}: GenerateAnalysisButtonProps) {
  const [state, setState] = useState<ButtonState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleClick = async () => {
    if (state === 'generating' || disabled) return

    setState('generating')
    setErrorMessage(null)

    try {
      await onGenerate()
      setState('success')
      onSuccess?.()

      // Reset to idle after showing success
      setTimeout(() => {
        setState('idle')
      }, 2000)
    } catch (error) {
      setState('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate')

      // Reset to idle after showing error
      setTimeout(() => {
        setState('idle')
        setErrorMessage(null)
      }, 3000)
    }
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleClick}
        disabled={disabled || state === 'generating'}
        variant={state === 'error' ? 'destructive' : 'default'}
        size="sm"
        className={cn('gap-2', className)}
      >
        {state === 'generating' && (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Generating...
          </>
        )}
        {state === 'success' && (
          <>
            <CheckCircle className="h-4 w-4" />
            Done!
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="h-4 w-4" />
            Failed
          </>
        )}
        {state === 'idle' && (
          <>
            <Sparkles className="h-4 w-4" />
            Generate
          </>
        )}
      </Button>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Button
        onClick={handleClick}
        disabled={disabled || state === 'generating'}
        size="lg"
        className={cn(
          'w-full gap-2 h-12',
          state === 'error' && 'bg-red-600 hover:bg-red-700'
        )}
      >
        {state === 'generating' && (
          <>
            <RefreshCw className="h-5 w-5 animate-spin" />
            Analyzing your data...
          </>
        )}
        {state === 'success' && (
          <>
            <CheckCircle className="h-5 w-5" />
            Analysis Complete!
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="h-5 w-5" />
            Generation Failed
          </>
        )}
        {state === 'idle' && (
          <>
            <Sparkles className="h-5 w-5" />
            Generate Weekly Analysis
          </>
        )}
      </Button>

      {errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">
          {errorMessage}
        </p>
      )}

      {state === 'idle' && (
        <p className="text-xs text-muted-foreground text-center">
          Uses AI to analyze your protocols and health metrics
        </p>
      )}
    </div>
  )
}
