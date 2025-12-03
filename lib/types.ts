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
  scheduledDate: string
  scheduledTime?: string
  timingPreference: TimingPreference
  doseNumber: number
  totalDoses: number
  requiresFasting: boolean
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
