/**
 * Garmin File Scanner
 *
 * Scans Garmin export ZIP files or folders to identify and categorize
 * relevant health data files. Parses date ranges from filenames to
 * intelligently select files based on target date range.
 */

import JSZip from 'jszip'

export type GarminFileType =
  | 'sleep'
  | 'daily_summary'
  | 'hrv'
  | 'stress'
  | 'body_battery'
  | 'health_status'
  | 'hydration'
  | 'activities'
  | 'user_biometrics'
  | 'unknown'

export interface GarminFileInfo {
  path: string
  filename: string
  type: GarminFileType
  dateRange: { start: string; end: string } | null
  size: number
}

export interface ZipScanResult {
  files: GarminFileInfo[]
  totalFiles: number
  relevantFiles: number
  skippedFiles: number
  dataTypes: GarminFileType[]
  overallDateRange: { start: string; end: string } | null
}

/**
 * Extract date range from Garmin filename patterns
 *
 * Patterns:
 * - 2025-08-27_2025-12-05_12192358_sleepData.json (date_date_userid_type)
 * - UDSFile_2025-08-26_2025-12-04.json (type_date_date)
 * - HydrationLogFile_2025-08-25_2025-12-03.json (type_date_date)
 * - 2025-09-17_2025-12-03_12192358_healthStatusData.json
 */
export function extractDateRangeFromFilename(filename: string): { start: string; end: string } | null {
  // Pattern 1: StartDate_EndDate_UserID_Type.json
  // e.g., 2025-08-27_2025-12-05_12192358_sleepData.json
  const pattern1 = /^(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})_\d+_\w+\.json$/i
  const match1 = filename.match(pattern1)
  if (match1) {
    return { start: match1[1], end: match1[2] }
  }

  // Pattern 2: Type_StartDate_EndDate.json
  // e.g., UDSFile_2025-08-26_2025-12-04.json, HydrationLogFile_2025-08-25_2025-12-03.json
  const pattern2 = /^[A-Za-z]+_(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})\.json$/i
  const match2 = filename.match(pattern2)
  if (match2) {
    return { start: match2[1], end: match2[2] }
  }

  return null
}

/**
 * Categorize a Garmin file by its type based on filename
 */
export function categorizeGarminFile(filename: string): GarminFileType {
  const lowerName = filename.toLowerCase()

  // Sleep data files
  if (lowerName.includes('sleepdata') || lowerName.includes('sleep_data')) {
    return 'sleep'
  }

  // Daily summary / aggregator files (UDS = User Daily Summary)
  if (lowerName.includes('udsfile') || lowerName.includes('aggregator')) {
    return 'daily_summary'
  }

  // Health status data (contains HRV, skin temp, respiration)
  if (lowerName.includes('healthstatusdata') || lowerName.includes('health_status')) {
    return 'health_status'
  }

  // Hydration data
  if (lowerName.includes('hydration')) {
    return 'hydration'
  }

  // User biometrics (weight, fitness age, etc.)
  if (lowerName.includes('userbiometrics') || lowerName.includes('fitnessagedata')) {
    return 'user_biometrics'
  }

  // Summarized activities
  if (lowerName.includes('activities') || lowerName.includes('summarizedactivities')) {
    return 'activities'
  }

  // Stress data
  if (lowerName.includes('stress')) {
    return 'stress'
  }

  // Body battery
  if (lowerName.includes('bodybattery') || lowerName.includes('body_battery')) {
    return 'body_battery'
  }

  // HRV specific files
  if (lowerName.includes('hrv')) {
    return 'hrv'
  }

  return 'unknown'
}

/**
 * Check if a file's date range overlaps with the target period
 */
export function isFileInDateRange(
  fileRange: { start: string; end: string } | null,
  targetStart: Date,
  targetEnd: Date
): boolean {
  if (!fileRange) {
    // If no date range in filename, include it (might have relevant data)
    return true
  }

  const fileStart = new Date(fileRange.start)
  const fileEnd = new Date(fileRange.end)

  // Check if ranges overlap
  return fileStart <= targetEnd && fileEnd >= targetStart
}

