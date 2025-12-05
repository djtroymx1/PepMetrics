'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileArchive,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { useGarminImport } from '@/hooks/use-garmin-import'
import { cn } from '@/lib/utils'

interface GarminImportProps {
  onImportComplete?: () => void
}

export function GarminImport({ onImportComplete }: GarminImportProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  const {
    isUploading,
    uploadProgress,
    uploadError,
    lastImportResult,
    isLoadingHistory,
    activityStats,
    uploadFile,
    fetchHistory,
    reset,
  } = useGarminImport()

  // Fetch history on mount
  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      const result = await uploadFile(file)
      if (result?.success) {
        // Refresh the page to reload server components with new data
        router.refresh()
        onImportComplete?.()
      }
    }
  }, [uploadFile, onImportComplete, router])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const result = await uploadFile(file)
      if (result?.success) {
        // Refresh the page to reload server components with new data
        router.refresh()
        onImportComplete?.()
      }
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [uploadFile, onImportComplete, router])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const hasData = activityStats && activityStats.totalActivities > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>Import Your Garmin Data</CardTitle>
            <CardDescription>
              Connect your Garmin health metrics to unlock AI-powered insights
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Show current data stats if available */}
        {hasData && !lastImportResult && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {activityStats.totalActivities} activities imported
              </p>
              {activityStats.dateRange && (
                <p className="text-xs text-muted-foreground">
                  {activityStats.dateRange.start} to {activityStats.dateRange.end}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Import more
            </button>
          </div>
        )}

        {/* Upload area */}
        {(!hasData || showInstructions || isUploading || lastImportResult || uploadError) && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.zip"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Success state */}
            {lastImportResult && !isUploading && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      Import successful!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {lastImportResult.recordsImported} days of health data imported
                      {lastImportResult.recordsUpdated > 0 && `, ${lastImportResult.recordsUpdated} updated`}
                    </p>
                    {lastImportResult.dateRange && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Coverage: {lastImportResult.dateRange.start} to {lastImportResult.dateRange.end}
                      </p>
                    )}
                    {/* Show data types imported for ZIP files */}
                    {lastImportResult.dataTypes && lastImportResult.dataTypes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {lastImportResult.dataTypes.includes('sleep') && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-700 dark:text-green-300">Sleep</span>
                        )}
                        {lastImportResult.dataTypes.includes('daily_summary') && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-700 dark:text-green-300">Activity</span>
                        )}
                        {(lastImportResult.dataTypes.includes('hrv') || lastImportResult.dataTypes.includes('health_status')) && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-700 dark:text-green-300">HRV</span>
                        )}
                        {lastImportResult.dataTypes.includes('daily_summary') && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-700 dark:text-green-300">Stress</span>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      Your charts and AI insights are ready!
                    </p>
                  </div>
                  <button
                    onClick={reset}
                    className="text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    Import more
                  </button>
                </div>
              </div>
            )}

            {/* Error state */}
            {uploadError && !isUploading && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-red-600 dark:text-red-400">
                      Import failed
                    </p>
                    <p className="text-sm text-muted-foreground">{uploadError}</p>
                  </div>
                  <button
                    onClick={reset}
                    className="text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Uploading state */}
            {isUploading && (
              <div className="p-6 rounded-lg border border-border bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-sm font-medium">Processing your Garmin data...</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Drop zone */}
            {!isUploading && !lastImportResult && !uploadError && (
              <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed transition-colors cursor-pointer',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <FileArchive className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drop your Garmin export ZIP file here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepts .zip (recommended), .csv, or .json from Garmin
                </p>
              </div>
            )}
          </>
        )}

        {/* Instructions collapsible */}
        <Collapsible open={showInstructions} onOpenChange={setShowInstructions}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center py-2">
            {showInstructions ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide export instructions
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                How to export from Garmin Connect
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="rounded-lg bg-muted/50 p-4 space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 text-xs rounded bg-primary/20 text-primary">Recommended</span>
                  Full Export (ZIP) - Sleep, HRV, Stress, Activity
                </h4>
                <p className="text-muted-foreground mb-2">
                  Best for AI insights. Includes sleep quality, heart rate variability, stress levels, and daily activity.
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
                  <li>
                    Go to{' '}
                    <a
                      href="https://www.garmin.com/account/datamanagement/exportdata"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      garmin.com/account/datamanagement/exportdata
                    </a>
                  </li>
                  <li>Click <strong>Request Data Export</strong> and wait for email</li>
                  <li>Download the ZIP file from the email link</li>
                  <li><strong>Drop the ZIP file directly into the upload area above</strong> - no need to extract!</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-2">
                  We automatically find and import the last 90 days of health data.
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <h4 className="font-medium mb-2">Alternative: Activity CSV</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  For activity data only (no sleep, HRV, or stress).
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                  <li>Go to <a href="https://connect.garmin.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">connect.garmin.com</a></li>
                  <li>Click Activities â†’ Export CSV (upper right)</li>
                </ol>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Privacy:</strong> Your data stays in your PepMetrics account. We never share health information with third parties.
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Quick stats when loading */}
        {isLoadingHistory && (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
