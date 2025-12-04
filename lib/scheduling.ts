import type { Protocol, DoseLog, ScheduledDose, DayOfWeek, DaySchedule } from './types'
import { getPeptideById, getStackById } from './data/peptides'

// Helper to get day of week from date
function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()] as DayOfWeek
}

// Helper to normalize date to start of day
function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// Helper to add days to a date
function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

// Helper to format date as ISO date string (YYYY-MM-DD)
function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Shared scheduler to decide if a protocol should dose on a specific date
function shouldDoseOnDate(protocol: Protocol, checkDate: Date): boolean {
  const startDate = startOfDay(new Date(protocol.startDate))
  if (checkDate < startDate) return false

  switch (protocol.frequencyType) {
    case 'daily':
      return true
    case 'specific-days':
      return protocol.specificDays?.includes(getDayOfWeek(checkDate)) || false
    case 'every-x-days': {
      const daysSinceStart = Math.floor((checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysSinceStart >= 0 && daysSinceStart % (protocol.intervalDays || 1) === 0
    }
    case 'cycling': {
      const cycleStartDate = startOfDay(new Date(protocol.cycleStartDate || protocol.startDate))
      const onDays = protocol.cycleOnDays || 5
      const offDays = protocol.cycleOffDays || 2
      const cycleLength = onDays + offDays
      const daysSinceCycle = Math.floor((checkDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysSinceCycle >= 0 && (daysSinceCycle % cycleLength) < onDays
    }
    default:
      return false
  }
}

// Calculate the next dose date based on protocol settings
export function getNextDoseDate(protocol: Protocol, lastDoseDate?: Date): Date {
  const today = startOfDay(new Date())
  const startDate = startOfDay(new Date(protocol.startDate))

  // If there's a last dose, calculate from there
  const baseDate = lastDoseDate ? startOfDay(lastDoseDate) : startDate

  switch (protocol.frequencyType) {
    case 'daily':
      // Next day after last dose, or today if no last dose
      if (lastDoseDate) {
        return addDays(baseDate, 1)
      }
      return today >= startDate ? today : startDate

    case 'specific-days':
      if (!protocol.specificDays || protocol.specificDays.length === 0) {
        return today
      }
      // Find next occurrence of a specific day
      let checkDate = lastDoseDate ? addDays(baseDate, 1) : (today >= startDate ? today : startDate)
      for (let i = 0; i < 8; i++) {
        const dayOfWeek = getDayOfWeek(checkDate)
        if (protocol.specificDays.includes(dayOfWeek)) {
          return checkDate
        }
        checkDate = addDays(checkDate, 1)
      }
      return checkDate

    case 'every-x-days':
      const interval = protocol.intervalDays || 1
      if (lastDoseDate) {
        return addDays(baseDate, interval)
      }
      // Calculate based on start date
      const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const daysUntilNext = interval - (daysSinceStart % interval)
      if (daysUntilNext === interval && daysSinceStart >= 0) {
        return today
      }
      return addDays(today, daysUntilNext % interval)

    case 'cycling':
      const cyclePhase = getCyclePhase(protocol)
      if (cyclePhase === 'off') {
        // Find start of next "on" phase
        const cycleLength = (protocol.cycleOnDays || 5) + (protocol.cycleOffDays || 2)
        const cycleStart = new Date(protocol.cycleStartDate || protocol.startDate)
        const daysSinceCycleStart = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24))
        const currentCycleDay = daysSinceCycleStart % cycleLength
        const daysUntilOnPhase = cycleLength - currentCycleDay
        return addDays(today, daysUntilOnPhase)
      }
      // In "on" phase - next day or today
      if (lastDoseDate) {
        return addDays(baseDate, 1)
      }
      return today >= startDate ? today : startDate

    default:
      return today
  }
}

// Check if a protocol is due today
export function isDueToday(protocol: Protocol, doseHistory: DoseLog[]): boolean {
  if (protocol.status !== 'active') return false

  const today = startOfDay(new Date())
  const todayStr = toISODateString(today)

  // Check if already taken today
  const takenToday = doseHistory.filter(log =>
    log.protocolId === protocol.id &&
    log.status === 'taken' &&
    log.scheduledFor.startsWith(todayStr)
  )

  // Check if all doses for today are taken
  if (takenToday.length >= protocol.dosesPerDay) {
    return false
  }

  // Check if today is a valid dose day
  switch (protocol.frequencyType) {
    case 'daily':
      return true

    case 'specific-days':
      const dayOfWeek = getDayOfWeek(today)
      return protocol.specificDays?.includes(dayOfWeek) || false

    case 'every-x-days':
      const startDate = startOfDay(new Date(protocol.startDate))
      const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysSinceStart >= 0 && daysSinceStart % (protocol.intervalDays || 1) === 0

    case 'cycling':
      return getCyclePhase(protocol) === 'on'

    default:
      return false
  }
}

// Check if a dose is overdue
export function isOverdue(protocol: Protocol, doseHistory: DoseLog[]): boolean {
  if (protocol.status !== 'active') return false

  const today = startOfDay(new Date())
  const startDate = startOfDay(new Date(protocol.startDate))

  if (today < startDate) return false

  // Find the last taken dose
  const sortedHistory = [...doseHistory]
    .filter(log => log.protocolId === protocol.id && log.status === 'taken')
    .sort((a, b) => new Date(b.takenAt || b.scheduledFor).getTime() - new Date(a.takenAt || a.scheduledFor).getTime())

  const lastTakenDate = sortedHistory[0]
    ? startOfDay(new Date(sortedHistory[0].takenAt || sortedHistory[0].scheduledFor))
    : null

  // Calculate when the next dose should have been
  const nextDoseDate = getNextDoseDate(protocol, lastTakenDate || undefined)

  // If next dose date is in the past, it's overdue
  return nextDoseDate < today
}

// For cycling protocols, determine if currently in "on" or "off" phase
export function getCyclePhase(protocol: Protocol): 'on' | 'off' {
  if (protocol.frequencyType !== 'cycling') return 'on'

  const cycleStart = startOfDay(new Date(protocol.cycleStartDate || protocol.startDate))
  const today = startOfDay(new Date())
  const onDays = protocol.cycleOnDays || 5
  const offDays = protocol.cycleOffDays || 2
  const cycleLength = onDays + offDays

  const daysSinceCycleStart = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSinceCycleStart < 0) return 'on' // Before start, treat as on

  const currentCycleDay = daysSinceCycleStart % cycleLength

  return currentCycleDay < onDays ? 'on' : 'off'
}

// Generate upcoming doses for the next X days (for calendar view)
export function getUpcomingDoses(protocols: Protocol[], doseHistory: DoseLog[], days: number = 7): ScheduledDose[] {
  const today = startOfDay(new Date())
  const scheduledDoses: ScheduledDose[] = []

  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    const checkDate = addDays(today, dayOffset)
    const checkDateStr = toISODateString(checkDate)

    for (const protocol of protocols) {
      if (protocol.status !== 'active') continue

      const startDate = startOfDay(new Date(protocol.startDate))
      if (checkDate < startDate) continue

      if (shouldDoseOnDate(protocol, checkDate)) {
        // Check both peptides and stacks
        const peptide = getPeptideById(protocol.peptideId)
        const stack = !peptide ? getStackById(protocol.peptideId) : null

        const peptideName = protocol.customPeptideName || peptide?.name || stack?.name || 'Unknown Peptide'
        const requiresFasting = peptide?.fastingRequired || stack?.fastingRequired || false
        const fastingNotes = peptide?.fastingNotes
        const fdaApproved = peptide?.fdaApproved || false

        for (let doseNum = 1; doseNum <= protocol.dosesPerDay; doseNum++) {
          // Check if this dose was already logged
          const existingLog = doseHistory.find(log =>
            log.protocolId === protocol.id &&
            log.scheduledFor.startsWith(checkDateStr) &&
            log.doseNumber === doseNum
          )

          let status: ScheduledDose['status'] = 'pending'
          if (existingLog) {
            status = existingLog.status
          } else if (checkDate < today) {
            status = 'overdue'
          }

          scheduledDoses.push({
            protocolId: protocol.id,
            peptideId: protocol.peptideId,
            peptideName,
            dose: protocol.dose,
            vialSize: protocol.vialSize,
            scheduledDate: checkDateStr,
            scheduledTime: protocol.preferredTime,
            timing: protocol.timingPreference,
            timingPreference: protocol.timingPreference,
            doseNumber: doseNum,
            dosesPerDay: protocol.dosesPerDay,
            totalDoses: protocol.dosesPerDay,
            requiresFasting,
            fastingNotes,
            fdaApproved,
            status,
            doseLogId: existingLog?.id,
          })
        }
      }
    }
  }

  return scheduledDoses.sort((a, b) => {
    if (a.scheduledDate !== b.scheduledDate) {
      return a.scheduledDate.localeCompare(b.scheduledDate)
    }
    return a.doseNumber - b.doseNumber
  })
}

