import { useEffect, useId, useRef, type MouseEvent } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ isOpen, title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const idPrefix = useId()
  const titleId = `${idPrefix}-title`
  const descriptionId = `${idPrefix}-description`

  useEffect(() => {
    const dialogElement = dialogRef.current
    if (dialogElement === null) return
    if (isOpen && !dialogElement.open) dialogElement.showModal()
    if (!isOpen && dialogElement.open) dialogElement.close()
  }, [isOpen])

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onCancel()
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      data-tone="danger"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onCancel}
      onClick={handleBackdropClick}
    >
      <div className="px-6 pt-6 pb-5">
        <h2 id={titleId} className="type-semi-wide text-xl font-bold">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 leading-relaxed text-ink-soft">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-rule bg-wash px-6 py-4">
        <button type="button" className="button-quiet" autoFocus onClick={onCancel}>
          Vazgeç
        </button>
        <button type="button" className="button-primary button-danger-solid" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
