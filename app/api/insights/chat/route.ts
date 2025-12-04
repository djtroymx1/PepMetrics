import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { streamChatResponse } from '@/lib/anthropic'
import { aggregateChatContext } from '@/lib/analysis/data-aggregation'
import type { ChatMessage, ChatContext, WeeklyInsights, Insight } from '@/lib/types'

/**
 * POST /api/insights/chat
 *
 * Handle chat messages with streaming response.
 * Uses Claude to answer questions about user's peptide and health data.
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body = await request.json()
    const messages: ChatMessage[] = body.messages || []

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No messages provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Aggregate user context for the chat
    const contextData = await aggregateChatContext(user.id)

    // Fetch latest insights for additional context
    const { data: latestInsightsData } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
      .limit(1)
      .single()

    // Build chat context
    const context: ChatContext = {
      activeProtocols: contextData.activeProtocols,
      recentDoses: contextData.recentDoses,
      garminSummary: contextData.garminSummary,
      latestInsights: latestInsightsData ? {
        id: latestInsightsData.id,
        userId: latestInsightsData.user_id,
        weekStart: latestInsightsData.week_start,
        weekEnd: latestInsightsData.week_end,
        metricsSummary: latestInsightsData.metrics_summary || {},
        protocolSummary: latestInsightsData.protocol_summary || {},
        correlationData: latestInsightsData.correlation_data || [],
        insights: (latestInsightsData.insights || []) as Insight[],
        weeklySummary: latestInsightsData.weekly_summary || '',
        recommendations: latestInsightsData.recommendations || [],
        generatedAt: latestInsightsData.generated_at,
        modelVersion: latestInsightsData.model_version,
      } as WeeklyInsights : undefined,
    }

    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamChatResponse(messages, context, (chunk: string) => {
            // Send each chunk as a Server-Sent Event
            const data = JSON.stringify({ content: chunk })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          })

          // Send done event
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Chat stream error:', error)
          const errorData = JSON.stringify({ error: 'Stream error' })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Chat error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
