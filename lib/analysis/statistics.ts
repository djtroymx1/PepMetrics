/**
 * Statistical Analysis Module
 *
 * Provides statistical functions for analyzing correlations between
 * peptide dosing and health metrics.
 */

import type {
  DoseLogEntry,
  GarminDailySummary,
  BaselineMetrics,
  CorrelationResult,
} from '@/lib/types'

/**
 * Calculate correlations between dose logs and health metrics
 *
 * This performs basic time-lagged correlation analysis to identify
 * potential relationships between dosing events and metric changes.
 */
export function calculateCorrelations(
  doseLogs: DoseLogEntry[],
  garminData: GarminDailySummary[],
  baseline: BaselineMetrics
): CorrelationResult[] {
  const correlations: CorrelationResult[] = []

  if (doseLogs.length === 0 || garminData.length < 3) {
    return correlations
  }

  // Group doses by peptide
  const dosesByPeptide = groupDosesByPeptide(doseLogs)

  // Metrics to analyze
  const metrics: Array<{
    key: keyof GarminDailySummary
    name: string
    baselineKey: keyof BaselineMetrics
  }> = [
    { key: 'hrv_avg', name: 'HRV', baselineKey: 'hrv_avg' },
    { key: 'sleep_score', name: 'Sleep Score', baselineKey: 'sleep_score_avg' },
    { key: 'deep_sleep_hours', name: 'Deep Sleep', baselineKey: 'deep_sleep_avg' },
    { key: 'stress_avg', name: 'Stress', baselineKey: 'stress_avg' },
    { key: 'body_battery_high', name: 'Body Battery', baselineKey: 'body_battery_avg' },
    { key: 'resting_hr', name: 'Resting HR', baselineKey: 'resting_hr_avg' },
  ]

  // For each peptide, calculate correlations with each metric
  for (const [peptideName, doses] of Object.entries(dosesByPeptide)) {
    const doseDates = doses.map(d => d.date)

    for (const metric of metrics) {
      // Try different lag periods (0, 1, 2 days)
      for (const lagDays of [0, 1, 2]) {
        const correlation = calculateMetricCorrelation(
          doseDates,
          garminData,
          metric.key,
          baseline[metric.baselineKey],
          lagDays
        )

        if (correlation && Math.abs(correlation.correlation) >= 0.3) {
          correlations.push({
            metric1: peptideName,
            metric2: metric.name,
            correlation: correlation.correlation,
            lag_days: lagDays,
            significance: getSignificanceLevel(correlation.correlation),
            direction: correlation.correlation > 0 ? 'positive' : 'negative',
          })
        }
      }
    }
  }

  // Sort by absolute correlation strength
  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
}

/**
 * Group dose logs by peptide name
 */
function groupDosesByPeptide(doseLogs: DoseLogEntry[]): Record<string, DoseLogEntry[]> {
  const groups: Record<string, DoseLogEntry[]> = {}

  for (const log of doseLogs) {
    if (log.status !== 'taken') continue

    if (!groups[log.peptideName]) {
      groups[log.peptideName] = []
    }
    groups[log.peptideName].push(log)
  }

  return groups
}

/**
 * Calculate correlation between dose dates and metric values
 */
