import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWeeklyInsights } from '@/lib/anthropic'
import { aggregateUserData } from '@/lib/analysis/data-aggregation'
import { validateDataSufficiency, getValidationMessages } from '@/lib/analysis/validation'

/**
 * POST /api/insights/generate
 *
 * Generate weekly AI insights for the authenticated user.
 * This aggregates user data, validates sufficiency, and calls Claude API.
 */
export async function POST() {
  try {
    // Authenticate user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use a rolling 7-day window ending today (spec calls for "last 7 days")
    const now = new Date()
    const analysisEnd = new Date(now)
    analysisEnd.setHours(0, 0, 0, 0)

    const analysisStart = new Date(analysisEnd)
    analysisStart.setDate(analysisEnd.getDate() - 6)

    const weekStartStr = analysisStart.toISOString().split('T')[0]
    const weekEndStr = analysisEnd.toISOString().split('T')[0]

    // Check if we already have insights for this window
    const { data: existingInsights } = await supabase
      .from('ai_insights')
      .select('id, generated_at')
      .eq('user_id', user.id)
      .eq('week_start', weekStartStr)
      .single()

    // If insights were generated less than 1 hour ago, return cached
    if (existingInsights) {
      const generatedAt = new Date(existingInsights.generated_at)
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)

      if (generatedAt > hourAgo) {
        return NextResponse.json({
          cached: true,
          message: 'Insights were recently generated. Returning cached results.',
          insightsId: existingInsights.id,
        })
      }
    }

    // Aggregate user data
    const userData = await aggregateUserData(user.id, weekStartStr, weekEndStr)

    // Validate data sufficiency
    const validation = validateDataSufficiency(userData)

    if (!validation.isValid) {
      const messages = getValidationMessages(validation)
      return NextResponse.json({
        error: 'Insufficient data',
        message: messages.description,
        missingData: messages.actionItems,
        stats: validation.stats,
      }, { status: 400 })
    }

    // Generate insights using Claude API
    const { response: insightsResponse, usage } = await generateWeeklyInsights(userData)

    // Store the insights
    const insightRecord = {
      user_id: user.id,
      week_start: weekStartStr,
      week_end: weekEndStr,
      metrics_summary: {
        garminDays: userData.garminData.length,
        baselineMetrics: userData.baselineMetrics,
      },
      protocol_summary: {
        activeProtocols: userData.activeProtocols,
        doseCount: userData.doseLogs.length,
      },
      correlation_data: userData.correlations,
      insights: insightsResponse.insights,
      weekly_summary: insightsResponse.weekly_summary,
      recommendations: insightsResponse.recommendations,
      generated_at: new Date().toISOString(),
      model_version: 'claude-sonnet-4-20250514',
      input_tokens: usage.inputTokens,
      output_tokens: usage.outputTokens,
    }

    // Upsert (update if exists, insert if not)
    const { data: savedInsights, error: saveError } = await supabase
      .from('ai_insights')
      .upsert(insightRecord, {
        onConflict: 'user_id,week_start',
      })
      .select()
      .single()

    if (saveError) {
      console.error('Failed to save insights:', saveError)
      // Still return the insights even if save failed
      return NextResponse.json({
        success: true,
        insights: insightsResponse,
        weekStart: weekStartStr,
        weekEnd: weekEndStr,
        usage,
        warning: 'Insights generated but failed to save to database',
      })
    }

    return NextResponse.json({
      success: true,
      insightsId: savedInsights.id,
      insights: insightsResponse,
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      usage,
      dataQuality: validation.dataQuality,
    })

  } catch (error) {
    console.error('Insights generation error:', error)

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service not configured. Please check API key.' },
          { status: 503 }
        )
      }

      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'AI service rate limited. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
