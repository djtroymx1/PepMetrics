/**
 * Garmin Activity CSV Parser
 *
 * Parses CSV exports from Garmin Connect's Activities page.
 * These exports contain activity summaries including type, duration,
 * distance, calories, heart rate, and other workout metrics.
 *
 * Export instructions:
 * 1. Go to connect.garmin.com and sign in
 * 2. Click Activities in the left sidebar
 * 3. Scroll to load desired activities
 * 4. Click "Export CSV" in the upper right
 */

import type { GarminCSVParseResult, ParsedGarminActivity, ParseError } from '@/lib/types'

// Known column name variations from Garmin Connect exports
const COLUMN_MAPPINGS: Record<string, string[]> = {
  activity_type: ['Activity Type', 'Type', 'Activitätsart'],
  activity_name: ['Title', 'Activity Name', 'Name', 'Titel'],
  date: ['Date', 'Start Date', 'Datum'],
  distance: ['Distance', 'Distanz'],
  duration: ['Time', 'Duration', 'Moving Time', 'Elapsed Time', 'Dauer', 'Zeit'],
  calories: ['Calories', 'Kalorien'],
  avg_hr: ['Avg HR', 'Average HR', 'Avg Heart Rate', 'Average Heart Rate', 'Durchschn. HF'],
  max_hr: ['Max HR', 'Maximum HR', 'Max Heart Rate', 'Maximum Heart Rate', 'Max. HF'],
  avg_speed: ['Avg Speed', 'Average Speed', 'Durchschn. Geschwindigkeit'],
  max_speed: ['Max Speed', 'Maximum Speed'],
  avg_pace: ['Avg Pace', 'Average Pace', 'Durchschn. Tempo'],
  elevation_gain: ['Total Ascent', 'Elev Gain', 'Elevation Gain', 'Höhengewinn'],
  favorite: ['Favorite'],
  steps: ['Steps'],
  body_battery_drain: ['Body Battery Drain'],
  aerobic_te: ['Aerobic TE'],
}

/**
 * Parse a Garmin Connect activity CSV file
 */
export function parseGarminActivityCSV(csvContent: string): GarminCSVParseResult {
  const errors: ParseError[] = []
  const activities: ParsedGarminActivity[] = []

  // Split into lines and handle different line endings
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim())

  if (lines.length < 2) {
    return {
      success: false,
      activities: [],
      errors: [{ row: 0, message: 'CSV file is empty or contains only headers' }],
      summary: {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        dateRange: null,
      },
    }
  }

  // Parse header row
  const headers = parseCSVLine(lines[0])
  const columnMap = mapColumns(headers)

  // Validate we have minimum required columns
  if (!columnMap.activity_type && !columnMap.date) {
    return {
      success: false,
      activities: [],
      errors: [{ row: 0, message: 'CSV does not appear to be a Garmin activity export. Missing Activity Type or Date columns.' }],
      summary: {
        totalRows: lines.length - 1,
        validRows: 0,
        invalidRows: lines.length - 1,
        dateRange: null,
      },
    }
  }

  // Parse data rows
  let minDate: Date | null = null
  let maxDate: Date | null = null

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    const rowNumber = i + 1 // 1-based for user-friendly error messages

    try {
      const activity = parseActivityRow(values, columnMap, headers)

      if (activity) {
        activities.push(activity)

        // Track date range
        const activityDate = new Date(activity.start_time)
        if (!isNaN(activityDate.getTime())) {
          if (!minDate || activityDate < minDate) minDate = activityDate
          if (!maxDate || activityDate > maxDate) maxDate = activityDate
        }
      }
    } catch (error) {
      errors.push({
        row: rowNumber,
        message: error instanceof Error ? error.message : 'Failed to parse row',
      })
    }
  }

  return {
    success: activities.length > 0,
    activities,
    errors,
    summary: {
      totalRows: lines.length - 1,
      validRows: activities.length,
      invalidRows: errors.length,
      dateRange: minDate && maxDate ? { start: minDate, end: maxDate } : null,
    },
  }
}

/**
 * Parse a single CSV line, handling quoted fields with commas
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Don't forget the last value
  values.push(current.trim())

  return values
}

/**
 * Map actual CSV column names to our internal field names
 */
function mapColumns(headers: string[]): Record<string, number> {
  const columnMap: Record<string, number> = {}

  for (const [field, variations] of Object.entries(COLUMN_MAPPINGS)) {
    for (const variation of variations) {
      const index = headers.findIndex(
        h => h.toLowerCase().trim() === variation.toLowerCase()
      )
      if (index !== -1) {
        columnMap[field] = index
        break
      }
    }
  }

  return columnMap
}

/**
 * Parse a single activity row into our data structure
 */
