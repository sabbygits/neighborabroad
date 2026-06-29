import { MapPin, ExternalLink, MessageSquare, ChevronDown, Plus } from 'lucide-react'

const categoryEmojis: Record<string, string> = {
  Cafe: '☕',
  Library: '📚',
  Park: '🌿',
  Food: '🍜',
  Shopping: '🛍️',
}

interface Props {
  place: any
  hub: string
  isExpanded: boolean
  onToggle: () => void
  onAddIntel: () => void
}

export default function PlaceCard({ place, hub, isExpanded, onToggle, onAddIntel }: Props) {
  const notes = place.intel_notes || []
  const hubText = hub === 'london' ? 'text-london' : 'text-seoul'
  const hubBgLight = hub === 'london' ? 'bg-london-light' : 'bg-seoul-light'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
      <button className="w-full p-4 text-left" onClick={onToggle}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{categoryEmojis[place.category] || '📍'}</span>
              <h3 className="font-sora font-semibold text-gray-900 text-sm">{place.name}</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{place.description}</p>
            {notes.length > 0 && (
              <span className={`mt-1.5 inline-flex items-center gap-1 text-xs ${hubText} font-medium`}>
                <MessageSquare className="w-3 h-3" />
                {notes.length} intel {notes.length === 1 ? 'note' : 'notes'}
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <a
            href={place.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 flex items-center gap-2 text-sm ${hubText} font-medium`}
          >
            <MapPin className="w-4 h-4" />
            Open in {hub === 'london' ? 'Google' : 'Naver'} Maps
            <ExternalLink className="w-3 h-3" />
          </a>

          {notes.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Student Intel</p>
              {notes.map((note: any) => (
                <div key={note.id} className={`${hubBgLight} rounded-xl p-3`}>
                  <p className="text-sm text-gray-700">{note.note}</p>
                  <p className="text-xs text-gray-400 mt-1">&mdash; {note.profiles?.name}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onAddIntel}
            className={`mt-3 flex items-center gap-1.5 text-sm ${hubText} font-medium`}
          >
            <Plus className="w-4 h-4" />
            Add Intel Note
          </button>
        </div>
      )}
    </div>
  )
}
