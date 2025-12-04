import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  parseGarminActivityCSV,
  isGarminActivityCSV,
  parseGarminExportFile,
  processGarminExport,
  dailyDataToArray,
  parseGarminExportZip,
} from '@/lib/parsers'
import type { GarminImportResult, ParsedGarminActivity, GarminDailySummary } from '@/lib/types'

const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB for ZIP files

// For Vercel: Configure max duration for large file processing
export const maxDuration = 60 // 60 seconds

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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 200MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const fileName = file.name.toLowerCase()
    const isCsv = fileName.endsWith('.csv')
    const isJson = fileName.endsWith('.json')
    const isZip = fileName.endsWith('.zip') ||
                  file.type === 'application/zip' ||
                  file.type === 'application/x-zip-compressed'

    if (!isCsv && !isJson && !isZip) {
      return NextResponse.json(
        { error: 'Only ZIP (recommended), CSV (activities), or JSON (full export) files are supported' },
        { status: 400 }
      )
    }

    // === ZIP FULL EXPORT (recommended method) ===
    if (isZip) {
      // Get targetDays from form data if provided, default to 90
      const targetDaysStr = formData.get('targetDays') as string | null
      const targetDays = targetDaysStr ? parseInt(targetDaysStr, 10) : 90

      // Parse the ZIP file directly
      const zipResult = await parseGarminExportZip(file, targetDays)

      if (!zipResult.success || zipResult.dailyData.size === 0) {
        return NextResponse.json(
          {
            error: 'Unable to parse Garmin ZIP export',
            details: zipResult.errors.slice(0, 5),
            scanResult: {
              totalFiles: zipResult.scanResult.totalFiles,
              relevantFiles: zipResult.scanResult.relevantFiles,
              skippedFiles: zipResult.scanResult.skippedFiles,
            },
          },
          { status: 400 }
        )
      }

      // Convert to array and insert into database
      const dailyArray = dailyDataToArray(zipResult.dailyData)
      await upsertGarminDailyData(supabase, user.id, dailyArray)

      // Record the import
      const { error: importRecordError } = await supabase
        .from('garmin_imports')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_type: 'zip_export',
          records_imported: dailyArray.length,
          records_skipped: zipResult.scanResult.skippedFiles,
          records_updated: 0,
          date_range_start: zipResult.summary.dateRange?.start || null,
          date_range_end: zipResult.summary.dateRange?.end || null,
          status: 'completed',
          error_message: zipResult.errors.length > 0 ? zipResult.errors.slice(0, 5).join('; ') : null,
        })

      if (importRecordError) {
        console.error('Failed to record ZIP import:', importRecordError)
      }

      return NextResponse.json({
        success: true,
        recordsImported: dailyArray.length,
        recordsSkipped: zipResult.scanResult.skippedFiles,
        recordsUpdated: 0,
        dateRange: zipResult.summary.dateRange,
        dataTypes: zipResult.summary.dataTypes,
        errors: zipResult.errors.slice(0, 5),
        scanResult: {
          totalFiles: zipResult.scanResult.totalFiles,
          relevantFiles: zipResult.scanResult.relevantFiles,
          skippedFiles: zipResult.scanResult.skippedFiles,
          dataTypes: zipResult.scanResult.dataTypes,
        },
      })
    }

    // Read file content for CSV/JSON
    const content = await file.text()

    // === CSV ACTIVITY IMPORT ===
    if (isCsv) {
      // Validate it's a Garmin CSV
      if (!isGarminActivityCSV(content)) {
        return NextResponse.json(
          { error: 'This file does not appear to be a Garmin activity export. Please export activities from connect.garmin.com.' },
          { status: 400 }
        )
      }

      const parseResult = parseGarminActivityCSV(content)

      if (!parseResult.success) {
        return NextResponse.json(
          {
            error: 'Failed to parse CSV file',
            details: parseResult.errors.slice(0, 5), // Return first 5 errors
          },
          { status: 400 }
        )
      }

      // Insert/update activities in database
      let recordsImported = 0
      let recordsSkipped = 0
      let recordsUpdated = 0
      const errors: string[] = []

      for (const activity of parseResult.activities) {
        try {
          const { data: existing } = await supabase
            .from('garmin_activities')
            .select('id')
            .eq('user_id', user.id)
            .eq('start_time', activity.start_time)
            .single()

          if (existing) {
            const { error: updateError } = await supabase
              .from('garmin_activities')
              .update({
                activity_type: activity.activity_type,
                activity_name: activity.activity_name,
                duration_seconds: activity.duration_seconds,
                distance_meters: activity.distance_meters,
                calories: activity.calories,
                avg_heart_rate: activity.avg_heart_rate,
                max_heart_rate: activity.max_heart_rate,
                avg_speed_mps: activity.avg_speed_mps,
                elevation_gain_meters: activity.elevation_gain_meters,
                raw_data: activity.raw_data,
                synced_at: new Date().toISOString(),
              })
              .eq('id', existing.id)

            if (updateError) {
              errors.push(`Failed to update activity: ${updateError.message}`)
              recordsSkipped++
            } else {
              recordsUpdated++
            }
          } else {
            const { error: insertError } = await supabase
              .from('garmin_activities')
              .insert({
                user_id: user.id,
                activity_type: activity.activity_type,
                activity_name: activity.activity_name,
                start_time: activity.start_time,
                duration_seconds: activity.duration_seconds,
                distance_meters: activity.distance_meters,
                calories: activity.calories,
                avg_heart_rate: activity.avg_heart_rate,
                max_heart_rate: activity.max_heart_rate,
                avg_speed_mps: activity.avg_speed_mps,
                elevation_gain_meters: activity.elevation_gain_meters,
                raw_data: activity.raw_data,
                synced_at: new Date().toISOString(),
              })

            if (insertError) {
              errors.push(`Failed to insert activity: ${insertError.message}`)
              recordsSkipped++
            } else {
              recordsImported++
            }
          }
        } catch (err) {
          errors.push(`Error processing activity: ${err instanceof Error ? err.message : 'Unknown error'}`)
          recordsSkipped++
        }
      }

      // Aggregate activities into daily summaries for analysis
      const dailySummaries = summarizeActivities(parseResult.activities)
      await upsertGarminDailyData(supabase, user.id, dailySummaries)

      // Record the import in garmin_imports table
      const { error: importRecordError } = await supabase
        .from('garmin_imports')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_type: 'activity_csv',
          records_imported: recordsImported,
          records_skipped: recordsSkipped,
          records_updated: recordsUpdated,
          date_range_start: parseResult.summary.dateRange?.start.toISOString().split('T')[0],
          date_range_end: parseResult.summary.dateRange?.end.toISOString().split('T')[0],
          status: 'completed',
          error_message: errors.length > 0 ? errors.slice(0, 5).join('; ') : null,
        })

      if (importRecordError) {
        console.error('Failed to record import:', importRecordError)
      }

      const result: GarminImportResult = {
        success: true,
        recordsImported,
        recordsSkipped,
        recordsUpdated,
        dateRange: parseResult.summary.dateRange
          ? {
              start: parseResult.summary.dateRange.start.toISOString().split('T')[0],
              end: parseResult.summary.dateRange.end.toISOString().split('T')[0],
            }
          : null,
        errors: errors.slice(0, 5),
      }

      return NextResponse.json(result)
    }

    // === JSON FULL EXPORT (sleep/HRV/stress/body battery) ===
    const exportFile = parseGarminExportFile(file.name, content)
    const processed = processGarminExport([exportFile])
    const dailyArray = dailyDataToArray(processed.dailyData)

    if (!processed.success || dailyArray.length === 0) {
      return NextResponse.json(
        { error: 'Unable to parse Garmin JSON export', details: processed.errors.slice(0, 5) },
        { status: 400 }
      )
    }

    await upsertGarminDailyData(supabase, user.id, dailyArray)

    const jsonDateRange = processed.summary.dateRange

    const { error: importRecordError } = await supabase
      .from('garmin_imports')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: 'full_export',
        records_imported: dailyArray.length,
        records_skipped: 0,
        records_updated: 0,
        date_range_start: jsonDateRange?.start || null,
        date_range_end: jsonDateRange?.end || null,
        status: 'completed',
        error_message: processed.errors.length > 0 ? processed.errors.slice(0, 5).join('; ') : null,
      })

    if (importRecordError) {
      console.error('Failed to record JSON import:', importRecordError)
    }

    return NextResponse.json({
      success: true,
      recordsImported: dailyArray.length,
      recordsSkipped: 0,
      recordsUpdated: 0,
      dateRange: jsonDateRange,
      errors: processed.errors.slice(0, 5),
    })

  } catch (error) {
    console.error('Garmin import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch import history
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: imports, error } = await supabase
      .from('garmin_imports')
      .select('*')
      .eq('user_id', user.id)
      .order('import_date', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch import history' },
        { status: 500 }
      )
    }

    // Get latest data range from garmin_activities
    const { data: activityRange } = await supabase
      .from('garmin_activities')
      .select('start_time')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true })
      .limit(1)
      .single()

    const { data: latestActivity } = await supabase
      .from('garmin_activities')
      .select('start_time')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .limit(1)
      .single()

    const { count: activityCount } = await supabase
      .from('garmin_activities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    return NextResponse.json({
      imports,
      activityStats: {
        totalActivities: activityCount || 0,
        dateRange: activityRange && latestActivity
          ? {
              start: activityRange.start_time.split('T')[0],
              end: latestActivity.start_time.split('T')[0],
            }
          : null,
      },
    })

  } catch (error) {
    console.error('Garmin import history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Convert a list of activities to per-day summaries compatible with garmin_data
 */
function summarizeActivities(activities: ParsedGarminActivity[]): GarminDailySummary[] {
  const byDate: Record<string, GarminDailySummary> = {}

  for (const activity of activities) {
    const date = activity.start_time.split('T')[0]
    if (!byDate[date]) {
      byDate[date] = {
        date,
        steps: undefined, // activity CSV does not include steps
        distance_meters: 0,
        calories_total: 0,
        calories_active: 0,
        active_minutes: 0,
        sleep_score: undefined,
        hrv_avg: undefined,
        resting_hr: undefined,
        stress_avg: undefined,
        body_battery_high: undefined,
        body_battery_low: undefined,
      }
    }

    const entry = byDate[date]

    if (typeof activity.distance_meters === 'number') {
      entry.distance_meters = (entry.distance_meters || 0) + activity.distance_meters
    }

    if (typeof activity.calories === 'number') {
      entry.calories_total = (entry.calories_total || 0) + activity.calories
      entry.calories_active = (entry.calories_active || 0) + activity.calories
    }

    if (typeof activity.duration_seconds === 'number') {
      entry.active_minutes = (entry.active_minutes || 0) + Math.round(activity.duration_seconds / 60)
    }
  }

  return Object.values(byDate)
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
