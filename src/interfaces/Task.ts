export type TaskPriority = 'low' | 'normal' | 'high'

export interface Task {
  id: string
  title: string
  note: string
  priority: TaskPriority
  dueDate: string | null
  tag: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export type TaskChanges = Partial<Pick<Task, 'title' | 'note' | 'priority' | 'dueDate' | 'tag' | 'isCompleted'>>