// Get doses due today
export function getDosesToday(protocols: Protocol[], doseHistory: DoseLog[]): ScheduledDose[] {
  return getUpcomingDoses(protocols, doseHistory, 1)
}

// Get scheduled doses for an arbitrary date range (inclusive)
export function getDosesForRange(
  protocols: Protocol[],
  doseHistory: DoseLog[],
  startDate: Date,
  endDate: Date
): ScheduledDose[] {
  const start = startOfDay(startDate)
  const end = startOfDay(endDate)
  const today = startOfDay(new Date())

  // Safety cap to avoid accidentally iterating massive ranges
  const maxSpanDays = 366
  const spanDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (spanDays > maxSpanDays) {
    console.warn('getDosesForRange: limiting span to', maxSpanDays, 'days')
    end.setTime(start.getTime() + maxSpanDays * 24 * 60 * 60 * 1000)
  }

  const scheduled: ScheduledDose[] = []
  for (
    let cursor = new Date(start);
    cursor.getTime() <= end.getTime();
    cursor = addDays(cursor, 1)
  ) {
    const checkDateStr = toISODateString(cursor)

    for (const protocol of protocols) {
      if (protocol.status !== 'active') continue
      if (!shouldDoseOnDate(protocol, cursor)) continue

      const peptide = getPeptideById(protocol.peptideId)
      const stack = !peptide ? getStackById(protocol.peptideId) : null

      const peptideName = protocol.customPeptideName || peptide?.name || stack?.name || 'Unknown Peptide'
      const requiresFasting = peptide?.fastingRequired || stack?.fastingRequired || false
      const fastingNotes = peptide?.fastingNotes
      const fdaApproved = peptide?.fdaApproved || false

      for (let doseNum = 1; doseNum <= protocol.dosesPerDay; doseNum++) {
        const existingLog = doseHistory.find(log =>
          log.protocolId === protocol.id &&
          log.scheduledFor.startsWith(checkDateStr) &&
          log.doseNumber === doseNum
        )

        let status: ScheduledDose['status'] = 'pending'
        if (existingLog) {
          status = existingLog.status
        } else if (cursor < today) {
          status = 'overdue'
        }

        scheduled.push({
          protocolId: protocol.id,
          peptideId: protocol.peptideId,
          peptideName,
          dose: protocol.dose,
          vialSize: protocol.vialSize,
          scheduledDate: checkDateStr,
          scheduledTime: protocol.preferredTime,
          timing: protocol.timingPreference,
          timingPreference: protocol.timingPreference,
          doseNumber: doseNum,
          dosesPerDay: protocol.dosesPerDay,
          totalDoses: protocol.dosesPerDay,
          requiresFasting,
          fastingNotes,
          fdaApproved,
          status,
          doseLogId: existingLog?.id,
        })
      }
    }
  }

  return scheduled.sort((a, b) => {
    if (a.scheduledDate !== b.scheduledDate) {
      return a.scheduledDate.localeCompare(b.scheduledDate)
    }
    return a.doseNumber - b.doseNumber
  })
}

