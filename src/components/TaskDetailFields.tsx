import type { TaskDraft, TaskDraftField } from '../interfaces/TaskDraft'
import { NOTE_MAX_LENGTH, TAG_MAX_LENGTH, priorityLabels, priorityOptions } from '../utils/taskDraft'

export type DraftFieldChangeHandler = <Field extends TaskDraftField>(field: Field, value: TaskDraft[Field]) => void

interface TaskDetailFieldsProps {
  idPrefix: string
  draft: TaskDraft
  tagSuggestions: string[]
  onFieldChange: DraftFieldChangeHandler
}

export function TaskDetailFields({ idPrefix, draft, tagSuggestions, onFieldChange }: TaskDetailFieldsProps) {
  const noteFieldId = `${idPrefix}-note`
  const dueDateFieldId = `${idPrefix}-due-date`
  const tagFieldId = `${idPrefix}-tag`
  const tagOptionsId = `${idPrefix}-tag-options`

  return (
    <div className="grid max-w-3xl gap-5">
      <div>
        <label htmlFor={noteFieldId} className="field-label">
          Not
        </label>
        <textarea
          id={noteFieldId}
          className="field-input min-h-20 resize-y"
          rows={3}
          maxLength={NOTE_MAX_LENGTH}
          value={draft.note}
          placeholder="Hatırlaman gereken ayrıntılar"
          onChange={(event) => onFieldChange('note', event.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]">
        <fieldset className="sm:col-span-2 xl:col-span-1">
          <legend className="field-label">Öncelik</legend>
          <div className="inline-flex rounded border border-edge p-0.5">
            {priorityOptions.map((priority) => (
              <label
                key={priority}
                className="rounded-[3px] px-3.5 py-1.5 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:text-ink has-checked:bg-cover has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cover"
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={`${idPrefix}-priority`}
                  value={priority}
                  checked={draft.priority === priority}
                  onChange={() => onFieldChange('priority', priority)}
                />
                {priorityLabels[priority]}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={dueDateFieldId} className="field-label">
              Son tarih
            </label>
            {draft.dueDate !== '' && (
              <button type="button" className="text-action mb-1.5 text-sm" onClick={() => onFieldChange('dueDate', '')}>
                Tarihi kaldır
              </button>
            )}
          </div>
          <input
            id={dueDateFieldId}
            type="date"
            className="field-input"
            value={draft.dueDate}
            onChange={(event) => onFieldChange('dueDate', event.target.value)}
          />
        </div>

        <div>
          <label htmlFor={tagFieldId} className="field-label">
            Etiket
          </label>
          <input
            id={tagFieldId}
            type="text"
            className="field-input"
            list={tagOptionsId}
            maxLength={TAG_MAX_LENGTH}
            autoComplete="off"
            value={draft.tag}
            placeholder="okul, ev, iş"
            onChange={(event) => onFieldChange('tag', event.target.value)}
          />
          <datalist id={tagOptionsId}>
            {tagSuggestions.map((tagName) => (
              <option key={tagName} value={tagName} />
            ))}
          </datalist>
        </div>
      </div>
    </div>
  )
}
