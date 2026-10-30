import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PageHeader } from '../components/PageHeader'
import { TaskEditForm } from '../components/TaskEditForm'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTasks } from '../hooks/useTasks'
import type { TaskListLocationState } from '../interfaces/LocationState'
import type { TaskDraft } from '../interfaces/TaskDraft'
import { formatTimestamp } from '../utils/dateUtils'
import { readEditTaskState } from '../utils/locationState'
import { draftToTaskFields } from '../utils/taskDraft'
import { summarizeTags } from '../utils/taskQuery'

export function EditTaskPage() {
  const { taskId } = useParams()
  const { tasks, updateTask, deleteTask } = useTasks()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLeavingAfterDelete, setIsLeavingAfterDelete] = useState(false)
  const task = tasks.find((candidateTask) => candidateTask.id === taskId)
  const returnSearch = readEditTaskState(location.state).returnSearch ?? ''
  const tagNames = useMemo(() => summarizeTags(tasks).map((summary) => summary.name), [tasks])

  useDocumentTitle(task ? 'Görevi düzenle' : 'Görev bulunamadı')

  if (task === undefined) {
    if (isLeavingAfterDelete) return null
    return (
      <>
        <PageHeader title="Görev bulunamadı" />
        <div className="gutter-x max-w-2xl">
          <p className="text-lg leading-relaxed text-ink-soft">
            Bu görev silinmiş ya da bağlantı hatalı olabilir. Görevler yalnızca eklendikleri tarayıcıda saklanır.
          </p>
          <Link to="/" className="button-primary mt-6">
            Görevlere dön
          </Link>
        </div>
      </>
    )
  }

  const returnToList = (highlightTaskId?: string) => {
    const listState: TaskListLocationState | null = highlightTaskId ? { highlightTaskId } : null
    navigate({ pathname: '/', search: returnSearch }, { state: listState })
  }

  const handleSave = (draft: TaskDraft, isCompleted: boolean) => {
    updateTask(task.id, { ...draftToTaskFields(draft), isCompleted })
    returnToList(task.id)
  }

  const confirmDeletion = () => {
    setIsLeavingAfterDelete(true)
    setIsDeleteDialogOpen(false)
    deleteTask(task.id)
    returnToList()
  }

  return (
    <>
      <PageHeader title="Görevi düzenle" />
      <div className="gutter-x">
        <TaskEditForm
          key={task.id}
          task={task}
          tagSuggestions={tagNames}
          onSave={handleSave}
          onCancel={() => returnToList()}
        />

        <section aria-labelledby="task-history-heading" className="mt-14 max-w-3xl border-t border-rule pt-6">
          <h2 id="task-history-heading" className="type-semi-wide text-lg font-bold">
            Görev kaydı
          </h2>
          <dl className="mt-3 grid gap-x-8 gap-y-2 text-[0.9375rem] sm:grid-cols-[auto_1fr]">
            <dt className="text-ink-soft">Eklendi</dt>
            <dd>{formatTimestamp(task.createdAt)}</dd>
            <dt className="text-ink-soft">Son değişiklik</dt>
            <dd>{formatTimestamp(task.updatedAt)}</dd>
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" className="button-danger" onClick={() => setIsDeleteDialogOpen(true)}>
              Görevi sil
            </button>
            <p className="text-sm text-ink-soft">Silinen görev geri getirilemez.</p>
          </div>
        </section>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Görev silinsin mi?"
        description={`“${task.title}” defterden kalıcı olarak silinecek.`}
        confirmLabel="Sil"
        onConfirm={confirmDeletion}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  )
}
