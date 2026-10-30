import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { TaskComposer } from '../components/TaskComposer'
import { TaskList } from '../components/TaskList'
import { TaskToolbar } from '../components/TaskToolbar'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useStableTaskOrder } from '../hooks/useStableTaskOrder'
import { buildTaskQuerySearch, useTaskQuery } from '../hooks/useTaskQuery'
import { useTasks } from '../hooks/useTasks'
import { useToday } from '../hooks/useToday'
import type { Task } from '../interfaces/Task'
import type { TaskQuery } from '../interfaces/TaskQuery'
import { readTaskListState } from '../utils/locationState'
import { countTasksByStatus, matchesQuery, selectVisibleTasks, summarizeTags } from '../utils/taskQuery'

const FRESH_HIGHLIGHT_DURATION = 2000

interface EmptyStateContent {
  message: string
  actionLabel?: string
  action?: () => void
}

export function TasksPage() {
  useDocumentTitle('Görevler')
  const { tasks, toggleTask, deleteTask, deleteCompletedTasks } = useTasks()
  const { query, updateQuery, resetQuery } = useTaskQuery()
  const location = useLocation()
  const today = useToday()
  const [freshTaskId, setFreshTaskId] = useState<string | null>(
    () => readTaskListState(location.state).highlightTaskId ?? null,
  )
  const [taskPendingDeletion, setTaskPendingDeletion] = useState<Task | null>(null)
  const [isClearCompletedDialogOpen, setIsClearCompletedDialogOpen] = useState(false)

  useEffect(() => {
    if (freshTaskId === null) return
    const timeoutId = window.setTimeout(() => setFreshTaskId(null), FRESH_HIGHLIGHT_DURATION)
    return () => window.clearTimeout(timeoutId)
  }, [freshTaskId])

  const visibleTasks = useMemo(() => selectVisibleTasks(tasks, query), [tasks, query])
  const statusCounts = useMemo(() => countTasksByStatus(tasks), [tasks])
  const tagNames = useMemo(() => summarizeTags(tasks).map((summary) => summary.name), [tasks])
  const returnSearch = buildTaskQuerySearch(query)
  const { orderedTasks, freezeOrder, releaseOrder } = useStableTaskOrder(visibleTasks, tasks, returnSearch)
  const canClearCompleted = statusCounts.done > 0 && query.status !== 'open'

  const handleTaskAdded = (createdTask: Task) => {
    releaseOrder()
    if (!matchesQuery(createdTask, query)) resetQuery()
    setFreshTaskId(createdTask.id)
  }

  const handleToggle = (taskId: string) => {
    freezeOrder()
    toggleTask(taskId)
  }

  const confirmTaskDeletion = () => {
    if (taskPendingDeletion !== null) deleteTask(taskPendingDeletion.id)
    setTaskPendingDeletion(null)
  }

  const confirmClearCompleted = () => {
    deleteCompletedTasks()
    setIsClearCompletedDialogOpen(false)
  }

  const emptyStateContent = describeEmptyState(tasks.length, query, updateQuery)

  return (
    <>
      <PageHeader title="Görevler" />
      <TaskToolbar query={query} statusCounts={statusCounts} onQueryChange={updateQuery} />
      <TaskComposer tagSuggestions={tagNames} onTaskAdded={handleTaskAdded} />
      <TaskList
        tasks={orderedTasks}
        today={today}
        freshTaskId={freshTaskId}
        returnSearch={returnSearch}
        onToggle={handleToggle}
        onRequestDelete={setTaskPendingDeletion}
        emptyState={
          <EmptyState
            message={emptyStateContent.message}
            actionLabel={emptyStateContent.actionLabel}
            onAction={emptyStateContent.action}
          />
        }
      />

      {canClearCompleted && (
        <div className="gutter-x mt-6">
          <button type="button" className="text-action text-[0.9375rem]" onClick={() => setIsClearCompletedDialogOpen(true)}>
            Tamamlanan {statusCounts.done} görevi sil
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={taskPendingDeletion !== null}
        title="Görev silinsin mi?"
        description={`“${taskPendingDeletion?.title ?? ''}” defterden kalıcı olarak silinecek.`}
        confirmLabel="Sil"
        onConfirm={confirmTaskDeletion}
        onCancel={() => setTaskPendingDeletion(null)}
      />
      <ConfirmDialog
        isOpen={isClearCompletedDialogOpen}
        title="Tamamlanan görevler silinsin mi?"
        description={`Tamamlanan ${statusCounts.done} görev defterden kalıcı olarak silinecek. Açık görevlerin olduğu gibi kalır.`}
        confirmLabel="Sil"
        onConfirm={confirmClearCompleted}
        onCancel={() => setIsClearCompletedDialogOpen(false)}
      />
    </>
  )
}

function describeEmptyState(
  totalTaskCount: number,
  query: TaskQuery,
  updateQuery: (changes: Partial<TaskQuery>) => void,
): EmptyStateContent {
  if (totalTaskCount === 0) {
    return { message: 'Defterin boş. İlk görevini yukarıdaki satıra yaz.' }
  }
  if (query.searchText.trim() !== '') {
    return {
      message: `“${query.searchText.trim()}” ile eşleşen görev yok.`,
      actionLabel: 'Aramayı temizle',
      action: () => updateQuery({ searchText: '' }),
    }
  }
  if (query.tag !== null) {
    return {
      message: `#${query.tag} etiketinde bu filtreye uyan görev yok.`,
      actionLabel: 'Tüm etiketleri göster',
      action: () => updateQuery({ tag: null }),
    }
  }
  if (query.status === 'done') {
    return { message: 'Henüz tamamlanan görev yok.' }
  }
  return {
    message: 'Açık görev kalmadı, hepsi tamamlandı.',
    actionLabel: 'Bitenleri göster',
    action: () => updateQuery({ status: 'done' }),
  }
}
