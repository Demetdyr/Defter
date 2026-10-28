import type { TaskQuery, TaskSortOrder, TaskStatusFilter } from '../interfaces/TaskQuery'
import { SearchIcon } from './Icons'

interface TaskToolbarProps {
  query: TaskQuery
  statusCounts: Record<TaskStatusFilter, number>
  onQueryChange: (changes: Partial<TaskQuery>) => void
}

const statusTabs: Array<{ status: TaskStatusFilter; label: string }> = [
  { status: 'all', label: 'Tümü' },
  { status: 'open', label: 'Açık' },
  { status: 'done', label: 'Biten' },
]

const sortOptions: Array<{ sortOrder: TaskSortOrder; label: string }> = [
  { sortOrder: 'due', label: 'Son tarih' },
  { sortOrder: 'priority', label: 'Öncelik' },
  { sortOrder: 'newest', label: 'Eklenme' },
]

function isSortOrder(value: string): value is TaskSortOrder {
  return sortOptions.some((option) => option.sortOrder === value)
}

export function TaskToolbar({ query, statusCounts, onQueryChange }: TaskToolbarProps) {
  return (
    <div className="gutter-x pb-4">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <div role="group" aria-label="Duruma göre süz" className="-ml-2 flex">
          {statusTabs.map(({ status, label }) => {
            const isActive = query.status === status
            return (
              <button
                key={status}
                type="button"
                aria-pressed={isActive}
                onClick={() => onQueryChange({ status })}
                className={`rounded px-2 py-1.5 text-[0.9375rem] font-semibold transition-colors ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'}`}
              >
                <span className={isActive ? 'marker-swipe px-0.5' : 'px-0.5'}>{label}</span>
                <span className="ml-1.5 font-normal text-ink-soft tabular-nums">{statusCounts[status]}</span>
              </button>
            )
          })}
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <label className="relative min-w-0 basis-full sm:w-64 sm:basis-auto">
            <span className="sr-only">Görevlerde ara</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              className="field-input py-1.5 pl-9"
              placeholder="Başlık, not ya da etiket ara"
              value={query.searchText}
              onChange={(event) => onQueryChange({ searchText: event.target.value })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            Sırala
            <select
              className="field-input w-auto py-1.5 pr-8"
              value={query.sortOrder}
              onChange={(event) => {
                if (isSortOrder(event.target.value)) onQueryChange({ sortOrder: event.target.value })
              }}
            >
              {sortOptions.map(({ sortOrder, label }) => (
                <option key={sortOrder} value={sortOrder}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {query.tag !== null && (
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem]">
          <span>
            Yalnızca <span className="font-semibold">#{query.tag}</span> etiketli görevler gösteriliyor.
          </span>
          <button type="button" className="text-action" onClick={() => onQueryChange({ tag: null })}>
            Tüm etiketleri göster
          </button>
        </p>
      )}
    </div>
  )
}
