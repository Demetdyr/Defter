import type { ReactNode } from 'react'
import type { Task } from '../interfaces/Task'
import { TaskListItem } from './TaskListItem'

interface TaskListProps {
  tasks: Task[]
  today: Date
  freshTaskId: string | null
  returnSearch: string
  emptyState: ReactNode
  onToggle: (taskId: string) => void
  onRequestDelete: (task: Task) => void
}

const MINIMUM_RULED_LINES = 6
const MINIMUM_BLANK_LINES = 2

export function TaskList({ tasks, today, freshTaskId, returnSearch, emptyState, onToggle, onRequestDelete }: TaskListProps) {
  const blankLineCount = Math.max(MINIMUM_BLANK_LINES, MINIMUM_RULED_LINES - tasks.length)

  return (
    <div>
      {tasks.length > 0 ? (
        <ul aria-label="Görevler">
          {tasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              today={today}
              isFresh={task.id === freshTaskId}
              returnSearch={returnSearch}
              onToggle={onToggle}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </ul>
      ) : (
        emptyState
      )}
      <div aria-hidden="true">
        {Array.from({ length: blankLineCount }, (_, lineIndex) => (
          <div key={lineIndex} className="h-14 border-b border-rule" />
        ))}
      </div>
    </div>
  )
}
