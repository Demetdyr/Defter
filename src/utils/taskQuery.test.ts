import { describe, expect, it } from 'vitest'
import type { Task } from '../interfaces/Task'
import type { TaskQuery } from '../interfaces/TaskQuery'
import { countTasksByStatus, matchesQuery, selectVisibleTasks, summarizeTags } from './taskQuery'

function buildTask(overrides: Partial<Task>): Task {
  return {
    id: 'gorev',
    title: 'Görev',
    note: '',
    priority: 'normal',
    dueDate: null,
    tag: '',
    isCompleted: false,
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-01T09:00:00.000Z',
    ...overrides,
  }
}

const baseQuery: TaskQuery = { status: 'all', sortOrder: 'due', searchText: '', tag: null }

describe('matchesQuery', () => {
  it('Türkçe karakterlerde büyük küçük harf ayırmadan arar', () => {
    const task = buildTask({ title: 'İlaçları al' })
    expect(matchesQuery(task, { ...baseQuery, searchText: 'ilaç' })).toBe(true)
  })

  it('durum ve etiket filtresini birlikte uygular', () => {
    const task = buildTask({ tag: 'ev', isCompleted: true })
    expect(matchesQuery(task, { ...baseQuery, status: 'done', tag: 'ev' })).toBe(true)
    expect(matchesQuery(task, { ...baseQuery, status: 'open', tag: 'ev' })).toBe(false)
    expect(matchesQuery(task, { ...baseQuery, tag: 'okul' })).toBe(false)
  })
})

describe('selectVisibleTasks', () => {
  const tasks = [
    buildTask({ id: 'tarihsiz', priority: 'high' }),
    buildTask({ id: 'biten', dueDate: '2026-10-01', isCompleted: true }),
    buildTask({ id: 'yarin', dueDate: '2026-10-22', priority: 'low' }),
    buildTask({ id: 'bugun', dueDate: '2026-10-21' }),
  ]

  it('son tarihe göre sıralar, tarihsizleri ve bitenleri sona bırakır', () => {
    const visibleIds = selectVisibleTasks(tasks, baseQuery).map((task) => task.id)
    expect(visibleIds).toEqual(['bugun', 'yarin', 'tarihsiz', 'biten'])
  })

  it('önceliğe göre sıralar', () => {
    const visibleIds = selectVisibleTasks(tasks, { ...baseQuery, sortOrder: 'priority' }).map((task) => task.id)
    expect(visibleIds).toEqual(['tarihsiz', 'bugun', 'yarin', 'biten'])
  })
})

describe('özet fonksiyonları', () => {
  const tasks = [
    buildTask({ id: '1', tag: 'okul' }),
    buildTask({ id: '2', tag: 'okul', isCompleted: true }),
    buildTask({ id: '3', tag: 'ev' }),
    buildTask({ id: '4' }),
  ]

  it('durumlara göre görevleri sayar', () => {
    expect(countTasksByStatus(tasks)).toEqual({ all: 4, open: 3, done: 1 })
  })

  it('etiketleri alfabetik sırayla ve açık görev sayısıyla özetler', () => {
    expect(summarizeTags(tasks)).toEqual([
      { name: 'ev', openCount: 1, totalCount: 1 },
      { name: 'okul', openCount: 1, totalCount: 2 },
    ])
  })
})
