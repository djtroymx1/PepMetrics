import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface DoseLogInput {
  id?: string
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
 * GET /api/dose-logs
 *
 * Fetch dose logs for the authenticated user.
 * Supports date range filtering via query params.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    let query = supabase
      .from('dose_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('scheduled_for', { ascending: false })
      .limit(limit)

    if (startDate) {
      query = query.gte('scheduled_for', startDate)
    }
    if (endDate) {
      query = query.lte('scheduled_for', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching dose logs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch dose logs' },
        { status: 500 }
      )
    }

    // Transform snake_case to camelCase for client
    const transformedLogs = data.map(log => ({
      id: log.id,
      odId: log.id, // Use same ID for compatibility
      protocolId: log.protocol_id,
      peptideName: log.peptide_name,
      dose: log.dose,
      doseNumber: log.dose_number,
      scheduledFor: log.scheduled_for,
      takenAt: log.taken_at,
      status: log.status,
      notes: log.notes,
    }))

    return NextResponse.json({ logs: transformedLogs })
  } catch (error) {
    console.error('Dose logs GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dose-logs
 *
 * Create or update a dose log entry.
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

    const body = await request.json() as DoseLogInput

    // Validate required fields
    if (!body.protocolId || !body.peptideName || !body.dose || !body.scheduledFor || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if log already exists (for upsert)
    const { data: existingLog } = await supabase
      .from('dose_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('protocol_id', body.protocolId)
      .eq('scheduled_for', body.scheduledFor)
      .eq('dose_number', body.doseNumber || 1)
      .single()

    const logData = {
      user_id: user.id,
      protocol_id: body.protocolId,
      peptide_name: body.peptideName,
      dose: body.dose,
      dose_number: body.doseNumber || 1,
      scheduled_for: body.scheduledFor,
      taken_at: body.takenAt || null,
      status: body.status,
      notes: body.notes || null,
    }

    let result
    if (existingLog) {
      // Update existing
      const { data, error } = await supabase
        .from('dose_logs')
        .update(logData)
        .eq('id', existingLog.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('dose_logs')
        .insert(logData)
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({
      success: true,
      log: {
        id: result.id,
        odId: result.id,
        protocolId: result.protocol_id,
        peptideName: result.peptide_name,
        dose: result.dose,
        doseNumber: result.dose_number,
        scheduledFor: result.scheduled_for,
        takenAt: result.taken_at,
        status: result.status,
        notes: result.notes,
      }
    })
  } catch (error) {
    console.error('Dose logs POST error:', error)
    return NextResponse.json(
      { error: 'Failed to save dose log' },
      { status: 500 }
    )
  }
}
