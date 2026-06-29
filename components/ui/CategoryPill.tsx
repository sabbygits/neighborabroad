import { cn } from '@/lib/utils'

interface Props {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export default function CategoryPill({ label, active, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all',
        active
          ? 'bg-london text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        className
      )}
    >
      {label}
    </button>
  )
}
