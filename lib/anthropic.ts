/**
 * Anthropic Claude API Client
 *
 * This module provides the Claude API integration for generating
 * AI-powered insights from user health and protocol data.
 */

import Anthropic from '@anthropic-ai/sdk'
import type {
  UserAnalysisData,
  WeeklyInsightsResponse,
  Insight,
  ChatMessage,
  ChatContext,
} from '@/lib/types'

// Initialize Anthropic client
const apiKey = process.env.ANTHROPIC_API_KEY

if (!apiKey) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable')
}

const anthropic = new Anthropic({ apiKey })

// Model configuration
const WEEKLY_ANALYSIS_MODEL = 'claude-sonnet-4-20250514'
const CHAT_MODEL = 'claude-haiku-4-5-20251001' // Cost-effective chat model per spec

// Token limits
const WEEKLY_ANALYSIS_MAX_TOKENS = 2000
const CHAT_MAX_TOKENS = 1000

/**
 * System prompt for weekly analysis
 * Guides Claude to analyze peptide dosing data alongside health metrics
 */
const WEEKLY_ANALYSIS_SYSTEM_PROMPT = `You are the AI insights engine for PepMetrics, a peptide protocol tracking application. Your role is to analyze peptide dosing data alongside health metrics from Garmin wearables to help users understand how their protocols may be affecting their bodies.

CORE PRINCIPLES:
1. NEVER claim causation - only note correlations and possibilities
2. Frame all insights as observations, not medical advice
3. Be specific with numbers, percentages, and timeframes
4. Highlight both positive trends and potential concerns equally
5. Use plain language, but include technical metrics for users who want depth
6. If data is insufficient for a conclusion, say so clearly
7. Err on the side of caution with health-related observations

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "insights": [
    {
      "type": "correlation" | "timing" | "compliance" | "anomaly" | "trend",
      "severity": "info" | "notable" | "alert",
      "title": "Short descriptive title",
      "body": "Full insight explanation (2-4 sentences)",
      "metrics": ["list", "of", "relevant", "metrics"],
      "confidence": "possible" | "likely" | "strong",
      "data_points": { "relevant": "numbers" }
    }
  ],
  "weekly_summary": "2-3 paragraph prose summary of the week",
  "recommendations": ["actionable", "suggestions"]
}

Aim for 3-5 insights per analysis, mixing types. Prioritize notable and alert severity items.`

/**
 * System prompt for chat interface
 * Provides a conversational assistant for users to ask questions about their data
 */
const CHAT_SYSTEM_PROMPT = `You are a helpful assistant for PepMetrics users. You have access to their peptide protocol data and Garmin health metrics. Answer their questions about their data in a friendly, informative way.

GUIDELINES:
- Reference specific numbers and dates from their data when relevant
- If the data doesn't support a clear answer, say so
- Never give medical advice - you're a data assistant, not a doctor
- Keep responses concise but complete
- If asked about something outside their data, politely redirect

You have access to the user's context which will be provided with each message.`

/**
 * Build the analysis prompt with user data
 */
function buildAnalysisPrompt(data: UserAnalysisData): string {
  return `USER'S ACTIVE PROTOCOLS:
${JSON.stringify(data.activeProtocols, null, 2)}

RECENT PROTOCOL CHANGES (last 30 days):
${JSON.stringify(data.protocolChanges, null, 2)}

DOSE LOGS (past 7 days):
${JSON.stringify(data.doseLogs, null, 2)}

GARMIN METRICS (past 7 days):
${JSON.stringify(data.garminData, null, 2)}

BASELINE AVERAGES (previous 4 weeks):
${JSON.stringify(data.baselineMetrics, null, 2)}

PRE-COMPUTED CORRELATIONS:
${JSON.stringify(data.correlations, null, 2)}

Analyze this data and provide insights following your system prompt guidelines. Return only valid JSON.`
}

/**
 * Build the chat context prompt
 */
function buildChatContextPrompt(context: ChatContext): string {
  return `USER'S CURRENT CONTEXT:

Active Protocols:
${JSON.stringify(context.activeProtocols, null, 2)}

Recent Doses (last 7 days):
${JSON.stringify(context.recentDoses, null, 2)}

Garmin Health Summary (last 7 days):
${JSON.stringify(context.garminSummary, null, 2)}

${context.latestInsights ? `Latest AI Insights:
${context.latestInsights.weeklySummary}` : ''}`
}

/**
 * Parse the insights response from Claude
 */
