import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { TaskQuery, TaskSortOrder, TaskStatusFilter } from '../interfaces/TaskQuery'

const STATUS_PARAM = 'durum'
const SORT_PARAM = 'sirala'
const SEARCH_PARAM = 'ara'
const TAG_PARAM = 'etiket'

const statusParamValues: Record<TaskStatusFilter, string> = {
  all: 'tumu',
  open: 'acik',
  done: 'biten',
}

const sortParamValues: Record<TaskSortOrder, string> = {
  due: 'tarih',
  priority: 'oncelik',
  newest: 'yeni',
}

export const defaultTaskQuery: TaskQuery = {
  status: 'all',
  sortOrder: 'due',
  searchText: '',
  tag: null,
}

function findKeyByParamValue<Key extends string>(paramValues: Record<Key, string>, paramValue: string | null) {
  const matchingEntry = Object.entries(paramValues).find(([, value]) => value === paramValue)
  return matchingEntry ? (matchingEntry[0] as Key) : null
}

export function parseTaskQuery(searchParams: URLSearchParams): TaskQuery {
  return {
    status: findKeyByParamValue(statusParamValues, searchParams.get(STATUS_PARAM)) ?? defaultTaskQuery.status,
    sortOrder: findKeyByParamValue(sortParamValues, searchParams.get(SORT_PARAM)) ?? defaultTaskQuery.sortOrder,
    searchText: searchParams.get(SEARCH_PARAM) ?? '',
    tag: searchParams.get(TAG_PARAM) || null,
  }
}

export function buildTaskQuerySearch(query: TaskQuery): string {
  const searchParams = new URLSearchParams()
  if (query.status !== defaultTaskQuery.status) searchParams.set(STATUS_PARAM, statusParamValues[query.status])
  if (query.sortOrder !== defaultTaskQuery.sortOrder) searchParams.set(SORT_PARAM, sortParamValues[query.sortOrder])
  if (query.searchText !== '') searchParams.set(SEARCH_PARAM, query.searchText)
  if (query.tag !== null) searchParams.set(TAG_PARAM, query.tag)
  const serializedParams = searchParams.toString()
  return serializedParams === '' ? '' : `?${serializedParams}`
}

export function useTaskQuery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useMemo(() => parseTaskQuery(searchParams), [searchParams])

  const updateQuery = useCallback(
    (changes: Partial<TaskQuery>) => {
      setSearchParams(
        (currentParams) => new URLSearchParams(buildTaskQuerySearch({ ...parseTaskQuery(currentParams), ...changes })),
        { replace: true, preventScrollReset: true },
      )
    },
    [setSearchParams],
  )

  const resetQuery = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true, preventScrollReset: true })
  }, [setSearchParams])

  return { query, updateQuery, resetQuery }
}
