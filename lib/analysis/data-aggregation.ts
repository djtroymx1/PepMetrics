/**
 * Data Aggregation Module
 *
 * Fetches and aggregates user data from various sources for AI analysis.
 * This includes protocols, dose logs, and Garmin health metrics.
 */

import { createClient } from '@/lib/supabase/server'
import type {
  UserAnalysisData,
  ProtocolSummary,
  ProtocolChange,
  DoseLogEntry,
  GarminDailySummary,
  BaselineMetrics,
} from '@/lib/types'
import { calculateCorrelations } from './statistics'

/**
 * Aggregate all user data needed for AI analysis
 *
 * @param userId - User's UUID
 * @param weekStart - Start of the analysis week (YYYY-MM-DD)
 * @param weekEnd - End of the analysis week (YYYY-MM-DD)
 */
export async function aggregateUserData(
  userId: string,
  weekStart: string,
  weekEnd: string
): Promise<UserAnalysisData> {
  const supabase = await createClient()

  // Calculate baseline period (4 weeks before the analysis week)
  const weekStartDate = new Date(weekStart)
  const baselineStart = new Date(weekStartDate)
  baselineStart.setDate(baselineStart.getDate() - 28)
  const baselineEnd = new Date(weekStartDate)
  baselineEnd.setDate(baselineEnd.getDate() - 1)

  // Fetch all data in parallel
  const [
    activeProtocols,
    protocolChanges,
    doseLogs,
    garminData,
    baselineGarminData,
  ] = await Promise.all([
    fetchActiveProtocols(supabase, userId),
    fetchProtocolChanges(supabase, userId, weekStart),
    fetchDoseLogs(supabase, userId, weekStart, weekEnd),
    fetchGarminData(supabase, userId, weekStart, weekEnd),
    fetchGarminData(supabase, userId, baselineStart.toISOString().split('T')[0], baselineEnd.toISOString().split('T')[0]),
  ])

  // Calculate baseline metrics from the 4-week lookback
  const baselineMetrics = calculateBaselineMetrics(baselineGarminData)

  // Calculate correlations between dose logs and metrics
  const correlations = calculateCorrelations(doseLogs, garminData, baselineMetrics)

  return {
    activeProtocols,
    protocolChanges,
    doseLogs,
    garminData,
    baselineMetrics,
    correlations,
  }
}

/**
 * Fetch user's active protocols
 */
async function fetchActiveProtocols(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ProtocolSummary[]> {
  const { data, error } = await supabase
    .from('protocols')
    .select('id, name, peptides, start_date, frequency, status')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching protocols:', error)
    return []
  }

  // Treat anything not explicitly paused as active (handles case variants/nulls)
  return (data || [])
    .filter(protocol => (protocol.status || '').toLowerCase() !== 'paused')
    .map(protocol => ({
      id: protocol.id,
      name: protocol.name,
      peptides: protocol.peptides || [],
      startDate: protocol.start_date,
      frequency: protocol.frequency,
      status: protocol.status,
    }))
}

/**
 * Fetch protocol changes in the last 30 days
 */
