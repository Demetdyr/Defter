const MILLISECONDS_PER_DAY = 86_400_000

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isDateKey(value: string): boolean {
  return DATE_KEY_PATTERN.test(value)
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(dateKey: string): Date {
  const [year = 1970, month = 1, day = 1] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function shiftDate(date: Date, dayOffset: number): Date {
  const shiftedDate = new Date(date)
  shiftedDate.setDate(shiftedDate.getDate() + dayOffset)
  return shiftedDate
}

export function daysBetween(fromDate: Date, toDate: Date): number {
  const fromMidnight = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())
  const toMidnight = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())
  return Math.round((toMidnight.getTime() - fromMidnight.getTime()) / MILLISECONDS_PER_DAY)
}

const numericDateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const weekdayFormatter = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' })

const dayMonthFormatter = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' })

const fullTimestampFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatNumericDate(date: Date): string {
  return numericDateFormatter.format(date)
}

export function formatWeekday(date: Date): string {
  return weekdayFormatter.format(date)
}

export function formatDayMonth(date: Date): string {
  return dayMonthFormatter.format(date)
}

export function formatTimestamp(isoTimestamp: string): string {
  return fullTimestampFormatter.format(new Date(isoTimestamp))
}
