export type TaskStatusFilter = 'all' | 'open' | 'done'

export type TaskSortOrder = 'due' | 'priority' | 'newest'

export interface TaskQuery {
  status: TaskStatusFilter
  sortOrder: TaskSortOrder
  searchText: string
  tag: string | null
}

export interface TagSummary {
  name: string
  openCount: number
  totalCount: number
}
