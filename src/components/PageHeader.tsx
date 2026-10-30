import type { ReactNode } from 'react'
import { useToday } from '../hooks/useToday'
import { formatNumericDate, formatWeekday, toDateKey } from '../utils/dateUtils'

interface PageHeaderProps {
  title: string
  children?: ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  const today = useToday()

  return (
    <div className="gutter-x pt-8 pb-6 sm:pt-10 lg:pt-14 lg:pb-8">
      <div className="flex flex-wrap-reverse items-end justify-between gap-x-6 gap-y-3">
        <h1 className="type-semi-wide text-[clamp(2.125rem,1.6rem+2vw,3.25rem)] leading-[1.05] font-[780] tracking-[-0.02em]">
          {title}
        </h1>
        <time dateTime={toDateKey(today)} className="text-right leading-tight">
          <span className="block text-sm text-ink-soft">{formatWeekday(today)}</span>
          <span className="type-semi-wide text-lg font-semibold tabular-nums">{formatNumericDate(today)}</span>
        </time>
      </div>
      {children}
    </div>
  )
}
