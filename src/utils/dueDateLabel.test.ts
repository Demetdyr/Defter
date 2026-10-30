import { describe, expect, it } from 'vitest'
import { describeDueDate } from './dueDateLabel'

const today = new Date(2026, 9, 21, 15, 30)

describe('describeDueDate', () => {
  it('bugünü ve yarını adıyla gösterir', () => {
    expect(describeDueDate('2026-10-21', today)).toEqual({ text: 'Bugün', tone: 'soon' })
    expect(describeDueDate('2026-10-22', today)).toEqual({ text: 'Yarın', tone: 'soon' })
  })

  it('geciken görevleri gün sayısıyla belirtir', () => {
    expect(describeDueDate('2026-10-20', today)).toEqual({ text: 'Dün bitmeliydi', tone: 'overdue' })
    expect(describeDueDate('2026-10-17', today)).toEqual({ text: '4 gün gecikti', tone: 'overdue' })
  })

  it('bir hafta içindeki tarihleri gün adıyla, sonrasını tarihle gösterir', () => {
    expect(describeDueDate('2026-10-23', today)).toEqual({ text: 'Cuma', tone: 'later' })
    expect(describeDueDate('2026-11-12', today)).toEqual({ text: '12 Kasım', tone: 'later' })
  })
})
