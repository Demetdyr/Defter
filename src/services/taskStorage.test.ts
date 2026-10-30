import { describe, expect, it } from 'vitest'
import { parseStoredTasks } from './taskStorage'

const validTask = {
  id: 'a1',
  title: 'Faturayı öde',
  note: '',
  priority: 'high',
  dueDate: '2026-10-21',
  tag: 'ev',
  isCompleted: false,
  createdAt: '2026-10-20T08:00:00.000Z',
  updatedAt: '2026-10-20T08:00:00.000Z',
}

describe('parseStoredTasks', () => {
  it('kayıt yoksa null döner, böylece örnek görevler yüklenir', () => {
    expect(parseStoredTasks(null)).toBeNull()
  })

  it('bozuk JSON verisinde boş liste döner', () => {
    expect(parseStoredTasks('{bozuk')).toEqual([])
  })

  it('geçersiz kayıtları ayıklar', () => {
    const storedValue = JSON.stringify([validTask, { ...validTask, id: 'a2', priority: 'acil' }, 'metin'])
    expect(parseStoredTasks(storedValue)).toEqual([validTask])
  })
})
