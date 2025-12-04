'use client'

import { useState, useCallback } from 'react'
import type { GarminImportResult } from '@/lib/types'

interface ImportHistory {
  id: string
  import_date: string
  file_name: string | null
  file_type: string
  records_imported: number
  records_skipped: number
  records_updated: number
  date_range_start: string | null
  date_range_end: string | null
  status: string
  error_message: string | null
}

interface ActivityStats {
  totalActivities: number
  dateRange: {
    start: string
    end: string
  } | null
}

interface ImportHistoryResponse {
  imports: ImportHistory[]
  activityStats: ActivityStats
}

interface UseGarminImportReturn {
  // Upload state
  isUploading: boolean
  uploadProgress: number
  uploadError: string | null
  lastImportResult: GarminImportResult | null

  // History state
  isLoadingHistory: boolean
  importHistory: ImportHistory[]
  activityStats: ActivityStats | null

  // Actions
  uploadFile: (file: File) => Promise<GarminImportResult | null>
  fetchHistory: () => Promise<void>
  reset: () => void
}

export function useGarminImport(): UseGarminImportReturn {
  // Upload state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [lastImportResult, setLastImportResult] = useState<GarminImportResult | null>(null)

  // History state
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([])
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null)

  const uploadFile = useCallback(async (file: File): Promise<GarminImportResult | null> => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(null)
    setLastImportResult(null)

    try {
      // Validate file type
      const lowerName = file.name.toLowerCase()
      if (!lowerName.endsWith('.csv') && !lowerName.endsWith('.json')) {
        throw new Error('Please upload a CSV (activities) or JSON (full export) file from Garmin Connect')
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit')
      }

      setUploadProgress(20)

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      setUploadProgress(40)

      // Upload file
      const response = await fetch('/api/garmin/import', {
        method: 'POST',
        body: formData,
      })

      setUploadProgress(80)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setUploadProgress(100)
      setLastImportResult(data)

      // Refresh history after successful import
      await fetchHistory()

      return data

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(message)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true)

    try {
      const response = await fetch('/api/garmin/import')

      if (!response.ok) {
        throw new Error('Failed to fetch import history')
      }

      const data: ImportHistoryResponse = await response.json()
      setImportHistory(data.imports)
      setActivityStats(data.activityStats)

    } catch (error) {
      console.error('Failed to fetch import history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  const reset = useCallback(() => {
    setUploadProgress(0)
    setUploadError(null)
    setLastImportResult(null)
  }, [])

  return {
    // Upload state
    isUploading,
    uploadProgress,
    uploadError,
    lastImportResult,

    // History state
    isLoadingHistory,
    importHistory,
    activityStats,

    // Actions
    uploadFile,
    fetchHistory,
    reset,
  }
}
