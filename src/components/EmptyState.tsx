interface EmptyStateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="gutter-x flex min-h-14 flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule py-3" role="status">
      <p className="text-ink-soft">{message}</p>
      {actionLabel !== undefined && onAction !== undefined && (
        <button type="button" className="text-action text-[0.9375rem]" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