// Get overdue doses
export function getOverdueDoses(protocols: Protocol[], doseHistory: DoseLog[]): ScheduledDose[] {
  const today = startOfDay(new Date())
  const allDoses = getUpcomingDoses(protocols, doseHistory, 30) // Look back 30 days

  return allDoses.filter(dose => {
    const doseDate = startOfDay(new Date(dose.scheduledDate))
    return doseDate < today && dose.status !== 'taken' && dose.status !== 'skipped'
  })
}

// Get weekly schedule (7 days starting from today)
export function getWeeklySchedule(protocols: Protocol[], doseHistory: DoseLog[]): DaySchedule[] {
  const today = startOfDay(new Date())
  const todayStr = toISODateString(today)
  const allDoses = getUpcomingDoses(protocols, doseHistory, 7)

  const schedule: DaySchedule[] = []

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i)
    const dateStr = toISODateString(date)
    const dayOfWeek = getDayOfWeek(date)

    schedule.push({
      date: dateStr,
      dayOfWeek,
      doses: allDoses.filter(dose => dose.scheduledDate === dateStr),
      isToday: dateStr === todayStr,
      isPast: date < today,
    })
  }

  return schedule
}

// Get frequency summary text
export function getFrequencySummary(protocol: Protocol): string {
  switch (protocol.frequencyType) {
    case 'daily':
      return 'Daily'
    case 'specific-days':
      if (!protocol.specificDays || protocol.specificDays.length === 0) {
        return 'No days selected'
      }
      if (protocol.specificDays.length === 7) {
        return 'Daily'
      }
      const shortDays = protocol.specificDays.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3))
      return shortDays.join(', ')
    case 'every-x-days':
      const interval = protocol.intervalDays || 1
      if (interval === 1) return 'Daily'
      if (interval === 2) return 'Every other day'
      if (interval === 7) return 'Weekly'
      if (interval === 14) return 'Bi-weekly'
      return `Every ${interval} days`
    case 'cycling':
      const onDays = protocol.cycleOnDays || 5
      const offDays = protocol.cycleOffDays || 2
      return `${onDays} on / ${offDays} off`
    default:
      return 'Unknown'
  }
}
