import { Link, useLocation, useSearchParams } from 'react-router'
import { buildTaskQuerySearch, defaultTaskQuery, parseTaskQuery } from '../hooks/useTaskQuery'
import { useTasks } from '../hooks/useTasks'
import { countTasksByStatus, summarizeTags } from '../utils/taskQuery'
import { StorageNote } from './StorageNote'

function describeOpenCount(openCount: number): string {
  return openCount === 0 ? 'Açık görev yok' : `${openCount} açık görev`
}

function describeDoneCount(doneCount: number): string {
  return doneCount === 0 ? 'Henüz biten görev yok' : `${doneCount} görev tamamlandı`
}

export function NotebookCover() {
  const { tasks } = useTasks()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isOnTaskList = location.pathname === '/'
  const listQuery = isOnTaskList ? parseTaskQuery(searchParams) : defaultTaskQuery
  const statusCounts = countTasksByStatus(tasks)
  const tagSummaries = summarizeTags(tasks)
  const completionPercent = statusCounts.all === 0 ? 0 : Math.round((statusCounts.done / statusCounts.all) * 100)

  return (
    <header className="bg-cover text-paper lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto">
      <div className="flex flex-col gap-6 px-4 py-5 sm:px-8 sm:py-6 lg:min-h-full lg:gap-10 lg:px-8 lg:py-10">
        <div className="flex items-center justify-between gap-6 lg:block">
          <Link
            to="/"
            className="block w-44 shrink-0 rounded-md bg-paper px-4 pt-3 pb-2.5 text-ink shadow-[0_2px_0_var(--color-cover-deep)] focus-visible:outline-marker sm:w-52 lg:w-full lg:px-5 lg:pt-4 lg:pb-3.5"
          >
            <span className="type-wide block text-[1.75rem] leading-none font-[820] tracking-[-0.03em] sm:text-[2rem] lg:text-[2.5rem]">
              Defter
            </span>
            <span className="mt-2 block border-t border-rule pt-1.5 text-[0.8125rem] text-ink-soft lg:mt-3 lg:pt-2 lg:text-sm">
              Kişisel görev listesi
            </span>
          </Link>

          <section aria-label="İlerleme" className="min-w-0 text-right lg:mt-10 lg:text-left">
            <p className="type-semi-wide text-lg leading-tight font-semibold lg:text-2xl">
              {describeOpenCount(statusCounts.open)}
            </p>
            <p className="mt-1 text-sm text-paper/75 lg:text-base">{describeDoneCount(statusCounts.done)}</p>
            <div className="mt-3 ml-auto h-1.5 w-28 overflow-hidden rounded-full bg-paper/20 lg:ml-0 lg:w-full" aria-hidden="true">
              <div className="h-full rounded-full bg-marker transition-[width] duration-500" style={{ width: `${completionPercent}%` }} />
            </div>
          </section>
        </div>

        {tagSummaries.length > 0 && (
          <nav aria-labelledby="cover-tags-heading">
            <h2 id="cover-tags-heading" className="text-sm font-medium text-paper/75">
              Etiketler
            </h2>
            <ul className="-mx-4 mt-2 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0 lg:mt-3 lg:flex-col lg:gap-0.5">
              {tagSummaries.map((summary) => {
                const isActive = listQuery.tag === summary.name
                const tagSearch = buildTaskQuerySearch({ ...listQuery, tag: isActive ? null : summary.name })
                return (
                  <li key={summary.name} className="shrink-0">
                    <Link
                      to={{ pathname: '/', search: tagSearch }}
                      aria-current={isActive ? 'true' : undefined}
                      className={`flex items-baseline justify-between gap-3 rounded px-3 py-1.5 transition-colors focus-visible:outline-marker lg:-mx-3 ${isActive ? 'bg-marker text-ink' : 'border border-paper/30 hover:bg-paper/10 lg:border-transparent'}`}
                    >
                      <span className="font-medium">#{summary.name}</span>
                      <span className={`text-sm tabular-nums ${isActive ? 'text-ink' : 'text-paper/70'}`}>
                        {summary.openCount === 0 ? 'bitti' : `${summary.openCount} açık`}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}

        <StorageNote className="mt-auto hidden text-paper/70 lg:block" />
      </div>
    </header>
  )
}
