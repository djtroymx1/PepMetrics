'use client'

import { useState, useCallback } from 'react'
import type { GarminImportResult, GarminDailySummary } from '@/lib/types'
import {
  parseGarminExportZip,
  dailyDataToArray,
} from '@/lib/parsers/garmin-json'

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
      const isZip = lowerName.endsWith('.zip')
      const isCsv = lowerName.endsWith('.csv')
      const isJson = lowerName.endsWith('.json')

      if (!isZip && !isCsv && !isJson) {
        throw new Error('Please upload a ZIP (recommended), CSV, or JSON file from Garmin')
      }

      // Validate file size (500MB for ZIP since we process client-side, 5MB for others)
      const maxSize = isZip ? 500 * 1024 * 1024 : 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error(`File size exceeds ${isZip ? '500MB' : '5MB'} limit`)
      }

      // For ZIP files, process client-side and send only the parsed data
      if (isZip) {
        setUploadProgress(10)

        // Parse the ZIP file in the browser
        const zipResult = await parseGarminExportZip(file, 90)

        setUploadProgress(50)

        if (!zipResult.success || zipResult.dailyData.size === 0) {
          throw new Error(
            zipResult.errors.length > 0
              ? zipResult.errors[0]
              : 'No relevant Garmin data found in the ZIP file'
          )
        }

        // Convert to array
        const dailyArray = dailyDataToArray(zipResult.dailyData)

        setUploadProgress(60)

        // Send the processed data to the API (much smaller than the ZIP)
        const response = await fetch('/api/garmin/import-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: 'zip_export',
            dailySummaries: dailyArray,
            dateRange: zipResult.summary.dateRange,
            dataTypes: zipResult.summary.dataTypes,
            scanResult: {
              totalFiles: zipResult.scanResult.totalFiles,
              relevantFiles: zipResult.scanResult.relevantFiles,
              skippedFiles: zipResult.scanResult.skippedFiles,
              dataTypes: zipResult.scanResult.dataTypes,
            },
          }),
        })

        setUploadProgress(90)

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Import failed')
        }

        setUploadProgress(100)
        setLastImportResult(data)

        // Refresh history after successful import
        await fetchHistory()

        return data
      }

      // For CSV/JSON, use the original upload approach (files are smaller)
      setUploadProgress(10)

      const formData = new FormData()
      formData.append('file', file)

      setUploadProgress(20)

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
