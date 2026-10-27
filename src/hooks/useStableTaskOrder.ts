import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Task } from '../interfaces/Task'

const SETTLE_DELAY = 900

interface FrozenOrder {
  taskIds: string[]
  querySignature: string
}

export function useStableTaskOrder(visibleTasks: Task[], allTasks: Task[], querySignature: string) {
  const [frozenOrder, setFrozenOrder] = useState<FrozenOrder | null>(null)

  useEffect(() => {
    if (frozenOrder === null) return
    const timeoutId = window.setTimeout(() => setFrozenOrder(null), SETTLE_DELAY)
    return () => window.clearTimeout(timeoutId)
  }, [frozenOrder])

  const freezeOrder = useCallback(() => {
    setFrozenOrder((currentOrder) =>
      currentOrder !== null && currentOrder.querySignature === querySignature
        ? { ...currentOrder }
        : { taskIds: visibleTasks.map((task) => task.id), querySignature },
    )
  }, [visibleTasks, querySignature])

  const releaseOrder = useCallback(() => setFrozenOrder(null), [])

  const orderedTasks = useMemo(() => {
    if (frozenOrder === null || frozenOrder.querySignature !== querySignature) return visibleTasks
    const tasksById = new Map(allTasks.map((task) => [task.id, task]))
    return frozenOrder.taskIds.flatMap((taskId) => {
      const task = tasksById.get(taskId)
      return task === undefined ? [] : [task]
    })
  }, [frozenOrder, querySignature, visibleTasks, allTasks])

  return { orderedTasks, freezeOrder, releaseOrder }
}