function calculateMetricCorrelation(
  doseDates: string[],
  garminData: GarminDailySummary[],
  metricKey: keyof GarminDailySummary,
  baselineValue: number,
  lagDays: number
): { correlation: number } | null {
  if (garminData.length < 3 || doseDates.length === 0) {
    return null
  }

  // Create a map of dates to metric values
  const metricByDate = new Map<string, number>()
  for (const day of garminData) {
    const value = day[metricKey]
    if (typeof value === 'number') {
      metricByDate.set(day.date, value)
    }
  }

  // For each dose date, get the lagged metric value
  const pairs: Array<{ doseDay: 0 | 1; metricValue: number }> = []

  for (const day of garminData) {
    // Check if there was a dose lagDays before this day
    const targetDate = new Date(day.date)
    targetDate.setDate(targetDate.getDate() - lagDays)
    const targetDateStr = targetDate.toISOString().split('T')[0]

    const wasDoseDay = doseDates.includes(targetDateStr) ? 1 : 0
    const metricValue = day[metricKey]

    if (typeof metricValue === 'number') {
      pairs.push({ doseDay: wasDoseDay as 0 | 1, metricValue })
    }
  }

  if (pairs.length < 3) {
    return null
  }

  // Calculate point-biserial correlation (for binary/continuous)
  const doseGroup = pairs.filter(p => p.doseDay === 1).map(p => p.metricValue)
  const noDoseGroup = pairs.filter(p => p.doseDay === 0).map(p => p.metricValue)

  if (doseGroup.length < 1 || noDoseGroup.length < 1) {
    return null
  }

  const doseMean = mean(doseGroup)
  const noDoseMean = mean(noDoseGroup)
  const overallStd = std(pairs.map(p => p.metricValue))

  if (overallStd === 0) {
    return null
  }

  // Simplified point-biserial correlation
  const n = pairs.length
  const n1 = doseGroup.length
  const n0 = noDoseGroup.length

  const correlation = ((doseMean - noDoseMean) / overallStd) * Math.sqrt((n1 * n0) / (n * n))

  return { correlation: Math.round(correlation * 100) / 100 }
}

/**
 * Get significance level based on correlation strength
 */
function getSignificanceLevel(correlation: number): 'weak' | 'moderate' | 'strong' {
  const abs = Math.abs(correlation)
  if (abs >= 0.7) return 'strong'
  if (abs >= 0.5) return 'moderate'
  return 'weak'
}

/**
 * Calculate mean of an array
 */
function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

/**
 * Calculate standard deviation
 */
function std(values: number[]): number {
  if (values.length < 2) return 0
  const m = mean(values)
  const squaredDiffs = values.map(v => Math.pow(v - m, 2))
  return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length)
}

/**
 * Detect outliers using the IQR method
 */
export function detectOutliers(values: number[]): {
  outliers: number[]
  lowerBound: number
  upperBound: number
} {
  if (values.length < 4) {
    return { outliers: [], lowerBound: 0, upperBound: 0 }
  }

  const sorted = [...values].sort((a, b) => a - b)
  const q1Index = Math.floor(sorted.length * 0.25)
  const q3Index = Math.floor(sorted.length * 0.75)

  const q1 = sorted[q1Index]
  const q3 = sorted[q3Index]
  const iqr = q3 - q1

  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  const outliers = values.filter(v => v < lowerBound || v > upperBound)

  return { outliers, lowerBound, upperBound }
}

/**
 * Calculate trend (simple linear regression slope)
 */
export function calculateTrend(values: number[]): {
  slope: number
  direction: 'improving' | 'declining' | 'stable'
  percentChange: number
} {
  if (values.length < 2) {
    return { slope: 0, direction: 'stable', percentChange: 0 }
  }

  // Simple linear regression
  const n = values.length
  const xMean = (n - 1) / 2
  const yMean = mean(values)

  let numerator = 0
  let denominator = 0

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean)
    denominator += Math.pow(i - xMean, 2)
  }

  const slope = denominator !== 0 ? numerator / denominator : 0

  // Calculate percent change from first to last
  const firstValue = values[0]
  const lastValue = values[values.length - 1]
  const percentChange = firstValue !== 0
    ? Math.round(((lastValue - firstValue) / Math.abs(firstValue)) * 100)
    : 0

  // Determine direction (5% threshold for "stable")
  let direction: 'improving' | 'declining' | 'stable' = 'stable'
  if (Math.abs(percentChange) > 5) {
    direction = percentChange > 0 ? 'improving' : 'declining'
  }

  return {
    slope: Math.round(slope * 1000) / 1000,
    direction,
    percentChange,
  }
}

/**
 * Calculate compliance rate from dose logs
 */
