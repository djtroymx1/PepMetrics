import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface LocalStorageDoseLog {
  id: string
  odId: string
  protocolId: string
  peptideName: string
  dose: string
  doseNumber?: number
  scheduledFor: string
  takenAt?: string
  status: 'pending' | 'taken' | 'skipped' | 'overdue'
  notes?: string
}

/**
 * POST /api/dose-logs/sync
 *
 * Sync dose logs from localStorage to Supabase.
 * This is a one-time migration endpoint for existing users.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json() as { logs: LocalStorageDoseLog[] }

    if (!body.logs || !Array.isArray(body.logs)) {
      return NextResponse.json(
        { error: 'Invalid request body - expected { logs: DoseLog[] }' },
        { status: 400 }
      )
    }

    if (body.logs.length === 0) {
      return NextResponse.json({
        success: true,
        synced: 0,
        skipped: 0,
        message: 'No logs to sync'
      })
    }

    // Prepare logs for insertion
    const logsToInsert = body.logs.map(log => ({
      user_id: user.id,
      protocol_id: log.protocolId,
      peptide_name: log.peptideName,
      dose: log.dose,
      dose_number: log.doseNumber || 1,
      scheduled_for: log.scheduledFor,
      taken_at: log.takenAt || null,
      status: log.status,
      notes: log.notes || null,
    }))

    // Get existing logs to avoid duplicates
    const { data: existingLogs } = await supabase
      .from('dose_logs')
      .select('protocol_id, scheduled_for, dose_number')
      .eq('user_id', user.id)

    // Create a set of existing log keys for fast lookup
    const existingKeys = new Set(
      (existingLogs || []).map(log =>
        `${log.protocol_id}|${log.scheduled_for}|${log.dose_number}`
      )
    )

    // Filter out duplicates
    const newLogs = logsToInsert.filter(log =>
      !existingKeys.has(`${log.protocol_id}|${log.scheduled_for}|${log.dose_number}`)
    )

    if (newLogs.length === 0) {
      return NextResponse.json({
        success: true,
        synced: 0,
        skipped: logsToInsert.length,
        message: 'All logs already synced'
      })
    }

    // Insert new logs in batches
    const BATCH_SIZE = 100
    let syncedCount = 0

    for (let i = 0; i < newLogs.length; i += BATCH_SIZE) {
      const batch = newLogs.slice(i, i + BATCH_SIZE)
      const { error } = await supabase
        .from('dose_logs')
        .insert(batch)

      if (error) {
        console.error('Batch insert error:', error)
        // Continue with remaining batches
      } else {
        syncedCount += batch.length
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      skipped: logsToInsert.length - newLogs.length,
      total: body.logs.length,
      message: `Synced ${syncedCount} logs, skipped ${logsToInsert.length - newLogs.length} duplicates`
    })
  } catch (error) {
    console.error('Dose logs sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync dose logs' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/dose-logs/sync
 *
 * Check sync status - whether user has synced their localStorage data.
 */
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

    // Count user's logs in Supabase
    const { count, error } = await supabase
      .from('dose_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error checking sync status:', error)
      return NextResponse.json(
        { error: 'Failed to check sync status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      hasSyncedData: (count || 0) > 0,
      logCount: count || 0
    })
  } catch (error) {
    console.error('Sync status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