function parseActivityRow(
  values: string[],
  columnMap: Record<string, number>,
  headers: string[]
): ParsedGarminActivity | null {
  const getValue = (field: string): string | null => {
    const index = columnMap[field]
    if (index === undefined || index >= values.length) return null
    const value = values[index]?.trim()
    return value === '' || value === '--' ? null : value
  }

  // Extract required fields
  const activityType = getValue('activity_type')
  const dateStr = getValue('date')

  if (!activityType || !dateStr) {
    return null
  }

  // Parse date (may include time in same field)
  const startTime = parseGarminDateTime(dateStr)

  if (!startTime) {
    throw new Error(`Invalid date format: ${dateStr}`)
  }

  // Build raw_data object with all original values
  const rawData: Record<string, string> = {}
  headers.forEach((header, index) => {
    if (values[index] && values[index].trim()) {
      rawData[header] = values[index].trim()
    }
  })

  return {
    activity_type: activityType,
    activity_name: getValue('activity_name'),
    start_time: startTime,
    duration_seconds: parseDuration(getValue('duration')),
    distance_meters: parseDistance(getValue('distance')),
    calories: parseNumber(getValue('calories')),
    avg_heart_rate: parseNumber(getValue('avg_hr')),
    max_heart_rate: parseNumber(getValue('max_hr')),
    avg_speed_mps: parseSpeed(getValue('avg_speed'), getValue('avg_pace')),
    elevation_gain_meters: parseElevation(getValue('elevation_gain')),
    raw_data: rawData,
  }
}

/**
 * Parse Garmin date/time formats
 * Garmin uses various formats depending on locale settings:
 * - "2024-12-03 16:14:10" (ISO with time)
 * - "2024-12-03" (ISO)
 * - "Dec 3, 2024"
 * - "3 Dec 2024"
 * - "12/03/2024" (US)
 * - "03/12/2024" (EU)
 */
function parseGarminDateTime(dateStr: string): string | null {
  // Try various date formats
  let date: Date | null = null

  // ISO format with time: 2024-12-03 16:14:10
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/.test(dateStr)) {
    // Replace space with T for proper ISO parsing
    date = new Date(dateStr.replace(' ', 'T'))
  }
  // ISO format: 2024-12-03
  else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    date = new Date(dateStr + 'T00:00:00')
  }
  // US format: 12/03/2024 or 12/3/2024
  else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
    const [month, day, year] = dateStr.split('/')
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }
  // Month name format: "Dec 3, 2024" or "3 Dec 2024"
  else if (/[A-Za-z]/.test(dateStr)) {
    date = new Date(dateStr)
  }
  // Fallback: try native parsing
  else {
    date = new Date(dateStr)
  }

  if (!date || isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

/**
 * Parse time string (e.g., "14:30:00", "2:30 PM")
 */
function parseTime(timeStr: string): { hours: number; minutes: number; seconds: number } | null {
  // 24-hour format: 14:30:00 or 14:30
  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (match24) {
    return {
      hours: parseInt(match24[1]),
      minutes: parseInt(match24[2]),
      seconds: parseInt(match24[3] || '0'),
    }
  }

  // 12-hour format: 2:30 PM or 2:30:00 PM
  const match12 = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i)
  if (match12) {
    let hours = parseInt(match12[1])
    const isPM = match12[4].toUpperCase() === 'PM'

    if (isPM && hours !== 12) hours += 12
    if (!isPM && hours === 12) hours = 0

    return {
      hours,
      minutes: parseInt(match12[2]),
      seconds: parseInt(match12[3] || '0'),
    }
  }

  return null
}

/**
 * Parse duration strings
 * Formats: "01:30:00" (HH:MM:SS), "90:00" (MM:SS), "5400" (seconds)
 */
function parseDuration(value: string | null): number | null {
  if (!value) return null

  // Already a number (seconds)
  if (/^\d+$/.test(value)) {
    return parseInt(value)
  }

  // HH:MM:SS or MM:SS format
  const parts = value.split(':').map(p => parseInt(p))

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1]
  }

  return null
}

/**
 * Parse distance values
 * Garmin exports distance in the user's preferred unit (miles or km)
 * We always convert to meters for storage
 *
 * Note: Garmin Connect CSV exports distance without units in the value.
 * The unit depends on user's Garmin account settings.
 * We assume miles for US users (most common case) but this can be
 * configured if needed.
 */
