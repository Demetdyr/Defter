import type { Task, TaskChanges, TaskPriority } from '../interfaces/Task'
import type { TaskDraft } from '../interfaces/TaskDraft'

export const TITLE_MAX_LENGTH = 120
export const NOTE_MAX_LENGTH = 500
export const TAG_MAX_LENGTH = 24

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Düşük',
  normal: 'Normal',
  high: 'Yüksek',
}

export const priorityOptions: TaskPriority[] = ['low', 'normal', 'high']

export function createEmptyDraft(): TaskDraft {
  return { title: '', note: '', priority: 'normal', dueDate: '', tag: '' }
}

export function taskToDraft(task: Task): TaskDraft {
  return {
    title: task.title,
    note: task.note,
    priority: task.priority,
    dueDate: task.dueDate ?? '',
    tag: task.tag,
  }
}

export function normalizeTag(rawTag: string): string {
  return rawTag
    .trim()
    .replace(/^#+/, '')
    .replace(/\s+/g, '-')
    .toLocaleLowerCase('tr-TR')
    .slice(0, TAG_MAX_LENGTH)
}

export function draftToTaskFields(draft: TaskDraft): Required<Omit<TaskChanges, 'isCompleted'>> {
  return {
    title: draft.title.trim().slice(0, TITLE_MAX_LENGTH),
    note: draft.note.trim().slice(0, NOTE_MAX_LENGTH),
    priority: draft.priority,
    dueDate: draft.dueDate === '' ? null : draft.dueDate,
    tag: normalizeTag(draft.tag),
  }
}

export function validateDraft(draft: TaskDraft): string | null {
  if (draft.title.trim() === '') {
    return 'Görev başlığı boş olamaz.'
  }
  return null
}
