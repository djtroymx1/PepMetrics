// Protocol scheduling types
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type FrequencyType = 'daily' | 'specific-days' | 'every-x-days' | 'cycling'

export type TimingPreference =
  | 'morning-fasted'
  | 'morning-with-food'
  | 'afternoon'
  | 'evening'
  | 'before-bed'
  | 'any-time'

export type ProtocolStatus = 'active' | 'paused'

export type DoseLogStatus = 'pending' | 'taken' | 'skipped' | 'overdue'

export interface Protocol {
  id: string
  odId: string
  peptideId: string
  customPeptideName?: string
  dose: string
  vialSize?: number  // Vial size in mg

  // Scheduling
  frequencyType: FrequencyType
  specificDays?: DayOfWeek[]
  intervalDays?: number
  cycleOnDays?: number
  cycleOffDays?: number
  cycleStartDate?: string

  // Timing
  timingPreference: TimingPreference
  preferredTime?: string

  // Multi-dose tracking
  dosesPerDay: number

  // Status
  status: ProtocolStatus
  startDate: string

  createdAt: string
  updatedAt: string
}

export interface DoseLog {
  id: string
  odId: string
  protocolId: string
  peptideName: string
  dose: string
  doseNumber?: number
  scheduledFor: string
  takenAt?: string
  status: DoseLogStatus
  notes?: string
}

// Scheduled dose for display (computed from protocols)
export interface ScheduledDose {
  protocolId: string
  peptideId: string
  peptideName: string
  dose: string
  vialSize?: number  // Vial size in mg
  scheduledDate: string
  scheduledTime?: string
  timing: TimingPreference  // Alias for backward compat
  timingPreference: TimingPreference
  doseNumber: number
  dosesPerDay: number  // Total doses per day
  totalDoses: number  // Alias for dosesPerDay (backward compat)
  requiresFasting: boolean
  fastingNotes?: string
  fdaApproved?: boolean
  status: DoseLogStatus
  doseLogId?: string
}

// For the weekly overview display
export interface DaySchedule {
  date: string
  dayOfWeek: DayOfWeek
  doses: ScheduledDose[]
  isToday: boolean
  isPast: boolean
}

// Timing preference display info
export interface TimingInfo {
  label: string
  shortLabel: string
  icon: 'sunrise' | 'sun' | 'sunset' | 'moon' | 'clock'
  requiresFasting?: boolean
}

export const TIMING_INFO: Record<TimingPreference, TimingInfo> = {
  'morning-fasted': {
    label: 'Morning, fasted',
    shortLabel: 'AM fasted',
    icon: 'sunrise',
    requiresFasting: true,
  },
  'morning-with-food': {
    label: 'Morning, with food',
    shortLabel: 'AM fed',
    icon: 'sunrise',
  },
  'afternoon': {
    label: 'Afternoon',
    shortLabel: 'PM',
    icon: 'sun',
  },
  'evening': {
    label: 'Evening',
    shortLabel: 'Evening',
    icon: 'sunset',
  },
  'before-bed': {
    label: 'Before bed',
    shortLabel: 'Bedtime',
    icon: 'moon',
  },
  'any-time': {
    label: 'Any time',
    shortLabel: 'Anytime',
    icon: 'clock',
  },
}

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

export const DAY_OF_WEEK_SHORT: Record<DayOfWeek, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
}

export const FREQUENCY_TYPE_LABELS: Record<FrequencyType, string> = {
  'daily': 'Daily',
  'specific-days': 'Specific Days',
  'every-x-days': 'Every X Days',
  'cycling': 'Cycling (On/Off)',
}

// ============================================
// AI INSIGHTS TYPES
// ============================================

export type InsightType = 'correlation' | 'timing' | 'compliance' | 'anomaly' | 'trend'
export type InsightSeverity = 'info' | 'notable' | 'alert'
export type InsightConfidence = 'possible' | 'likely' | 'strong'

export interface Insight {
  type: InsightType
  severity: InsightSeverity
  title: string
  body: string
  metrics: string[]
  confidence: InsightConfidence
  data_points: Record<string, number | string>
}

export interface WeeklyInsightsResponse {
  insights: Insight[]
  weekly_summary: string
  recommendations: string[]
}

export interface WeeklyInsights {
  id: string
  userId: string
  weekStart: string
  weekEnd: string
  metricsSummary: Record<string, unknown>
  protocolSummary: Record<string, unknown>
  correlationData: CorrelationResult[]
  insights: Insight[]
  weeklySummary: string
  recommendations: string[]
  generatedAt: string
  modelVersion: string
  inputTokens?: number
  outputTokens?: number
}

// ============================================
// DATA ANALYSIS TYPES
// ============================================

