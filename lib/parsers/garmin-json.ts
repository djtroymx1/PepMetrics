/**
 * Garmin Full Data Export JSON Parser
 *
 * Parses the full data export from Garmin (requested via garmin.com/account).
 * This export contains detailed health metrics in JSON format:
 * - Sleep data (duration, stages, score)
 * - HRV data (heart rate variability)
 * - Stress data (all-day stress levels)
 * - Body Battery data
 * - Daily summaries
 *
 * The export comes as a ZIP file containing multiple JSON files.
 * This parser handles the individual JSON files after extraction.
 */

import type { GarminDailySummary } from '@/lib/types'

// Structure of Garmin full export files
export interface GarminExportFile {
  fileName: string
  type: 'sleep' | 'hrv' | 'stress' | 'body_battery' | 'daily_summary' | 'activities' | 'unknown'
  content: unknown
}

export interface ParsedGarminExport {
  success: boolean
  dailyData: Map<string, Partial<GarminDailySummary>>
  errors: string[]
  summary: {
    filesProcessed: number
    daysOfData: number
    dateRange: { start: string; end: string } | null
    dataTypes: string[]
  }
}

// Sleep data structure from Garmin export
interface GarminSleepEntry {
  calendarDate: string
  sleepTimeSeconds?: number
  deepSleepSeconds?: number
  lightSleepSeconds?: number
  remSleepSeconds?: number
  awakeSleepSeconds?: number
  sleepScores?: {
    overall?: { value: number }
    qualityScore?: { value: number }
  }
  sleepStartTimestampGMT?: number
  sleepEndTimestampGMT?: number
}

// HRV data structure from Garmin export
interface GarminHRVEntry {
  calendarDate: string
  hrvValue?: number
  weeklyAvg?: number
  lastNightAvg?: number
  lastNight5MinHigh?: number
  baseline?: {
    lowUpper?: number
    balancedLow?: number
    balancedUpper?: number
  }
}

// Stress data structure from Garmin export
interface GarminStressEntry {
  calendarDate: string
  overallStressLevel?: number
  restStressDuration?: number
  lowStressDuration?: number
  mediumStressDuration?: number
  highStressDuration?: number
  stressQualifier?: string
}

// Body Battery data structure from Garmin export
interface GarminBodyBatteryEntry {
  calendarDate: string
  startOfDayBodyBattery?: number
  endOfDayBodyBattery?: number
  highestBodyBattery?: number
  lowestBodyBattery?: number
  bodyBatteryDrain?: number
  bodyBatteryCharge?: number
}

// Daily summary structure from Garmin export
interface GarminDailySummaryEntry {
  calendarDate: string
  totalSteps?: number
  totalDistanceMeters?: number
  activeKilocalories?: number
  bmrKilocalories?: number
  floorsAscended?: number
  floorsDescended?: number
  intensityMinutes?: number
  vigorousIntensityMinutes?: number
  restingHeartRate?: number
  minHeartRate?: number
  maxHeartRate?: number
  averageStressLevel?: number
  maxStressLevel?: number

  // UDSFile/aggregator fields
  totalKilocalories?: number
  activeSeconds?: number
}

/**
 * Parse a Garmin full export JSON file
 */
export function parseGarminExportFile(
  fileName: string,
  content: string
): GarminExportFile {
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    return {
      fileName,
      type: 'unknown',
      content: null,
    }
  }

  // Detect file type based on filename and content structure
  const lowerName = fileName.toLowerCase()

  if (lowerName.includes('sleep') || hasProperty(parsed, 'sleepTimeSeconds') || lowerName.includes('sleepdata')) {
    return { fileName, type: 'sleep', content: parsed }
  }

  if (lowerName.includes('hrv') || hasProperty(parsed, 'hrvValue') || hasProperty(parsed, 'lastNightAvg')) {
    return { fileName, type: 'hrv', content: parsed }
  }

  if (lowerName.includes('stress') || hasProperty(parsed, 'overallStressLevel')) {
    return { fileName, type: 'stress', content: parsed }
  }

  if (
    lowerName.includes('body_battery') ||
    lowerName.includes('bodybattery') ||
    hasProperty(parsed, 'startOfDayBodyBattery') ||
    hasProperty(parsed, 'bodyBatteryStatList')
  ) {
    return { fileName, type: 'body_battery', content: parsed }
  }

  // Garmin wellness/aggregator daily summary often named UDSFile_*.json
  if (
    lowerName.includes('udsfile') ||
    lowerName.includes('aggregator') ||
    lowerName.includes('daily') ||
    lowerName.includes('summary') ||
    hasProperty(parsed, 'totalSteps')
  ) {
    return { fileName, type: 'daily_summary', content: parsed }
  }

  if (lowerName.includes('activities') || hasProperty(parsed, 'activityType')) {
    return { fileName, type: 'activities', content: parsed }
  }

  return { fileName, type: 'unknown', content: parsed }
}

