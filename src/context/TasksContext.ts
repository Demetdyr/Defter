import { createContext } from 'react'
import type { TasksContextValue } from '../interfaces/TasksContextValue'

export const TasksContext = createContext<TasksContextValue | null>(null)
