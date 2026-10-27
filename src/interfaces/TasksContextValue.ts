import type { Task, TaskChanges } from './Task'
import type { TaskDraft } from './TaskDraft'

export interface TasksContextValue {
  tasks: Task[]
  addTask: (draft: TaskDraft) => Task
  updateTask: (taskId: string, changes: TaskChanges) => void
  toggleTask: (taskId: string) => void
  deleteTask: (taskId: string) => void
  deleteCompletedTasks: () => void
}
