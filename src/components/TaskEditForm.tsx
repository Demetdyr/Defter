import { useId, useRef, useState, type SubmitEvent } from 'react'
import type { Task } from '../interfaces/Task'
import type { TaskDraft } from '../interfaces/TaskDraft'
import { TITLE_MAX_LENGTH, taskToDraft, validateDraft } from '../utils/taskDraft'
import { TaskDetailFields, type DraftFieldChangeHandler } from './TaskDetailFields'

interface TaskEditFormProps {
  task: Task
  tagSuggestions: string[]
  onSave: (draft: TaskDraft, isCompleted: boolean) => void
  onCancel: () => void
}

export function TaskEditForm({ task, tagSuggestions, onSave, onCancel }: TaskEditFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(() => taskToDraft(task))
  const [isCompleted, setIsCompleted] = useState(task.isCompleted)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const idPrefix = useId()
  const titleFieldId = `${idPrefix}-title`
  const errorMessageId = `${idPrefix}-error`
  const completedFieldId = `${idPrefix}-completed`

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
    onSave(draft, isCompleted)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-6">
      <div className="max-w-3xl">
        <label htmlFor={titleFieldId} className="field-label">
          Başlık
        </label>
        <input
          id={titleFieldId}
          ref={titleInputRef}
          type="text"
          className="field-input text-lg font-medium"
          autoComplete="off"
          maxLength={TITLE_MAX_LENGTH}
          value={draft.title}
          aria-invalid={validationMessage !== null}
          aria-describedby={validationMessage !== null ? errorMessageId : undefined}
          onChange={(event) => handleFieldChange('title', event.target.value)}
        />
        {validationMessage !== null && (
          <p id={errorMessageId} role="alert" className="mt-2 text-sm font-medium text-alert">
            {validationMessage}
          </p>
        )}
      </div>

      <TaskDetailFields idPrefix={idPrefix} draft={draft} tagSuggestions={tagSuggestions} onFieldChange={handleFieldChange} />

      <div className="flex items-center gap-3">
        <input
          id={completedFieldId}
          type="checkbox"
          className="ink-checkbox"
          checked={isCompleted}
          onChange={(event) => setIsCompleted(event.target.checked)}
        />
        <label htmlFor={completedFieldId} className="font-medium">
          Bu görev tamamlandı
        </label>
      </div>

      <div className="flex max-w-3xl flex-wrap gap-3 border-t border-rule pt-6">
        <button type="submit" className="button-primary">
          Değişiklikleri kaydet
        </button>
        <button type="button" className="button-quiet" onClick={onCancel}>
          Vazgeç
        </button>
      </div>
    </form>
  )
}