function parseInsightsResponse(responseText: string): WeeklyInsightsResponse {
  try {
    // Try to extract JSON from the response
    // Claude might wrap it in markdown code blocks
    let jsonStr = responseText

    // Remove markdown code blocks if present
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1]
    }

    const parsed = JSON.parse(jsonStr.trim())

    // Validate the structure
    if (!parsed.insights || !Array.isArray(parsed.insights)) {
      throw new Error('Invalid response structure: missing insights array')
    }

    // Validate each insight
    const validatedInsights: Insight[] = parsed.insights.map((insight: Partial<Insight>) => ({
      type: insight.type || 'trend',
      severity: insight.severity || 'info',
      title: insight.title || 'Insight',
      body: insight.body || '',
      metrics: insight.metrics || [],
      confidence: insight.confidence || 'possible',
      data_points: insight.data_points || {},
    }))

    return {
      insights: validatedInsights,
      weekly_summary: parsed.weekly_summary || '',
      recommendations: parsed.recommendations || [],
    }
  } catch (error) {
    console.error('Failed to parse insights response:', error)
    console.error('Raw response:', responseText)

    // Return a fallback response
    return {
      insights: [{
        type: 'trend',
        severity: 'info',
        title: 'Analysis Complete',
        body: 'We analyzed your data but encountered an issue formatting the detailed insights. Please try again or contact support if this persists.',
        metrics: [],
        confidence: 'possible',
        data_points: {},
      }],
      weekly_summary: 'Unable to generate detailed summary. Please try regenerating.',
      recommendations: ['Try regenerating insights', 'Ensure you have at least 7 days of data'],
    }
  }
}

/**
 * Generate weekly insights from user data
 *
 * @param userData - Aggregated user data for analysis
 * @returns WeeklyInsightsResponse with insights, summary, and recommendations
 */
export async function generateWeeklyInsights(
  userData: UserAnalysisData
): Promise<{ response: WeeklyInsightsResponse; usage: { inputTokens: number; outputTokens: number } }> {
  const response = await anthropic.messages.create({
    model: WEEKLY_ANALYSIS_MODEL,
    max_tokens: WEEKLY_ANALYSIS_MAX_TOKENS,
    system: WEEKLY_ANALYSIS_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildAnalysisPrompt(userData),
      },
    ],
  })

  // Extract text content from response
  const textContent = response.content.find(block => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude')
  }

  const parsedResponse = parseInsightsResponse(textContent.text)

  return {
    response: parsedResponse,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  }
}

/**
 * Generate a chat response based on user message and context
 *
 * @param messages - Conversation history
 * @param context - User's data context
 * @returns Assistant's response message
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  context: ChatContext
): Promise<{ response: string; usage: { inputTokens: number; outputTokens: number } }> {
  // Build the context-enriched system prompt
  const systemPrompt = `${CHAT_SYSTEM_PROMPT}

${buildChatContextPrompt(context)}`

  // Convert our messages to Anthropic format
  const anthropicMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  const response = await anthropic.messages.create({
    model: CHAT_MODEL,
    max_tokens: CHAT_MAX_TOKENS,
    system: systemPrompt,
    messages: anthropicMessages,
  })

  // Extract text content
  const textContent = response.content.find(block => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude')
  }

  return {
    response: textContent.text,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  }
}

/**
 * Stream a chat response for real-time display
 *
 * @param messages - Conversation history
 * @param context - User's data context
 * @param onChunk - Callback for each text chunk
 */
export async function streamChatResponse(
  messages: ChatMessage[],
  context: ChatContext,
  onChunk: (chunk: string) => void
): Promise<{ usage: { inputTokens: number; outputTokens: number } }> {
  // Build the context-enriched system prompt
  const systemPrompt = `${CHAT_SYSTEM_PROMPT}

${buildChatContextPrompt(context)}`

  // Convert our messages to Anthropic format
  const anthropicMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  const stream = anthropic.messages.stream({
    model: CHAT_MODEL,
    max_tokens: CHAT_MAX_TOKENS,
    system: systemPrompt,
    messages: anthropicMessages,
  })

  let inputTokens = 0
  let outputTokens = 0

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      onChunk(event.delta.text)
    }
    if (event.type === 'message_delta' && event.usage) {
      outputTokens = event.usage.output_tokens
    }
    if (event.type === 'message_start' && event.message.usage) {
      inputTokens = event.message.usage.input_tokens
    }
  }

  return {
    usage: {
      inputTokens,
      outputTokens,
    },
  }
}

/**
 * Check if the Anthropic API is configured and accessible
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    // Make a minimal API call to verify connection
    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }],
    })
    return response.content.length > 0
  } catch (error) {
    console.error('Anthropic API connection check failed:', error)
    return false
  }
}
