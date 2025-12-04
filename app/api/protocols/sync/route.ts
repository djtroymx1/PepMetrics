import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPeptideById } from '@/lib/peptides'

interface LocalStorageProtocol {
  id: string
  odId: string
  peptideId: string
  customPeptideName?: string
  dose: string
  vialSize?: number
  frequencyType: 'daily' | 'specific-days' | 'interval' | 'cycling'
  specificDays?: string[]
  intervalDays?: number
  cycleOnDays?: number
  cycleOffDays?: number
  cycleStartDate?: string
  timingPreference: string
  preferredTime?: string
  dosesPerDay: number
  status: 'active' | 'paused'
  startDate: string
  createdAt: string
  updatedAt: string
}

/**
 * Format frequency config into a readable string for Supabase
 */
function formatFrequency(protocol: LocalStorageProtocol): string {
  switch (protocol.frequencyType) {
    case 'daily':
      return 'daily'
    case 'specific-days':
      return protocol.specificDays?.join(', ') || 'specific days'
    case 'interval':
      return `every ${protocol.intervalDays || 2} days`
    case 'cycling':
      return `${protocol.cycleOnDays || 5} on / ${protocol.cycleOffDays || 2} off`
    default:
      return 'daily'
  }
}

/**
 * Get the protocol name from peptideId or customPeptideName
 */
function getProtocolName(protocol: LocalStorageProtocol): string {
  if (protocol.customPeptideName) {
    return protocol.customPeptideName
  }
  const peptide = getPeptideById(protocol.peptideId)
  return peptide?.name || protocol.peptideId || 'Unknown Protocol'
}

/**
 * Get peptides array for Supabase
 */
function getPeptides(protocol: LocalStorageProtocol): string[] {
  const name = getProtocolName(protocol)
  return [name]
}

/**
 * POST /api/protocols/sync
 *
 * Sync protocols from localStorage to Supabase.
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

    const body = await request.json() as { protocols: LocalStorageProtocol[] }

    if (!body.protocols || !Array.isArray(body.protocols)) {
      return NextResponse.json(
        { error: 'Invalid request body - expected { protocols: Protocol[] }' },
        { status: 400 }
      )
    }

    if (body.protocols.length === 0) {
      return NextResponse.json({
        success: true,
        synced: 0,
        skipped: 0,
        message: 'No protocols to sync'
      })
    }

    // Prepare protocols for insertion
    const protocolsToUpsert = body.protocols.map(protocol => ({
      id: protocol.odId || protocol.id,
      user_id: user.id,
      name: getProtocolName(protocol),
      peptides: getPeptides(protocol),
      dosage: protocol.dose,
      frequency: formatFrequency(protocol),
      duration: null,
      start_date: protocol.startDate,
      end_date: null,
      status: protocol.status,
      phase: null,
      notes: null,
      updated_at: protocol.updatedAt || new Date().toISOString(),
    }))

    // Upsert protocols (update if exists, insert if not)
    const { data: upsertedData, error: upsertError } = await supabase
      .from('protocols')
      .upsert(protocolsToUpsert, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })
      .select()

    if (upsertError) {
      console.error('Protocol upsert error:', upsertError)
      return NextResponse.json(
        { error: 'Failed to sync protocols', details: upsertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      synced: upsertedData?.length || protocolsToUpsert.length,
      total: body.protocols.length,
      message: `Synced ${upsertedData?.length || protocolsToUpsert.length} protocols`
    })
  } catch (error) {
    console.error('Protocol sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync protocols' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/protocols/sync
 *
 * Check sync status - how many protocols exist in Supabase for this user.
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

    // Count user's protocols in Supabase
    const { count, error } = await supabase
      .from('protocols')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error checking protocol sync status:', error)
      return NextResponse.json(
        { error: 'Failed to check sync status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      hasSyncedData: (count || 0) > 0,
      protocolCount: count || 0
    })
  } catch (error) {
    console.error('Protocol sync status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
