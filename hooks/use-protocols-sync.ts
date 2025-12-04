'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Protocol } from '@/lib/types'

interface SyncStatus {
  hasSyncedData: boolean
  protocolCount: number
}

interface SyncResult {
  success: boolean
  synced: number
  total: number
  message: string
}

export function useProtocolsSync() {
  const [status, setStatus] = useState<SyncStatus | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsSync, setNeedsSync] = useState(false)

  // Check sync status on mount
  useEffect(() => {
    checkSyncStatus()
  }, [])

  // Check if localStorage has data that needs syncing
  useEffect(() => {
    if (typeof window === 'undefined') return

    const localProtocols = localStorage.getItem('pepmetrics_protocols')
    if (localProtocols) {
      try {
        const protocols = JSON.parse(localProtocols) as Protocol[]
        if (protocols.length > 0) {
          setNeedsSync(true)
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [status])

  const checkSyncStatus = async () => {
    try {
      const response = await fetch('/api/protocols/sync')

      if (response.status === 401) {
        // Not logged in, no sync needed
        setStatus({ hasSyncedData: false, protocolCount: 0 })
        return
      }

      if (!response.ok) {
        throw new Error('Failed to check sync status')
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      console.error('Error checking protocol sync status:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const syncFromLocalStorage = useCallback(async (): Promise<SyncResult | null> => {
    if (typeof window === 'undefined') return null

    setIsSyncing(true)
    setError(null)

    try {
      // Get protocols from localStorage
      const localProtocols = localStorage.getItem('pepmetrics_protocols')
      if (!localProtocols) {
        return {
          success: true,
          synced: 0,
          total: 0,
          message: 'No local protocols to sync'
        }
      }

      const protocols = JSON.parse(localProtocols) as Protocol[]

      if (protocols.length === 0) {
        return {
          success: true,
          synced: 0,
          total: 0,
          message: 'No local protocols to sync'
        }
      }

      // Send to sync endpoint
      const response = await fetch('/api/protocols/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ protocols }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to sync protocols')
      }

      const result = await response.json() as SyncResult
      setNeedsSync(false)

      // Refresh status
      await checkSyncStatus()

      return result
    } catch (err) {
      console.error('Error syncing protocols:', err)
      setError(err instanceof Error ? err.message : 'Failed to sync')
      return null
    } finally {
      setIsSyncing(false)
    }
  }, [])

  return {
    status,
    isSyncing,
    error,
    needsSync,
    syncFromLocalStorage,
    checkSyncStatus,
  }
}
