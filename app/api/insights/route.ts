import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { WeeklyInsights, Insight } from '@/lib/types'

/**
 * GET /api/insights
 *
 * Fetch user's AI insights history.
 * Supports pagination and filtering by date.
 */
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const rawLimit = Number.parseInt(searchParams.get('limit') || '10', 10)
    const rawOffset = Number.parseInt(searchParams.get('offset') || '0', 10)

    const limit = Math.min(Math.max(rawLimit || 10, 1), 100)
    const offset = Math.max(rawOffset || 0, 0)
    const weekStart = searchParams.get('week_start')

    // Build query
    let query = supabase
      .from('ai_insights')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by specific week if provided
    if (weekStart) {
      query = query.eq('week_start', weekStart)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching insights:', error)
      return NextResponse.json(
        { error: 'Failed to fetch insights' },
        { status: 500 }
      )
    }

    // Transform to frontend format
    const insights: WeeklyInsights[] = (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      weekStart: row.week_start,
      weekEnd: row.week_end,
      metricsSummary: row.metrics_summary || {},
      protocolSummary: row.protocol_summary || {},
      correlationData: row.correlation_data || [],
      insights: (row.insights || []) as Insight[],
      weeklySummary: row.weekly_summary || '',
      recommendations: row.recommendations || [],
      generatedAt: row.generated_at,
      modelVersion: row.model_version,
      inputTokens: row.input_tokens,
      outputTokens: row.output_tokens,
    }))

    // Get the most recent insights separately for quick access
    const latestInsights = insights.length > 0 ? insights[0] : null

    return NextResponse.json({
      insights,
      latest: latestInsights,
      pagination: {
        limit,
        offset,
        total: count ?? insights.length,
        hasMore: offset + insights.length < (count ?? offset + insights.length),
      },
    })

  } catch (error) {
    console.error('Insights fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/insights?id=<uuid>
 *
 * Delete a specific insight (for user data cleanup)
 */
export async function DELETE(request: NextRequest) {
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

    // Get insight ID from query params
    const { searchParams } = new URL(request.url)
    const insightId = searchParams.get('id')

    if (!insightId) {
      return NextResponse.json(
        { error: 'Missing insight ID' },
        { status: 400 }
      )
    }

    // Delete the insight (RLS ensures user can only delete their own)
    const { error } = await supabase
      .from('ai_insights')
      .delete()
      .eq('id', insightId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting insight:', error)
      return NextResponse.json(
        { error: 'Failed to delete insight' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Insight delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
