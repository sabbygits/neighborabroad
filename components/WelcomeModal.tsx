'use client'

import { MessageSquare, Calendar, HelpCircle, Mail } from 'lucide-react'

interface Props {
  hub: string
  onClose: () => void
}

const hubConfig: Record<string, { name: string; flag: string; color: string }> = {
  london: { name: 'London', flag: '🇬🇧', color: '#2563EB' },
  seoul: { name: 'Seoul', flag: '🇰🇷', color: '#be1f3b' },
}

const sections = [
  {
    icon: MessageSquare,
    name: 'Commons',
    desc: 'Tips, stories & experiences shared by students currently in the hub.',
  },
  {
    icon: Calendar,
    name: 'Meetups',
    desc: 'Find or create local hangouts — hikes, food runs, study sessions and more.',
  },
  {
    icon: HelpCircle,
    name: 'Ask',
    desc: 'Get honest answers from current students. Whether you\'re thinking of studying here or planning a visit.',
  },
  {
    icon: Mail,
    name: 'Messages',
    desc: 'DM any student directly. Tap their name anywhere in the app.',
  },
]

export default function WelcomeModal({ hub, onClose }: Props) {
  const config = hubConfig[hub] || { name: hub, flag: '🌍', color: '#6B7280' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl">

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-4xl">{config.flag}</span>
          <h2 className="font-sora font-bold text-gray-900 text-xl mt-2">
            Welcome to {config.name}
          </h2>
          <p className="text-sm text-gray-400 mt-1">Here's what you can do here</p>
        </div>

        {/* Sections */}
        <div className="space-y-3 mb-6">
          {sections.map(({ icon: Icon, name, desc }) => (
            <div key={name} className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${config.color}18` }}
              >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: config.color }}
        >
          Let's go
        </button>
      </div>
    </div>
  )
}
