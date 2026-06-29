'use client'

import { X, Users } from 'lucide-react'
import { BadgeCheck } from 'lucide-react'

interface Props {
  meetup: any
  hub: string
  onClose: () => void
  onAuthorClick: (authorId: string) => void
}

const hubColor: Record<string, string> = {
  london: '#2563EB',
  seoul: '#be1f3b',
}

const hubFlag: Record<string, string> = {
  london: '🇬🇧',
  seoul: '🇰🇷',
}

export default function AttendeesSheet({ meetup, hub, onClose, onAuthorClick }: Props) {
  const attendees = meetup.meetup_joins || []
  const color = hubColor[hub]

  const getInitials = (name: string) =>
    name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const isEduVerified = (email?: string) =>
    email?.endsWith('.edu') || email?.includes('.ac.')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '75vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div>
            <h2 className="font-sora font-semibold text-gray-900">Who's going</h2>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{meetup.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Attendees list */}
        <div className="flex-1 overflow-y-auto">
          {attendees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Users className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-medium">No one yet</p>
              <p className="text-xs text-gray-300 mt-1">Be the first to join!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {attendees.map((join: any) => {
                const person = join.profiles
                if (!person) return null
                const isVisitor = person.base_hub && person.base_hub !== hub
                return (
                  <button
                    key={join.id}
                    onClick={() => { onClose(); onAuthorClick(person.id) }}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-sora font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {getInitials(person.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{person.name}</span>
                      </div>
                      <p className="text-xs text-gray-400">{person.university}</p>
                    </div>
                    {isVisitor && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex-shrink-0">
                        visitor {hubFlag[person.base_hub]}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
