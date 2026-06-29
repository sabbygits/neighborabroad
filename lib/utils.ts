import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: string) {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  // Older than a week: show actual date
  const sameYear = d.getFullYear() === now.getFullYear()
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

export function isValidUniversityEmail(email: string): boolean {
  const validDomains = ['.edu', '.ac.uk', '.ac.kr', '.edu.au']
  return validDomains.some(domain => email.toLowerCase().endsWith(domain))
}

export function getUniversityFromEmail(email: string): string {
  const domain = email.split('@')[1] || ''
  return domain.split('.').slice(0, -1).join('.')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase())
}

export type Hub = 'london' | 'seoul'

export const HUB_CONFIG = {
  london: {
    name: 'London',
    color: '#2563EB',
    lightColor: '#EFF6FF',
    darkColor: '#1D4ED8',
    textColor: 'text-london',
    bgColor: 'bg-london',
    bgLightColor: 'bg-london-light',
    borderColor: 'border-london',
    emoji: '🇬🇧',
  },
  seoul: {
    name: 'Seoul',
    color: '#be1f3b',
    lightColor: '#FFF1F3',
    darkColor: '#9B1631',
    textColor: 'text-seoul',
    bgColor: 'bg-seoul',
    bgLightColor: 'bg-seoul-light',
    borderColor: 'border-seoul',
    emoji: '🇰🇷',
  },
}
