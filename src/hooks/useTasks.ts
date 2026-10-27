import { useContext } from 'react'
import { TasksContext } from '../context/TasksContext'
import type { TasksContextValue } from '../interfaces/TasksContextValue'

export function useTasks(): TasksContextValue {
  const contextValue = useContext(TasksContext)
  if (contextValue === null) {
    throw new Error('useTasks yalnızca TasksProvider içinde kullanılabilir.')
  }
  return contextValue
}
