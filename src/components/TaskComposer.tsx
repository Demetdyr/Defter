import { useId, useRef, useState, type SubmitEvent } from 'react'
import { useTasks } from '../hooks/useTasks'
import type { Task } from '../interfaces/Task'
import type { TaskDraft } from '../interfaces/TaskDraft'
import { TITLE_MAX_LENGTH, createEmptyDraft, validateDraft } from '../utils/taskDraft'
import { PlusIcon } from './Icons'
import { TaskDetailFields, type DraftFieldChangeHandler } from './TaskDetailFields'

interface TaskComposerProps {
  tagSuggestions: string[]
  onTaskAdded: (createdTask: Task) => void
}

export function TaskComposer({ tagSuggestions, onTaskAdded }: TaskComposerProps) {
  const { addTask } = useTasks()
  const [draft, setDraft] = useState<TaskDraft>(createEmptyDraft)
  const [areDetailsOpen, setAreDetailsOpen] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const idPrefix = useId()
  const titleFieldId = `${idPrefix}-title`
  const errorMessageId = `${idPrefix}-error`
  const detailsPanelId = `${idPrefix}-details`

  const handleFieldChange: DraftFieldChangeHandler = (field, value) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }))
    if (field === 'title') setValidationMessage(null)
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draftError = validateDraft(draft)
    if (draftError !== null) {
      setValidationMessage(draftError)
      titleInputRef.current?.focus()
      return
    }
    const createdTask = addTask(draft)
    setDraft(createEmptyDraft())
    setAreDetailsOpen(false)
    onTaskAdded(createdTask)
    titleInputRef.current?.focus()
  }

  return (
    <form noValidate aria-label="Yeni görev ekle" onSubmit={handleSubmit} className="border-y border-rule">
      <div className="grid grid-cols-[var(--margin-width)_minmax(0,1fr)] items-start transition-colors focus-within:bg-wash">
        <span className="flex justify-center pt-[1.175rem] text-cover" aria-hidden="true">
          <PlusIcon />
        </span>
        <div className="gutter-end flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 pl-(--content-gap)">
          <label htmlFor={titleFieldId} className="sr-only">
            Görev başlığı
          </label>
          <input
            id={titleFieldId}
            ref={titleInputRef}
            type="text"
            autoComplete="off"
            maxLength={TITLE_MAX_LENGTH}
            value={draft.title}
            placeholder="Yeni görev yaz, Enter ile ekle"
            aria-invalid={validationMessage !== null}
            aria-describedby={validationMessage !== null ? errorMessageId : undefined}
            onChange={(event) => handleFieldChange('title', event.target.value)}
            className="min-w-0 flex-1 basis-56 bg-transparent py-1.5 text-[1.0625rem] placeholder:text-ink-soft focus:outline-none lg:text-lg"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="button-quiet"
              aria-expanded={areDetailsOpen}
              aria-controls={detailsPanelId}
              onClick={() => setAreDetailsOpen((isOpen) => !isOpen)}
            >
              Ayrıntılar
            </button>
            <button type="submit" className="button-primary">
              Ekle
            </button>
          </div>
        </div>
      </div>

      {validationMessage !== null && (
        <p id={errorMessageId} role="alert" className="gutter-x pb-3 text-sm font-medium text-alert">
          {validationMessage}
        </p>
      )}

      <div id={detailsPanelId} hidden={!areDetailsOpen} className="gutter-x border-t border-rule bg-wash pt-5 pb-6">
        <TaskDetailFields
          idPrefix={idPrefix}
          draft={draft}
          tagSuggestions={tagSuggestions}
          onFieldChange={handleFieldChange}
        />
      </div>
    </form>
  )
}
