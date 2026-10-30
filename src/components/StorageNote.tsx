interface StorageNoteProps {
  className?: string
}

export function StorageNote({ className = '' }: StorageNoteProps) {
  return (
    <p className={`max-w-xs text-sm leading-relaxed ${className}`}>
      Görevler yalnızca bu tarayıcıda saklanır. Başka bir cihazdan açtığında görünmez.
    </p>
  )
}
