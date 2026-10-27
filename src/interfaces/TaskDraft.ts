import type { TaskPriority } from './Task'

export interface TaskDraft {
  title: string
  note: string
  priority: TaskPriority
  dueDate: string
  tag: string
}

export type TaskDraftField = keyof TaskDraft
