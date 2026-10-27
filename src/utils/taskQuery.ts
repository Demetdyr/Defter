import type { Task, TaskPriority } from '../interfaces/Task'
import type { TagSummary, TaskQuery, TaskSortOrder, TaskStatusFilter } from '../interfaces/TaskQuery'

const priorityRank: Record<TaskPriority, number> = { high: 0, normal: 1, low: 2 }

export function normalizeForSearch(text: string): string {
  return text.toLocaleLowerCase('tr-TR').trim()
}

function matchesStatus(task: Task, status: TaskStatusFilter): boolean {
  if (status === 'open') return !task.isCompleted
  if (status === 'done') return task.isCompleted
  return true
}

function matchesSearch(task: Task, searchText: string): boolean {
  const normalizedSearch = normalizeForSearch(searchText)
  if (normalizedSearch === '') return true
  const searchableText = normalizeForSearch(`${task.title} ${task.note} ${task.tag}`)
  return searchableText.includes(normalizedSearch)
}

export function matchesQuery(task: Task, query: TaskQuery): boolean {
  return (
    matchesStatus(task, query.status) &&
    (query.tag === null || task.tag === query.tag) &&
    matchesSearch(task, query.searchText)
  )
}

function compareDueDates(firstTask: Task, secondTask: Task): number {
  if (firstTask.dueDate === secondTask.dueDate) return 0
  if (firstTask.dueDate === null) return 1
  if (secondTask.dueDate === null) return -1
  return firstTask.dueDate.localeCompare(secondTask.dueDate)
}

function comparePriorities(firstTask: Task, secondTask: Task): number {
  return priorityRank[firstTask.priority] - priorityRank[secondTask.priority]
}

function compareNewestFirst(firstTask: Task, secondTask: Task): number {
  return secondTask.createdAt.localeCompare(firstTask.createdAt)
}

const comparatorsBySortOrder: Record<TaskSortOrder, Array<(firstTask: Task, secondTask: Task) => number>> = {
  due: [compareDueDates, comparePriorities, compareNewestFirst],
  priority: [comparePriorities, compareDueDates, compareNewestFirst],
  newest: [compareNewestFirst],
}

export function sortTasks(tasks: Task[], sortOrder: TaskSortOrder): Task[] {
  const comparators = comparatorsBySortOrder[sortOrder]
  return [...tasks].sort((firstTask, secondTask) => {
    if (firstTask.isCompleted !== secondTask.isCompleted) {
      return firstTask.isCompleted ? 1 : -1
    }
    for (const compare of comparators) {
      const comparison = compare(firstTask, secondTask)
      if (comparison !== 0) return comparison
    }
    return 0
  })
}

export function selectVisibleTasks(tasks: Task[], query: TaskQuery): Task[] {
  return sortTasks(
    tasks.filter((task) => matchesQuery(task, query)),
    query.sortOrder,
  )
}

export function countTasksByStatus(tasks: Task[]): Record<TaskStatusFilter, number> {
  const completedCount = tasks.filter((task) => task.isCompleted).length
  return {
    all: tasks.length,
    open: tasks.length - completedCount,
    done: completedCount,
  }
}

export function summarizeTags(tasks: Task[]): TagSummary[] {
  const summariesByName = new Map<string, TagSummary>()
  for (const task of tasks) {
    if (task.tag === '') continue
    const summary = summariesByName.get(task.tag) ?? { name: task.tag, openCount: 0, totalCount: 0 }
    summary.totalCount += 1
    if (!task.isCompleted) summary.openCount += 1
    summariesByName.set(task.tag, summary)
  }
  return [...summariesByName.values()].sort((firstSummary, secondSummary) =>
    firstSummary.name.localeCompare(secondSummary.name, 'tr-TR'),
  )
}
