import { daysBetween, formatDayMonth, formatWeekday, parseDateKey } from './dateUtils'

export type DueDateTone = 'overdue' | 'soon' | 'later'

export interface DueDateLabel {
  text: string
  tone: DueDateTone
}

export function describeDueDate(dueDate: string, today: Date): DueDateLabel {
  const dueDay = parseDateKey(dueDate)
  const dayDifference = daysBetween(today, dueDay)

  if (dayDifference < -1) {
    return { text: `${Math.abs(dayDifference)} gün gecikti`, tone: 'overdue' }
  }
  if (dayDifference === -1) {
    return { text: 'Dün bitmeliydi', tone: 'overdue' }
  }
  if (dayDifference === 0) {
    return { text: 'Bugün', tone: 'soon' }
  }
  if (dayDifference === 1) {
    return { text: 'Yarın', tone: 'soon' }
  }
  if (dayDifference < 7) {
    return { text: formatWeekday(dueDay), tone: 'later' }
  }
  return { text: formatDayMonth(dueDay), tone: 'later' }
}