function parseDistance(value: string | null, assumeMiles = true): number | null {
  if (!value) return null

  // Remove commas from thousands (e.g., "1,234" -> "1234")
  const cleaned = value.replace(/,/g, '')

  // Extract numeric part
  const numericMatch = cleaned.match(/^([\d.]+)/)
  if (!numericMatch) return null

  const numericValue = parseFloat(numericMatch[1])
  if (isNaN(numericValue)) return null

  // Check for explicit units in the string
  const lowerValue = value.toLowerCase()

  if (lowerValue.includes('mi') || lowerValue.includes('mile')) {
    // Miles to meters
    return Math.round(numericValue * 1609.344)
  } else if (lowerValue.includes('km') || lowerValue.includes('kilometer')) {
    // Kilometers to meters
    return Math.round(numericValue * 1000)
  } else if (lowerValue.includes('m') && !lowerValue.includes('mi')) {
    // Already in meters
    return Math.round(numericValue)
  }

  // No explicit unit - use assumption based on locale
  if (assumeMiles) {
    // Convert miles to meters
    return Math.round(numericValue * 1609.344)
  } else {
    // Convert kilometers to meters
    return Math.round(numericValue * 1000)
  }
}

/**
 * Parse speed or pace values
 * Speed: "5.5 mph", "8.8 km/h", or just "6.8" (assumes mph for US)
 * Pace: "10:30 /mi", "6:32 /km"
 * Returns meters per second
 */
function parseSpeed(speedStr: string | null, paceStr: string | null, assumeMph = true): number | null {
  // Try speed first
  if (speedStr) {
    const numericMatch = speedStr.match(/^([\d,.]+)/)
    if (numericMatch) {
      const value = parseFloat(numericMatch[1].replace(',', '.'))
      if (isNaN(value)) return null

      const lowerStr = speedStr.toLowerCase()

      if (lowerStr.includes('mph') || lowerStr.includes('mi/h')) {
        // Miles per hour to meters per second
        return value * 0.44704
      } else if (lowerStr.includes('km/h') || lowerStr.includes('kph')) {
        // Kilometers per hour to meters per second
        return value / 3.6
      } else if (lowerStr.includes('m/s')) {
        return value
      } else {
        // No explicit unit - use assumption
        if (assumeMph) {
          return value * 0.44704 // mph to m/s
        } else {
          return value / 3.6 // km/h to m/s
        }
      }
    }
  }

  // Try pace (time per distance unit)
  if (paceStr) {
    // Format: "10:30 /mi" or "6:32 /km" or "10:30"
    const paceMatch = paceStr.match(/(\d+):(\d+)/)
    if (paceMatch) {
      const minutes = parseInt(paceMatch[1])
      const seconds = parseInt(paceMatch[2])
      const totalSeconds = minutes * 60 + seconds

      if (totalSeconds === 0) return null

      const lowerStr = paceStr.toLowerCase()

      if (lowerStr.includes('mi')) {
        // Pace per mile - convert to m/s
        return 1609.344 / totalSeconds
      } else if (lowerStr.includes('km') || !lowerStr.includes('mi')) {
        // Pace per km (default) - convert to m/s
        return 1000 / totalSeconds
      }
    }
  }

  return null
}

/**
 * Parse a simple numeric value, handling various formats
 */
function parseNumber(value: string | null): number | null {
  if (!value) return null

  // Remove commas used as thousands separators (e.g., "1,234")
  const withoutThousands = value.replace(/,(\d{3})/g, '$1')

  // Remove any non-numeric characters except . and -
  const cleaned = withoutThousands.replace(/[^\d.\-]/g, '')

  const numericValue = parseFloat(cleaned)

  return isNaN(numericValue) ? null : Math.round(numericValue)
}

/**
 * Parse elevation values (assumes feet for US, converts to meters)
 */
function parseElevation(value: string | null, assumeFeet = true): number | null {
  if (!value) return null

  const numValue = parseNumber(value)
  if (numValue === null) return null

  const lowerValue = value.toLowerCase()

  // Check for explicit units
  if (lowerValue.includes('ft') || lowerValue.includes('feet')) {
    return Math.round(numValue * 0.3048) // feet to meters
  } else if (lowerValue.includes('m') && !lowerValue.includes('mi')) {
    return numValue // already meters
  }

  // No explicit unit - use assumption
  if (assumeFeet) {
    return Math.round(numValue * 0.3048) // feet to meters
  }

  return numValue // assume meters
}

/**
 * Validate that the CSV content looks like a Garmin export
 */
export function isGarminActivityCSV(csvContent: string): boolean {
  const firstLine = csvContent.split(/\r?\n/)[0]?.toLowerCase() || ''

  // Check for common Garmin activity column headers
  const garminIndicators = [
    'activity type',
    'activitätsart', // German
    'type d\'activité', // French
    'avg hr',
    'max hr',
    'elev gain',
    'elevation gain',
    'garmin',
  ]

  return garminIndicators.some(indicator => firstLine.includes(indicator))
}
