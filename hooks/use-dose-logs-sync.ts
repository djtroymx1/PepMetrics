'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DoseLog } from '@/lib/types'

interface SyncStatus {
  hasSyncedData: boolean
  logCount: number
}

interface SyncResult {
  success: boolean
  synced: number
  skipped: number
  total: number
  message: string
}

export function useDoseLogsSync() {
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

    const localLogs = localStorage.getItem('pepmetrics_dose_logs')
    if (localLogs) {
      try {
        const logs = JSON.parse(localLogs) as DoseLog[]
        if (logs.length > 0 && status?.logCount === 0) {
          setNeedsSync(true)
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [status])

  const checkSyncStatus = async () => {
    try {
      const response = await fetch('/api/dose-logs/sync')

      if (response.status === 401) {
        // Not logged in, no sync needed
        setStatus({ hasSyncedData: false, logCount: 0 })
        return
      }

      if (!response.ok) {
        throw new Error('Failed to check sync status')
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      console.error('Error checking sync status:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const syncFromLocalStorage = useCallback(async (): Promise<SyncResult | null> => {
    if (typeof window === 'undefined') return null

    setIsSyncing(true)
    setError(null)

    try {
      // Get logs from localStorage
      const localLogs = localStorage.getItem('pepmetrics_dose_logs')
      if (!localLogs) {
        return {
          success: true,
          synced: 0,
          skipped: 0,
          total: 0,
          message: 'No local logs to sync'
        }
      }

      const logs = JSON.parse(localLogs) as DoseLog[]

      if (logs.length === 0) {
        return {
          success: true,
          synced: 0,
          skipped: 0,
          total: 0,
          message: 'No local logs to sync'
        }
      }

      // Send to sync endpoint
      const response = await fetch('/api/dose-logs/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      })

      if (!response.ok) {
        throw new Error('Failed to sync logs')
      }

      const result = await response.json() as SyncResult
      setNeedsSync(false)

      // Refresh status
      await checkSyncStatus()

      return result
    } catch (err) {
      console.error('Error syncing logs:', err)
      setError(err instanceof Error ? err.message : 'Failed to sync')
      return null
    } finally {
      setIsSyncing(false)
    }
  }, [])

  const clearLocalAfterSync = useCallback(() => {
    if (typeof window === 'undefined') return

    // Only clear if we have synced data
    if (status?.hasSyncedData) {
      localStorage.removeItem('pepmetrics_dose_logs')
    }
  }, [status])

  return {
    status,
    isSyncing,
    error,
    needsSync,
    syncFromLocalStorage,
    clearLocalAfterSync,
    checkSyncStatus,
  }
}