/**
 * Get the list of relevant file types we want to import
 */
export function getRelevantFileTypes(): GarminFileType[] {
  return ['sleep', 'daily_summary', 'health_status', 'hydration', 'user_biometrics', 'activities']
}

/**
 * Scan a ZIP file for Garmin data files
 */
export async function scanZipForGarminFiles(
  zipFile: File | Blob,
  targetDays: number = 90
): Promise<ZipScanResult> {
  const zip = await JSZip.loadAsync(zipFile)

  const targetEnd = new Date()
  const targetStart = new Date()
  targetStart.setDate(targetStart.getDate() - targetDays)

  const relevantTypes = getRelevantFileTypes()
  const files: GarminFileInfo[] = []
  let totalFiles = 0
  let skippedFiles = 0

  // Iterate through all files in the ZIP
  for (const [path, zipEntry] of Object.entries(zip.files)) {
    // Skip directories
    if (zipEntry.dir) continue

    // Only process JSON files
    if (!path.toLowerCase().endsWith('.json')) continue

    totalFiles++

    const filename = path.split('/').pop() || path
    const type = categorizeGarminFile(filename)
    const dateRange = extractDateRangeFromFilename(filename)

    // Skip unknown file types
    if (type === 'unknown' || !relevantTypes.includes(type)) {
      skippedFiles++
      continue
    }

    // Check if file is in target date range
    if (!isFileInDateRange(dateRange, targetStart, targetEnd)) {
      skippedFiles++
      continue
    }

    // Get uncompressed size (approximate)
    const size = zipEntry._data?.uncompressedSize || 0

    files.push({
      path,
      filename,
      type,
      dateRange,
      size,
    })
  }

  // Get unique data types found
  const dataTypes = [...new Set(files.map(f => f.type))]

  // Calculate overall date range from all files
  let overallStart: string | null = null
  let overallEnd: string | null = null

  for (const file of files) {
    if (file.dateRange) {
      if (!overallStart || file.dateRange.start < overallStart) {
        overallStart = file.dateRange.start
      }
      if (!overallEnd || file.dateRange.end > overallEnd) {
        overallEnd = file.dateRange.end
      }
    }
  }

  return {
    files,
    totalFiles,
    relevantFiles: files.length,
    skippedFiles,
    dataTypes,
    overallDateRange: overallStart && overallEnd
      ? { start: overallStart, end: overallEnd }
      : null,
  }
}

/**
 * Extract and read specific files from a ZIP
 */
export async function extractFilesFromZip(
  zipFile: File | Blob,
  filePaths: string[]
): Promise<Map<string, string>> {
  const zip = await JSZip.loadAsync(zipFile)
  const contents = new Map<string, string>()

  for (const path of filePaths) {
    const zipEntry = zip.file(path)
    if (zipEntry) {
      const content = await zipEntry.async('string')
      contents.set(path, content)
    }
  }

  return contents
}

/**
 * Get a human-readable summary of what data was found
 */
export function getDataTypeSummary(dataTypes: GarminFileType[]): string[] {
  const summaries: string[] = []

  if (dataTypes.includes('sleep')) {
    summaries.push('Sleep data (duration, stages, quality)')
  }
  if (dataTypes.includes('daily_summary')) {
    summaries.push('Daily activity (steps, calories, stress, body battery)')
  }
  if (dataTypes.includes('health_status')) {
    summaries.push('Health metrics (HRV, skin temperature, respiration)')
  }
  if (dataTypes.includes('hydration')) {
    summaries.push('Hydration tracking')
  }
  if (dataTypes.includes('user_biometrics')) {
    summaries.push('Biometrics (weight, fitness age)')
  }
  if (dataTypes.includes('activities')) {
    summaries.push('Activity records')
  }

  return summaries
}
