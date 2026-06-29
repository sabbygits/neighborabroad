import { HUB_CONFIG } from '@/lib/utils'

interface Props {
  hub: string
  size?: 'sm' | 'md'
}

export default function HubBadge({ hub, size = 'md' }: Props) {
  const config = HUB_CONFIG[hub as keyof typeof HUB_CONFIG]
  if (!config) return null

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full text-white ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      }`}
      style={{ backgroundColor: config.color }}
    >
      {config.emoji} {config.name}
    </span>
  )
}