export function calculateComplianceRate(doseLogs: DoseLogEntry[]): {
  overall: number
  byPeptide: Record<string, { taken: number; total: number; rate: number }>
} {
  if (doseLogs.length === 0) {
    return { overall: 0, byPeptide: {} }
  }

  const byPeptide: Record<string, { taken: number; total: number; rate: number }> = {}

  for (const log of doseLogs) {
    if (!byPeptide[log.peptideName]) {
      byPeptide[log.peptideName] = { taken: 0, total: 0, rate: 0 }
    }

    byPeptide[log.peptideName].total++
    if (log.status === 'taken') {
      byPeptide[log.peptideName].taken++
    }
  }

  // Calculate rates
  let totalTaken = 0
  let totalDoses = 0

  for (const peptide of Object.values(byPeptide)) {
    peptide.rate = Math.round((peptide.taken / peptide.total) * 100)
    totalTaken += peptide.taken
    totalDoses += peptide.total
  }

  const overall = totalDoses > 0 ? Math.round((totalTaken / totalDoses) * 100) : 0

  return { overall, byPeptide }
}

/**
 * Compare current week metrics to baseline
 */
export function compareToBaseline(
  currentData: GarminDailySummary[],
  baseline: BaselineMetrics
): Record<string, { current: number; baseline: number; percentChange: number; improved: boolean }> {
  const comparisons: Record<string, { current: number; baseline: number; percentChange: number; improved: boolean }> = {}

  const currentMetrics = {
    hrv_avg: mean(currentData.map(d => d.hrv_avg).filter((v): v is number => v !== undefined)),
    resting_hr: mean(currentData.map(d => d.resting_hr).filter((v): v is number => v !== undefined)),
    sleep_score: mean(currentData.map(d => d.sleep_score).filter((v): v is number => v !== undefined)),
    deep_sleep: mean(currentData.map(d => d.deep_sleep_hours).filter((v): v is number => v !== undefined)),
    stress: mean(currentData.map(d => d.stress_avg).filter((v): v is number => v !== undefined)),
    body_battery: mean(currentData.map(d => d.body_battery_high).filter((v): v is number => v !== undefined)),
    steps: mean(currentData.map(d => d.steps).filter((v): v is number => v !== undefined)),
  }

  // Metrics where higher is better
  const higherIsBetter = ['hrv_avg', 'sleep_score', 'deep_sleep', 'body_battery', 'steps']
  // Metrics where lower is better
  const lowerIsBetter = ['resting_hr', 'stress']

  const metricMappings: Array<{
    key: keyof typeof currentMetrics
    baselineKey: keyof BaselineMetrics
    name: string
  }> = [
    { key: 'hrv_avg', baselineKey: 'hrv_avg', name: 'HRV' },
    { key: 'resting_hr', baselineKey: 'resting_hr_avg', name: 'Resting HR' },
    { key: 'sleep_score', baselineKey: 'sleep_score_avg', name: 'Sleep Score' },
    { key: 'deep_sleep', baselineKey: 'deep_sleep_avg', name: 'Deep Sleep' },
    { key: 'stress', baselineKey: 'stress_avg', name: 'Stress' },
    { key: 'body_battery', baselineKey: 'body_battery_avg', name: 'Body Battery' },
    { key: 'steps', baselineKey: 'steps_avg', name: 'Steps' },
  ]

  for (const metric of metricMappings) {
    const current = currentMetrics[metric.key]
    const baselineValue = baseline[metric.baselineKey]

    if (current > 0 && baselineValue > 0) {
      const percentChange = Math.round(((current - baselineValue) / baselineValue) * 100)

      let improved = false
      if (higherIsBetter.includes(metric.key)) {
        improved = percentChange > 0
      } else if (lowerIsBetter.includes(metric.key)) {
        improved = percentChange < 0
      }

      comparisons[metric.name] = {
        current: Math.round(current * 10) / 10,
        baseline: Math.round(baselineValue * 10) / 10,
        percentChange,
        improved,
      }
    }
  }

  return comparisons
}
