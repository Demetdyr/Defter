import type { EditTaskLocationState, TaskListLocationState } from '../interfaces/LocationState'

function readStringField(state: unknown, fieldName: string): string | undefined {
  if (typeof state !== 'object' || state === null) return undefined
  const fieldValue: unknown = Reflect.get(state, fieldName)
  return typeof fieldValue === 'string' ? fieldValue : undefined
}

export function readTaskListState(state: unknown): TaskListLocationState {
  return { highlightTaskId: readStringField(state, 'highlightTaskId') }
}

export function readEditTaskState(state: unknown): EditTaskLocationState {
  return { returnSearch: readStringField(state, 'returnSearch') }
}