async function fetchProtocolChanges(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  weekStart: string
): Promise<ProtocolChange[]> {
  // Calculate 30 days before week start
  const thirtyDaysAgo = new Date(weekStart)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from('protocols')
    .select('name, start_date, status, updated_at')
    .eq('user_id', userId)
    .gte('updated_at', thirtyDaysAgo.toISOString())

  if (error) {
    console.error('Error fetching protocol changes:', error)
    return []
  }

  // Transform to protocol changes
  const changes: ProtocolChange[] = []

  for (const protocol of data || []) {
    // Check if it was recently started
    const startDate = new Date(protocol.start_date)
    if (startDate >= thirtyDaysAgo) {
      changes.push({
        date: protocol.start_date,
        type: 'started',
        protocolName: protocol.name,
      })
    }

    // Check status changes
    if (protocol.status === 'paused') {
      changes.push({
        date: protocol.updated_at.split('T')[0],
        type: 'paused',
        protocolName: protocol.name,
      })
    }
  }

  return changes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Fetch dose logs for the analysis period
 */
async function fetchDoseLogs(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  weekStart: string,
  weekEnd: string
): Promise<DoseLogEntry[]> {
  const { data, error } = await supabase
    .from('dose_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('scheduled_for', weekStart)
    .lte('scheduled_for', weekEnd + 'T23:59:59')
    .order('scheduled_for', { ascending: true })

  if (error) {
    console.error('Error fetching dose logs:', error)
    return []
  }

  return (data || []).map(log => ({
    date: log.scheduled_for.split('T')[0],
    peptideName: log.peptide_name,
    dose: log.dose,
    status: log.status as 'taken' | 'skipped' | 'pending' | 'overdue',
    takenAt: log.taken_at,
    scheduledFor: log.scheduled_for,
    notes: log.notes,
  }))
}

/**
 * Fetch Garmin data for a date range
 */
async function fetchGarminData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  startDate: string,
  endDate: string
): Promise<GarminDailySummary[]> {
  const { data, error } = await supabase
    .from('garmin_data')
    .select('*')
    .eq('user_id', userId)
    .gte('data_date', startDate)
    .lte('data_date', endDate)
    .order('data_date', { ascending: true })

  if (error) {
    console.error('Error fetching Garmin data:', error)
    return []
  }

  return (data || []).map(day => ({
    date: day.data_date,
    sleep_score: day.sleep?.score || undefined,
    sleep_duration_hours: day.sleep?.duration_hours || undefined,
    deep_sleep_hours: day.sleep?.deep_hours || undefined,
    light_sleep_hours: day.sleep?.light_hours || undefined,
    rem_sleep_hours: day.sleep?.rem_hours || undefined,
    awake_hours: day.sleep?.awake_hours || undefined,
    hrv_avg: day.hrv_avg || undefined,
    resting_hr: day.resting_heart_rate || undefined,
    stress_avg: day.stress_avg || undefined,
    body_battery_high: day.body_battery_high || undefined,
    body_battery_low: day.body_battery_low || undefined,
    steps: day.steps || undefined,
    active_minutes: day.active_minutes || undefined,
    calories_total: day.calories_total || undefined,
    calories_active: day.calories_active || undefined,
    distance_meters: day.distance_meters || undefined,
  }))
}

/**
 * Calculate baseline metrics from historical Garmin data
 */
function calculateBaselineMetrics(garminData: GarminDailySummary[]): BaselineMetrics {
  if (garminData.length === 0) {
    return {
      hrv_avg: 0,
      hrv_std: 0,
      resting_hr_avg: 0,
      sleep_score_avg: 0,
      deep_sleep_avg: 0,
      stress_avg: 0,
      body_battery_avg: 0,
      steps_avg: 0,
    }
  }

  // Helper to calculate average, filtering out undefined values
  const avg = (values: (number | undefined)[]): number => {
    const valid = values.filter((v): v is number => v !== undefined)
    if (valid.length === 0) return 0
    return valid.reduce((sum, v) => sum + v, 0) / valid.length
  }

  // Helper to calculate standard deviation
  const std = (values: (number | undefined)[]): number => {
    const valid = values.filter((v): v is number => v !== undefined)
    if (valid.length < 2) return 0
    const mean = avg(valid)
    const squaredDiffs = valid.map(v => Math.pow(v - mean, 2))
    return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / valid.length)
  }

  const hrvValues = garminData.map(d => d.hrv_avg)

  return {
    hrv_avg: Math.round(avg(hrvValues) * 10) / 10,
    hrv_std: Math.round(std(hrvValues) * 10) / 10,
    resting_hr_avg: Math.round(avg(garminData.map(d => d.resting_hr)) * 10) / 10,
    sleep_score_avg: Math.round(avg(garminData.map(d => d.sleep_score)) * 10) / 10,
    deep_sleep_avg: Math.round(avg(garminData.map(d => d.deep_sleep_hours)) * 100) / 100,
    stress_avg: Math.round(avg(garminData.map(d => d.stress_avg)) * 10) / 10,
    body_battery_avg: Math.round(avg(garminData.map(d => d.body_battery_high)) * 10) / 10,
    steps_avg: Math.round(avg(garminData.map(d => d.steps))),
  }
}

/**
 * Aggregate chat context data for the chat interface
 */
export async function aggregateChatContext(userId: string): Promise<{
  activeProtocols: ProtocolSummary[]
  recentDoses: DoseLogEntry[]
  garminSummary: GarminDailySummary[]
}> {
  const supabase = await createClient()

  // Get last 7 days
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const weekStart = weekAgo.toISOString().split('T')[0]
  const weekEnd = now.toISOString().split('T')[0]

  const [activeProtocols, recentDoses, garminSummary] = await Promise.all([
    fetchActiveProtocols(supabase, userId),
    fetchDoseLogs(supabase, userId, weekStart, weekEnd),
    fetchGarminData(supabase, userId, weekStart, weekEnd),
  ])

  return {
    activeProtocols,
    recentDoses,
    garminSummary,
  }
}