/**
 * Process multiple Garmin export files and merge into daily summaries
 */
export function processGarminExport(files: GarminExportFile[]): ParsedGarminExport {
  const dailyData = new Map<string, Partial<GarminDailySummary>>()
  const errors: string[] = []
  const dataTypes: Set<string> = new Set()

  for (const file of files) {
    if (file.type === 'unknown') {
      continue // Skip unknown files
    }

    dataTypes.add(file.type)

    try {
      const entries = normalizeToArray(file.content)

      for (const entry of entries) {
        if (!entry || typeof entry !== 'object') continue

        const date = getDateFromEntry(entry)
        if (!date) continue

        const existing = dailyData.get(date) || { date }
        const merged = mergeEntryData(existing, entry, file.type)
        dailyData.set(date, merged)
      }
    } catch (error) {
      errors.push(`Error processing ${file.fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Calculate summary
  const dates = Array.from(dailyData.keys()).sort()
  const dateRange = dates.length > 0
    ? { start: dates[0], end: dates[dates.length - 1] }
    : null

  return {
    success: dailyData.size > 0,
    dailyData,
    errors,
    summary: {
      filesProcessed: files.filter(f => f.type !== 'unknown').length,
      daysOfData: dailyData.size,
      dateRange,
      dataTypes: Array.from(dataTypes),
    },
  }
}

/**
 * Merge entry data into existing daily summary based on data type
 */
function mergeEntryData(
  existing: Partial<GarminDailySummary>,
  entry: Record<string, unknown>,
  type: string
): Partial<GarminDailySummary> {
  const merged = { ...existing }

  switch (type) {
    case 'sleep': {
      const sleep = entry as GarminSleepEntry
      if (sleep.sleepTimeSeconds) {
        merged.sleep_duration_hours = sleep.sleepTimeSeconds / 3600
      }
      if (sleep.deepSleepSeconds) {
        merged.deep_sleep_hours = sleep.deepSleepSeconds / 3600
      }
      if (sleep.lightSleepSeconds) {
        merged.light_sleep_hours = sleep.lightSleepSeconds / 3600
      }
      if (sleep.remSleepSeconds) {
        merged.rem_sleep_hours = sleep.remSleepSeconds / 3600
      }
      if (sleep.awakeSleepSeconds) {
        merged.awake_hours = sleep.awakeSleepSeconds / 3600
      }
      if (sleep.sleepScores?.overall?.value) {
        merged.sleep_score = sleep.sleepScores.overall.value
      }
      break
    }

    case 'hrv': {
      const hrv = entry as GarminHRVEntry
      merged.hrv_avg = hrv.lastNightAvg ?? hrv.hrvValue ?? undefined
      break
    }

    case 'stress': {
      const stress = entry as GarminStressEntry
      merged.stress_avg = stress.overallStressLevel ?? undefined
      break
    }

    case 'body_battery': {
      const bb = entry as GarminBodyBatteryEntry
      merged.body_battery_high = bb.highestBodyBattery ?? bb.startOfDayBodyBattery ?? undefined
      merged.body_battery_low = bb.lowestBodyBattery ?? bb.endOfDayBodyBattery ?? undefined
      break
    }

    case 'daily_summary': {
      const summary = entry as GarminDailySummaryEntry

      // Standard daily summary fields
      if (summary.totalSteps !== undefined) merged.steps = summary.totalSteps
      if (summary.totalDistanceMeters !== undefined) merged.distance_meters = summary.totalDistanceMeters
      if (summary.activeKilocalories !== undefined) merged.calories_active = summary.activeKilocalories
      if (summary.activeKilocalories !== undefined || summary.bmrKilocalories !== undefined) {
        merged.calories_total = (summary.activeKilocalories ?? 0) + (summary.bmrKilocalories ?? 0)
      }
      if (summary.intensityMinutes !== undefined || summary.vigorousIntensityMinutes !== undefined) {
        merged.active_minutes = (summary.intensityMinutes ?? 0) + (summary.vigorousIntensityMinutes ?? 0)
      }
      if (summary.restingHeartRate !== undefined) merged.resting_hr = summary.restingHeartRate
      if (summary.averageStressLevel !== undefined && merged.stress_avg === undefined) {
        merged.stress_avg = summary.averageStressLevel
      }

      // Fields present in UDSFile/aggregator summaries
      const totalKilocalories = (entry as any).totalKilocalories
      if (totalKilocalories !== undefined) merged.calories_total = totalKilocalories

      const activeKilocalories = (entry as any).activeKilocalories
      if (activeKilocalories !== undefined) merged.calories_active = activeKilocalories

      const totalSteps = (entry as any).totalSteps
      if (totalSteps !== undefined) merged.steps = totalSteps

      const totalDistanceMeters = (entry as any).totalDistanceMeters
      if (totalDistanceMeters !== undefined) merged.distance_meters = totalDistanceMeters

      const activeSeconds = (entry as any).activeSeconds
      if (activeSeconds !== undefined) merged.active_minutes = Math.round(activeSeconds / 60)

      // Stress average from allDayStress
      const allDayStress = (entry as any).allDayStress
      if (allDayStress?.aggregatorList?.length) {
        const total = allDayStress.aggregatorList.find((a: any) => a.type === 'TOTAL') || allDayStress.aggregatorList[0]
        if (total?.averageStressLevel !== undefined) merged.stress_avg = total.averageStressLevel
      }

      // Body battery high/low from bodyBatteryStatList
      const bodyBattery = (entry as any).bodyBattery
      if (bodyBattery?.bodyBatteryStatList?.length) {
        const highest = bodyBattery.bodyBatteryStatList.find((s: any) => s.bodyBatteryStatType === 'HIGHEST')
        const lowest = bodyBattery.bodyBatteryStatList.find((s: any) => s.bodyBatteryStatType === 'LOWEST')
        if (highest?.statsValue !== undefined) merged.body_battery_high = highest.statsValue
        if (lowest?.statsValue !== undefined) merged.body_battery_low = lowest.statsValue
      }

      // Resting HR alternative keys
      const restingHeartRate = (entry as any).restingHeartRate
      if (restingHeartRate !== undefined) merged.resting_hr = restingHeartRate
      break
    }
  }

  return merged
}

/**
 * Extract date from an entry (handles various Garmin date formats)
 */
function getDateFromEntry(entry: Record<string, unknown>): string | null {
  // Common date field names in Garmin exports
  const dateFields = ['calendarDate', 'date', 'summaryDate', 'startDate']

  for (const field of dateFields) {
    const value = entry[field]
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      // Return just the date part (YYYY-MM-DD)
      return value.substring(0, 10)
    }
  }

  // Try timestamp fields
  const timestampFields = ['startTimestampGMT', 'endTimestampGMT', 'timestamp']
  for (const field of timestampFields) {
    const value = entry[field]
    if (typeof value === 'number') {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return date.toISOString().substring(0, 10)
      }
    }
  }

  return null
}

/**
 * Normalize Garmin export data to an array of entries
 */
function normalizeToArray(content: unknown): Record<string, unknown>[] {
  if (Array.isArray(content)) {
    return content
  }

  if (typeof content === 'object' && content !== null) {
    // Some Garmin files have the data nested under a key
    const obj = content as Record<string, unknown>

    // Check for common wrapper keys
    const wrapperKeys = ['allSleeps', 'hrvValues', 'stressSummaries', 'bodyBatteryData', 'dailySummaries']
    for (const key of wrapperKeys) {
      if (Array.isArray(obj[key])) {
        return obj[key] as Record<string, unknown>[]
      }
    }

    // If it's a single entry object with a date, wrap in array
    if (getDateFromEntry(obj)) {
      return [obj]
    }
  }

  return []
}

/**
 * Check if an object or array has a specific property
 */
function hasProperty(data: unknown, property: string): boolean {
  if (Array.isArray(data)) {
    return data.length > 0 && typeof data[0] === 'object' && data[0] !== null && property in data[0]
  }
  if (typeof data === 'object' && data !== null) {
    return property in data
  }
  return false
}

/**
 * Convert parsed daily data to array format for database insertion
 */
export function dailyDataToArray(dailyData: Map<string, Partial<GarminDailySummary>>): GarminDailySummary[] {
  return Array.from(dailyData.values()).map(entry => ({
    date: entry.date || '',
    sleep_score: entry.sleep_score,
    sleep_duration_hours: entry.sleep_duration_hours,
    deep_sleep_hours: entry.deep_sleep_hours,
    light_sleep_hours: entry.light_sleep_hours,
    rem_sleep_hours: entry.rem_sleep_hours,
    awake_hours: entry.awake_hours,
    hrv_avg: entry.hrv_avg,
    resting_hr: entry.resting_hr,
    stress_avg: entry.stress_avg,
    body_battery_high: entry.body_battery_high,
    body_battery_low: entry.body_battery_low,
    steps: entry.steps,
    active_minutes: entry.active_minutes,
    calories_total: entry.calories_total,
    calories_active: entry.calories_active,
    distance_meters: entry.distance_meters,
  }))
}

/**
 * Parse a ZIP file containing Garmin export data
 * This is a placeholder - actual ZIP parsing would require a library like JSZip
 */
export async function parseGarminExportZip(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _zipFile: File
): Promise<ParsedGarminExport> {
  // This would be implemented using JSZip or similar
  // For now, return an error indicating the user needs to extract first
  return {
    success: false,
    dailyData: new Map(),
    errors: ['ZIP file parsing not yet implemented. Please extract the ZIP and upload individual JSON files.'],
    summary: {
      filesProcessed: 0,
      daysOfData: 0,
      dateRange: null,
      dataTypes: [],
    },
  }
}
