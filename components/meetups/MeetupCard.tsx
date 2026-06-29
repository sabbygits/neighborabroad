import { MapPin, Calendar, Clock, Users } from 'lucide-react'
import { format } from 'date-fns'

const categoryColors: Record<string, string> = {
  Social: 'bg-pink-100 text-pink-700',
  Culture: 'bg-indigo-100 text-indigo-700',
  Study: 'bg-cyan-100 text-cyan-700',
  Outdoors: 'bg-green-100 text-green-700',
  Food: 'bg-orange-100 text-orange-700',
}

interface Props {
  meetup: any
  hub: string
  isJoined: boolean
  onJoin: () => void
  joiningId: string | null
}

export default function MeetupCard({ meetup, hub, isJoined, onJoin, joiningId }: Props) {
  const meetupDate = new Date(meetup.date)
  const isPast = meetupDate < new Date()
  const attendeeCount = meetup.meetup_joins?.length || 0

  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'
  const hubText = hub === 'london' ? 'text-london' : 'text-seoul'
  const hubBorder = hub === 'london' ? 'border-london' : 'border-seoul'
  const hubBgLight = hub === 'london' ? 'bg-london-light' : 'bg-seoul-light'

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-50 ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[meetup.category] || 'bg-gray-100 text-gray-600'}`}>
              {meetup.category}
            </span>
            {isPast && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Past</span>}
          </div>
          <h3 className="font-sora font-semibold text-gray-900 text-sm leading-snug mb-1.5">
            {meetup.name}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-2.5">{meetup.description}</p>

          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {meetup.location}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(meetupDate, 'MMM d, yyyy')}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(meetupDate, 'h:mm a')}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <button
            onClick={onJoin}
            disabled={!!joiningId || isPast}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isJoined
                ? `${hubBgLight} ${hubText} ${hubBorder}`
                : `${hubBg} text-white border-transparent`
            } disabled:opacity-50`}
          >
            {isJoined ? 'Joined ✓' : 'Join'}
          </button>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {attendeeCount}
          </span>
        </div>
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-gray-50">
        <span className="text-xs text-gray-400">by {meetup.profiles?.name} &middot; {meetup.profiles?.university}</span>
      </div>
    </div>
  )
}
