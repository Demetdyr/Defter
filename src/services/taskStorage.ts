import { createSampleTasks } from '../data/sampleTasks'
import type { Task, TaskPriority } from '../interfaces/Task'
import { isDateKey } from '../utils/dateUtils'

export const TASKS_STORAGE_KEY = 'defter.tasks.v1'

const knownPriorities: TaskPriority[] = ['low', 'normal', 'high']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStoredTask(value: unknown): value is Task {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.note === 'string' &&
    knownPriorities.includes(value.priority as TaskPriority) &&
    (value.dueDate === null || (typeof value.dueDate === 'string' && isDateKey(value.dueDate))) &&
    typeof value.tag === 'string' &&
    typeof value.isCompleted === 'boolean' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  )
}

export function parseStoredTasks(storedValue: string | null): Task[] | null {
  if (storedValue === null) return null
  try {
    const parsedValue: unknown = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue.filter(isStoredTask) : []
  } catch {
    return []
  }
}

function readStoredValue(): string | null {
  try {
    return window.localStorage.getItem(TASKS_STORAGE_KEY)
  } catch {
    return null
  }
}

export function loadTasks(): Task[] {
  return parseStoredTasks(readStoredValue()) ?? createSampleTasks(new Date())
}

export function saveTasks(tasks: Task[]): boolean {
  try {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}