export interface UserAnalysisData {
  activeProtocols: ProtocolSummary[]
  protocolChanges: ProtocolChange[]
  doseLogs: DoseLogEntry[]
  garminData: GarminDailySummary[]
  baselineMetrics: BaselineMetrics
  correlations: CorrelationResult[]
}

export interface ProtocolSummary {
  id: string
  name: string
  peptides: string[]
  startDate: string
  frequency: string
  status: string
}

export interface ProtocolChange {
  date: string
  type: 'started' | 'stopped' | 'paused' | 'resumed' | 'dose_adjusted'
  protocolName: string
  details?: string
}

export interface DoseLogEntry {
  date: string
  peptideName: string
  dose: string
  status: 'taken' | 'skipped' | 'pending' | 'overdue'
  takenAt?: string
  scheduledFor: string
  notes?: string
}

export interface GarminDailySummary {
  date: string
  sleep_score?: number
  sleep_duration_hours?: number
  deep_sleep_hours?: number
  light_sleep_hours?: number
  rem_sleep_hours?: number
  awake_hours?: number
  hrv_avg?: number
  resting_hr?: number
  stress_avg?: number
  body_battery_high?: number
  body_battery_low?: number
  steps?: number
  active_minutes?: number
  calories_total?: number
  calories_active?: number
  distance_meters?: number
}

export interface BaselineMetrics {
  hrv_avg: number
  hrv_std: number
  resting_hr_avg: number
  sleep_score_avg: number
  deep_sleep_avg: number
  stress_avg: number
  body_battery_avg: number
  steps_avg: number
}

export interface CorrelationResult {
  metric1: string
  metric2: string
  correlation: number
  lag_days: number
  significance: 'weak' | 'moderate' | 'strong'
  direction?: 'positive' | 'negative'
}

// ============================================
// GARMIN IMPORT TYPES
// ============================================

export interface GarminCSVParseResult {
  success: boolean
  activities: ParsedGarminActivity[]
  errors: ParseError[]
  summary: {
    totalRows: number
    validRows: number
    invalidRows: number
    dateRange: { start: Date; end: Date } | null
  }
}

export interface ParsedGarminActivity {
  activity_type: string
  activity_name: string | null
  start_time: string
  duration_seconds: number | null
  distance_meters: number | null
  calories: number | null
  avg_heart_rate: number | null
  max_heart_rate: number | null
  avg_speed_mps: number | null
  elevation_gain_meters: number | null
  raw_data: Record<string, string>
}

export interface ParseError {
  row: number
  field?: string
  message: string
}

export interface GarminImportResult {
  success: boolean
  recordsImported: number
  recordsSkipped: number
  recordsUpdated: number
  dateRange: { start: string; end: string } | null
  errors: string[]
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatContext {
  activeProtocols: ProtocolSummary[]
  recentDoses: DoseLogEntry[]
  garminSummary: GarminDailySummary[]
  latestInsights?: WeeklyInsights
}

// ============================================
// UI STATE TYPES
// ============================================

export type InsightsState = 'loading' | 'generating' | 'ready' | 'empty' | 'no-data' | 'error'

export interface InsightsPageState {
  state: InsightsState
  insights: WeeklyInsights | null
  error: string | null
}

// ============================================
// INSIGHT TYPE DISPLAY INFO
// ============================================

export const INSIGHT_TYPE_INFO: Record<InsightType, { label: string; icon: string; color: string }> = {
  correlation: {
    label: 'Correlation',
    icon: 'TrendingUp',
    color: 'text-blue-500',
  },
  timing: {
    label: 'Timing Optimization',
    icon: 'Clock',
    color: 'text-purple-500',
  },
  compliance: {
    label: 'Compliance',
    icon: 'CheckCircle',
    color: 'text-green-500',
  },
  anomaly: {
    label: 'Anomaly Alert',
    icon: 'AlertTriangle',
    color: 'text-amber-500',
  },
  trend: {
    label: 'Trend',
    icon: 'Activity',
    color: 'text-cyan-500',
  },
}

export const INSIGHT_SEVERITY_INFO: Record<InsightSeverity, { label: string; bgColor: string; textColor: string }> = {
  info: {
    label: 'Info',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
  },
  notable: {
    label: 'Notable',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
  },
  alert: {
    label: 'Alert',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
  },
}

export const INSIGHT_CONFIDENCE_INFO: Record<InsightConfidence, { label: string; description: string }> = {
  possible: {
    label: 'Possible',
    description: 'Early pattern detected, more data needed',
  },
  likely: {
    label: 'Likely',
    description: 'Consistent pattern observed',
  },
  strong: {
    label: 'Strong',
    description: 'High confidence correlation',
  },
}
