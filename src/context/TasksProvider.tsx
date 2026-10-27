import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Task, TaskChanges } from '../interfaces/Task'
import type { TaskDraft } from '../interfaces/TaskDraft'
import type { TasksContextValue } from '../interfaces/TasksContextValue'
import { loadTasks, saveTasks } from '../services/taskStorage'
import { createTaskId } from '../utils/createTaskId'
import { draftToTaskFields } from '../utils/taskDraft'
import { TasksContext } from './TasksContext'

interface TasksProviderProps {
  children: ReactNode
}

export function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((draft: TaskDraft) => {
    const timestamp = new Date().toISOString()
    const createdTask: Task = {
      id: createTaskId(),
      ...draftToTaskFields(draft),
      isCompleted: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    setTasks((currentTasks) => [createdTask, ...currentTasks])
    return createdTask
  }, [])

  const updateTask = useCallback((taskId: string, changes: TaskChanges) => {
    const timestamp = new Date().toISOString()
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, ...changes, updatedAt: timestamp } : task)),
    )
  }, [])

  const toggleTask = useCallback((taskId: string) => {
    const timestamp = new Date().toISOString()
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted, updatedAt: timestamp } : task,
      ),
    )
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }, [])

  const deleteCompletedTasks = useCallback(() => {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.isCompleted))
  }, [])

  const contextValue = useMemo<TasksContextValue>(
    () => ({ tasks, addTask, updateTask, toggleTask, deleteTask, deleteCompletedTasks }),
    [tasks, addTask, updateTask, toggleTask, deleteTask, deleteCompletedTasks],
  )

  return <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>
}
