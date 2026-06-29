'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title?: string
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export default function Modal({ title, onClose, children, className }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className={cn('relative bg-white w-full max-w-md rounded-t-3xl p-6 pb-10', className)}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-sora font-bold text-lg text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
