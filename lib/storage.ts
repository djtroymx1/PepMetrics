import type { Protocol, DoseLog } from './types'

// Normalize a date string into local YYYY-MM-DD (avoids UTC/day shifts)
function normalizeDateKey(value: string | undefined): string | undefined {
  if (!value) return value
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y || 0, (m || 1) - 1, d || 1)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

const STORAGE_KEYS = {
  PROTOCOLS: 'pepmetrics_protocols',
  DOSE_LOGS: 'pepmetrics_dose_logs',
  FASTING_START: 'pepmetrics_fasting_start',
} as const

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Check if we're in a browser environment
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

// Protocol storage functions
export function saveProtocols(protocols: Protocol[]): void {
  if (!isBrowser()) return
  localStorage.setItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(protocols))
}

export function getProtocols(): Protocol[] {
  if (!isBrowser()) return []
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROTOCOLS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addProtocol(protocol: Omit<Protocol, 'id' | 'createdAt' | 'updatedAt'>): Protocol {
  const protocols = getProtocols()
  const newProtocol: Protocol = {
    ...protocol,
    startDate: normalizeDateKey(protocol.startDate) || protocol.startDate,
    cycleStartDate: normalizeDateKey(protocol.cycleStartDate) || protocol.cycleStartDate,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  protocols.push(newProtocol)
  saveProtocols(protocols)
  return newProtocol
}

export function updateProtocol(id: string, updates: Partial<Protocol>): Protocol | null {
  const protocols = getProtocols()
  const index = protocols.findIndex(p => p.id === id)
  if (index === -1) return null

  const normalizedUpdates: Partial<Protocol> = {
    ...updates,
    startDate: normalizeDateKey(updates.startDate) || updates.startDate,
    cycleStartDate: normalizeDateKey(updates.cycleStartDate) || updates.cycleStartDate,
  }

  protocols[index] = {
    ...protocols[index],
    ...normalizedUpdates,
    updatedAt: new Date().toISOString(),
  }
  saveProtocols(protocols)
  return protocols[index]
}

export function deleteProtocol(id: string): boolean {
  const protocols = getProtocols()
  const filtered = protocols.filter(p => p.id !== id)
  if (filtered.length === protocols.length) return false
  saveProtocols(filtered)
  return true
}

export function getProtocolById(id: string): Protocol | undefined {
  const protocols = getProtocols()
  return protocols.find(p => p.id === id)
}

// Dose log storage functions
export function saveDoseLogs(logs: DoseLog[]): void {
  if (!isBrowser()) return
  // Only keep last 90 days of logs
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const recentLogs = logs.filter(log => {
    const logDate = new Date(log.scheduledFor)
    return logDate >= ninetyDaysAgo
  })

  localStorage.setItem(STORAGE_KEYS.DOSE_LOGS, JSON.stringify(recentLogs))
}

export function getDoseLogs(): DoseLog[] {
  if (!isBrowser()) return []
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOSE_LOGS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getDoseLogsByDateRange(startDate: Date, endDate: Date): DoseLog[] {
  const logs = getDoseLogs()
  const start = startDate.getTime()
  const end = endDate.getTime()

  return logs.filter(log => {
    const logTime = new Date(log.scheduledFor).getTime()
    return logTime >= start && logTime <= end
  })
}

export function addDoseLog(log: Omit<DoseLog, 'id'>): DoseLog {
  const logs = getDoseLogs()
  const newLog: DoseLog = {
    ...log,
    id: generateId(),
  }
  logs.push(newLog)
  saveDoseLogs(logs)
  return newLog
}

export function updateDoseLog(id: string, updates: Partial<DoseLog>): DoseLog | null {
  const logs = getDoseLogs()
  const index = logs.findIndex(l => l.id === id)
  if (index === -1) return null

  logs[index] = {
    ...logs[index],
    ...updates,
  }
  saveDoseLogs(logs)
  return logs[index]
}

export function markDoseAsTaken(
  protocolId: string,
  scheduledFor: string,
  doseNumber: number,
  peptideName: string,
  dose: string,
  notes?: string
): DoseLog {
  const logs = getDoseLogs()

  // Check if a log already exists for this dose
  const existingIndex = logs.findIndex(
    log =>
      log.protocolId === protocolId &&
      log.scheduledFor === scheduledFor &&
      log.doseNumber === doseNumber
  )

  const now = new Date().toISOString()

  if (existingIndex !== -1) {
    // Update existing log
    logs[existingIndex] = {
      ...logs[existingIndex],
      status: 'taken',
      takenAt: now,
      notes: notes || logs[existingIndex].notes,
    }
    saveDoseLogs(logs)
    return logs[existingIndex]
  }

  // Create new log
  const newLog: DoseLog = {
    id: generateId(),
    odId: generateId(),
    protocolId,
    peptideName,
    dose,
    doseNumber,
    scheduledFor,
    takenAt: now,
    status: 'taken',
    notes,
  }
  logs.push(newLog)
  saveDoseLogs(logs)
  return newLog
}

export function markDoseAsSkipped(
  protocolId: string,
  scheduledFor: string,
  doseNumber: number,
  peptideName: string,
  dose: string,
  notes?: string
): DoseLog {
  const logs = getDoseLogs()

  // Check if a log already exists for this dose
  const existingIndex = logs.findIndex(
    log =>
      log.protocolId === protocolId &&
      log.scheduledFor === scheduledFor &&
      log.doseNumber === doseNumber
  )

  if (existingIndex !== -1) {
    logs[existingIndex] = {
      ...logs[existingIndex],
      status: 'skipped',
      notes: notes || logs[existingIndex].notes,
    }
    saveDoseLogs(logs)
    return logs[existingIndex]
  }

  // Create new log
  const newLog: DoseLog = {
    id: generateId(),
    odId: generateId(),
    protocolId,
    peptideName,
    dose,
    doseNumber,
    scheduledFor,
    status: 'skipped',
    notes,
  }
  logs.push(newLog)
  saveDoseLogs(logs)
  return newLog
}

// Remove a logged dose entry (revert to pending/overdue in UI)
export function clearDoseLog(
  protocolId: string,
  scheduledFor: string,
  doseNumber: number
): boolean {
  const logs = getDoseLogs()
  const filtered = logs.filter(
    log =>
      !(
        log.protocolId === protocolId &&
        log.scheduledFor === scheduledFor &&
        log.doseNumber === doseNumber
      )
  )

  if (filtered.length === logs.length) return false
  saveDoseLogs(filtered)
  return true
}

// Fasting timer storage
export function saveFastingStart(timestamp: Date): void {
  if (!isBrowser()) return
  localStorage.setItem(STORAGE_KEYS.FASTING_START, timestamp.toISOString())
}

export function getFastingStart(): Date | null {
  if (!isBrowser()) return null
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FASTING_START)
    return data ? new Date(data) : null
  } catch {
    return null
  }
}

export function clearFastingStart(): void {
  if (!isBrowser()) return
  localStorage.removeItem(STORAGE_KEYS.FASTING_START)
}

// Get recent activity (last N dose logs)
export function getRecentActivity(limit: number = 7): DoseLog[] {
  const logs = getDoseLogs()
  return logs
    .filter(log => log.status === 'taken')
    .sort((a, b) => new Date(b.takenAt || b.scheduledFor).getTime() - new Date(a.takenAt || a.scheduledFor).getTime())
    .slice(0, limit)
}

// Clear all data (for testing/reset)
export function clearAllData(): void {
  if (!isBrowser()) return
  localStorage.removeItem(STORAGE_KEYS.PROTOCOLS)
  localStorage.removeItem(STORAGE_KEYS.DOSE_LOGS)
  localStorage.removeItem(STORAGE_KEYS.FASTING_START)
}
