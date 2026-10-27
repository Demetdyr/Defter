import { useEffect, useState } from 'react'

const MINUTE_IN_MILLISECONDS = 60_000

export function useToday(): Date {
  const [today, setToday] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const currentDate = new Date()
      setToday((previousDate) => (previousDate.toDateString() === currentDate.toDateString() ? previousDate : currentDate))
    }, MINUTE_IN_MILLISECONDS)
    return () => window.clearInterval(intervalId)
  }, [])

  return today
}
