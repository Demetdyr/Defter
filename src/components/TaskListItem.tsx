import { Link } from 'react-router'
import type { EditTaskLocationState } from '../interfaces/LocationState'
import type { Task, TaskPriority } from '../interfaces/Task'
import { describeDueDate, type DueDateTone } from '../utils/dueDateLabel'
import { PencilIcon, TrashIcon } from './Icons'

interface TaskListItemProps {
  task: Task
  today: Date
  isFresh: boolean
  returnSearch: string
  onToggle: (taskId: string) => void
  onRequestDelete: (task: Task) => void
}

const dueToneClassNames: Record<DueDateTone, string> = {
  overdue: 'font-semibold text-alert',
  soon: 'font-semibold text-cover',
  later: 'text-ink-soft',
}

const priorityNotes: Record<TaskPriority, string | null> = {
  high: 'Yüksek öncelik',
  normal: null,
  low: 'Düşük öncelik',
}

export function TaskListItem({ task, today, isFresh, returnSearch, onToggle, onRequestDelete }: TaskListItemProps) {
  const editLinkState: EditTaskLocationState = { returnSearch }
  const editPath = `/gorev/${task.id}`
  const dueLabel = task.dueDate !== null && !task.isCompleted ? describeDueDate(task.dueDate, today) : null
  const priorityNote = task.isCompleted ? null : priorityNotes[task.priority]
  const hasMetaLine = dueLabel !== null || task.tag !== '' || priorityNote !== null

  return (
    <li
      className="task-row grid grid-cols-[var(--margin-width)_minmax(0,1fr)_auto] border-b border-rule"
      data-fresh={isFresh}
    >
      <div className="flex justify-center pt-[1.1rem] lg:pt-[1.2rem]">
        <input
          type="checkbox"
          className="ink-checkbox"
          checked={task.isCompleted}
          aria-label={`Tamamlandı: ${task.title}`}
          onChange={() => onToggle(task.id)}
        />
      </div>

      <div className="min-w-0 py-3.5 pl-(--content-gap)">
        <Link
          to={editPath}
          state={editLinkState}
          className="task-title text-[1.0625rem] leading-snug font-medium break-words hover:text-cover lg:text-lg"
          data-completed={task.isCompleted}
        >
          {task.title}
        </Link>

        {task.note !== '' && (
          <p className={`mt-1 line-clamp-2 max-w-[68ch] text-[0.9375rem] leading-normal ${task.isCompleted ? 'text-ink-soft/80' : 'text-ink-soft'}`}>
            {task.note}
          </p>
        )}

        {hasMetaLine && (
          <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {dueLabel !== null && task.dueDate !== null && (
              <time dateTime={task.dueDate} className={dueToneClassNames[dueLabel.tone]}>
                {dueLabel.text}
              </time>
            )}
            {task.tag !== '' && <span className="text-ink-soft">#{task.tag}</span>}
            {priorityNote !== null && (
              <span className={task.priority === 'high' ? 'marker-swipe px-0.5 font-medium text-ink' : 'text-ink-soft'}>
                {priorityNote}
              </span>
            )}
          </p>
        )}
      </div>

      <div className="gutter-end flex items-start gap-0.5 py-2.5 pl-2">
        <Link to={editPath} state={editLinkState} className="icon-button" aria-label={`Düzenle: ${task.title}`} title="Düzenle">
          <PencilIcon />
        </Link>
        <button
          type="button"
          className="icon-button"
          data-tone="danger"
          aria-label={`Sil: ${task.title}`}
          title="Sil"
          onClick={() => onRequestDelete(task)}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  )
}
