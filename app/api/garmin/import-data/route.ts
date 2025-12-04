import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { GarminDailySummary } from '@/lib/types'

/**
 * API endpoint for receiving pre-processed Garmin data
 *
 * This endpoint receives daily summaries that have already been parsed
 * from a ZIP file on the client side. This approach avoids Vercel's
 * request body size limits by processing the large ZIP locally.
 */

interface ImportDataRequest {
  fileName: string
  fileType: string
  dailySummaries: GarminDailySummary[]
  dateRange: { start: string; end: string } | null
  dataTypes: string[]
  scanResult: {
    totalFiles: number
    relevantFiles: number
    skippedFiles: number
    dataTypes: string[]
  }
}

export async function POST(request: NextRequest) {
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

    // Parse JSON body
    const body: ImportDataRequest = await request.json()

    if (!body.dailySummaries || !Array.isArray(body.dailySummaries)) {
      return NextResponse.json(
        { error: 'Invalid request: dailySummaries array required' },
        { status: 400 }
      )
    }

    if (body.dailySummaries.length === 0) {
      return NextResponse.json(
        { error: 'No data to import' },
        { status: 400 }
      )
    }

    // Upsert the daily data
    await upsertGarminDailyData(supabase, user.id, body.dailySummaries)

    // Record the import
    const { error: importRecordError } = await supabase
      .from('garmin_imports')
      .insert({
        user_id: user.id,
        file_name: body.fileName,
        file_type: body.fileType,
        records_imported: body.dailySummaries.length,
        records_skipped: body.scanResult?.skippedFiles || 0,
        records_updated: 0,
        date_range_start: body.dateRange?.start || null,
        date_range_end: body.dateRange?.end || null,
        status: 'completed',
        error_message: null,
      })

    if (importRecordError) {
      console.error('Failed to record import:', importRecordError)
    }

    return NextResponse.json({
      success: true,
      recordsImported: body.dailySummaries.length,
      recordsSkipped: body.scanResult?.skippedFiles || 0,
      recordsUpdated: 0,
      dateRange: body.dateRange,
      dataTypes: body.dataTypes,
      scanResult: body.scanResult,
    })

  } catch (error) {
    console.error('Garmin import-data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Upsert daily summaries into garmin_data
 */
async function upsertGarminDailyData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  dailySummaries: GarminDailySummary[],
) {
  if (dailySummaries.length === 0) return

  const rows = dailySummaries.map((day) => {
    const row: Record<string, unknown> = {
      user_id: userId,
      data_date: day.date,
      synced_at: new Date().toISOString(),
    }

    if (day.sleep_score !== undefined) {
      row.sleep = {
        score: day.sleep_score,
        duration_hours: day.sleep_duration_hours,
        deep_hours: day.deep_sleep_hours,
        light_hours: day.light_sleep_hours,
        rem_hours: day.rem_sleep_hours,
        awake_hours: day.awake_hours,
      }
    }

    if (day.hrv_avg !== undefined) row.hrv_avg = day.hrv_avg
    if (day.resting_hr !== undefined) row.resting_heart_rate = day.resting_hr
    if (day.stress_avg !== undefined) row.stress_avg = day.stress_avg
    if (day.body_battery_high !== undefined) row.body_battery_high = day.body_battery_high
    if (day.body_battery_low !== undefined) row.body_battery_low = day.body_battery_low
    if (day.steps !== undefined) row.steps = day.steps
    if (day.active_minutes !== undefined) row.active_minutes = day.active_minutes
    if (day.calories_total !== undefined) row.calories_total = day.calories_total
    if (day.calories_active !== undefined) row.calories_active = day.calories_active
    if (day.distance_meters !== undefined) row.distance_meters = day.distance_meters

    return row
  })

  const { error } = await supabase
    .from('garmin_data')
    .upsert(rows, { onConflict: 'user_id,data_date' })

  if (error) {
    console.error('Failed to upsert garmin_data:', error)
    throw error
  }
}
