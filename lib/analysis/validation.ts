/**
 * Data Validation Module
 *
 * Validates that users have sufficient data for meaningful AI analysis.
 */

import type {
  UserAnalysisData,
  GarminDailySummary,
  DoseLogEntry,
} from '@/lib/types'

export interface DataValidationResult {
  isValid: boolean
  hasMinimumData: boolean
  missingData: string[]
  warnings: string[]
  dataQuality: 'excellent' | 'good' | 'fair' | 'insufficient'
  stats: {
    daysOfGarminData: number
    daysOfDoseLogs: number
    activeProtocols: number
    completenessScore: number
  }
}

// Minimum requirements for analysis
const MIN_GARMIN_DAYS = 7
const MIN_DOSE_LOGS = 3
const MIN_BASELINE_DAYS = 14
const IDEAL_GARMIN_DAYS = 14
const IDEAL_BASELINE_DAYS = 28

/**
 * Validate that user has sufficient data for AI analysis
 */
export function validateDataSufficiency(data: UserAnalysisData): DataValidationResult {
  const missingData: string[] = []
  const warnings: string[] = []

  // Count days of data
  const garminDays = data.garminData.length
  const doseDays = new Set(data.doseLogs.map(d => d.date)).size
  const baselineDays = countNonEmptyBaselineDays(data.baselineMetrics)

  // Check minimum requirements
  if (garminDays < MIN_GARMIN_DAYS) {
    missingData.push(`At least ${MIN_GARMIN_DAYS} days of Garmin data (you have ${garminDays})`)
  }

  if (data.doseLogs.length < MIN_DOSE_LOGS) {
    missingData.push(`At least ${MIN_DOSE_LOGS} logged doses (you have ${data.doseLogs.length})`)
  }

  if (data.activeProtocols.length === 0) {
    missingData.push('At least one active protocol')
  }

  // Check for warnings (suboptimal but usable)
  if (garminDays < IDEAL_GARMIN_DAYS && garminDays >= MIN_GARMIN_DAYS) {
    warnings.push(`More Garmin data would improve accuracy (${garminDays}/${IDEAL_GARMIN_DAYS} days)`)
  }

  if (baselineDays < MIN_BASELINE_DAYS) {
    warnings.push('Limited baseline data - comparisons may be less accurate')
  }

  // Check data completeness
  const completeness = calculateDataCompleteness(data.garminData)
  if (completeness < 0.7) {
    warnings.push('Some Garmin metrics are incomplete for the analysis period')
  }

  // Calculate overall quality
  const dataQuality = calculateDataQuality(garminDays, doseDays, baselineDays, completeness)

  const hasMinimumData = missingData.length === 0
  const isValid = hasMinimumData && dataQuality !== 'insufficient'

  return {
    isValid,
    hasMinimumData,
    missingData,
    warnings,
    dataQuality,
    stats: {
      daysOfGarminData: garminDays,
      daysOfDoseLogs: doseDays,
      activeProtocols: data.activeProtocols.length,
      completenessScore: Math.round(completeness * 100),
    },
  }
}

/**
 * Count how many baseline metrics have non-zero values
 */
function countNonEmptyBaselineDays(baseline: UserAnalysisData['baselineMetrics']): number {
  // Estimate baseline days based on which metrics have values
  const hasData = [
    baseline.hrv_avg > 0,
    baseline.resting_hr_avg > 0,
    baseline.sleep_score_avg > 0,
    baseline.stress_avg > 0,
    baseline.body_battery_avg > 0,
    baseline.steps_avg > 0,
  ].filter(Boolean).length

  // If most metrics have values, assume we have reasonable baseline
  if (hasData >= 4) return 28
  if (hasData >= 2) return 14
  return 0
}

/**
 * Calculate how complete the Garmin data is
 * (what percentage of key metrics are present)
 */
function calculateDataCompleteness(garminData: GarminDailySummary[]): number {
  if (garminData.length === 0) return 0

  const keyMetrics: (keyof GarminDailySummary)[] = [
    'hrv_avg',
    'sleep_score',
    'stress_avg',
    'body_battery_high',
    'resting_hr',
    'steps',
  ]

  let totalFields = 0
  let presentFields = 0

  for (const day of garminData) {
    for (const metric of keyMetrics) {
      totalFields++
      if (day[metric] !== undefined && day[metric] !== null) {
        presentFields++
      }
    }
  }

  return totalFields > 0 ? presentFields / totalFields : 0
}

/**
 * Calculate overall data quality rating
 */
function calculateDataQuality(
  garminDays: number,
  doseDays: number,
  baselineDays: number,
  completeness: number
): 'excellent' | 'good' | 'fair' | 'insufficient' {
  // Score each dimension
  const garminScore = Math.min(garminDays / IDEAL_GARMIN_DAYS, 1)
  const doseScore = Math.min(doseDays / 7, 1)
  const baselineScore = Math.min(baselineDays / IDEAL_BASELINE_DAYS, 1)
  const completenessScore = completeness

  const overallScore = (garminScore * 0.3 + doseScore * 0.2 + baselineScore * 0.3 + completenessScore * 0.2)

  if (overallScore >= 0.9) return 'excellent'
  if (overallScore >= 0.7) return 'good'
  if (overallScore >= 0.5) return 'fair'
  return 'insufficient'
}

/**
 * Check if user has enough recent data for a weekly analysis
 */
export function canGenerateWeeklyAnalysis(
  garminData: GarminDailySummary[],
  doseLogs: DoseLogEntry[],
  protocolCount: number
): { canGenerate: boolean; reason?: string } {
  if (protocolCount === 0) {
    return { canGenerate: false, reason: 'No active protocols found' }
  }

  if (garminData.length < 3) {
    return { canGenerate: false, reason: 'Need at least 3 days of Garmin data' }
  }

  if (doseLogs.length === 0) {
    return { canGenerate: false, reason: 'No dose logs found for the analysis period' }
  }

  return { canGenerate: true }
}

/**
 * Get user-friendly messages for the validation state
 */
export function getValidationMessages(result: DataValidationResult): {
  title: string
  description: string
  actionItems: string[]
} {
  if (result.isValid && result.dataQuality === 'excellent') {
    return {
      title: 'Ready for Analysis',
      description: 'You have excellent data coverage. AI insights will be highly accurate.',
      actionItems: [],
    }
  }

  if (result.isValid && result.dataQuality === 'good') {
    return {
      title: 'Ready for Analysis',
      description: 'You have good data coverage. AI insights should be reliable.',
      actionItems: result.warnings,
    }
  }

  if (result.isValid && result.dataQuality === 'fair') {
    return {
      title: 'Limited Data Available',
      description: 'Analysis is possible but insights may be less accurate.',
      actionItems: result.warnings,
    }
  }

  // Not valid
  return {
    title: 'More Data Needed',
    description: 'Please add more data before generating insights.',
    actionItems: result.missingData,
  }
}
