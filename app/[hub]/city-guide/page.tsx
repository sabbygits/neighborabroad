'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Plus, ChevronDown, ExternalLink, MessageSquare } from 'lucide-react'
import IntelNoteModal from '@/components/city-guide/IntelNoteModal'

const categoryEmojis: Record<string, string> = {
  Cafe: '☕',
  Library: '📚',
  Park: '🌿',
  Food: '🍜',
  Shopping: '🛍️',
}

export default function CityGuidePage({ params }: { params: { hub: string } }) {
  const { hub } = params
  const [places, setPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedPlace, setExpandedPlace] = useState<string | null>(null)
  const [intelPlace, setIntelPlace] = useState<any | null>(null)
  const supabase = createClient()

  const fetchPlaces = useCallback(async () => {
    const { data } = await supabase
      .from('places')
      .select('*, intel_notes(*, profiles(name))')
      .eq('hub', hub)
      .order('name', { ascending: true })

    setPlaces(data || [])
    setLoading(false)
  }, [hub, supabase])

  useEffect(() => {
    setLoading(true)
    fetchPlaces()
  }, [fetchPlaces])

  const hubText = hub === 'london' ? 'text-london' : 'text-seoul'
  const hubBgLight = hub === 'london' ? 'bg-london-light' : 'bg-seoul-light'

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 space-y-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))
        ) : places.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No places found.</p>
          </div>
        ) : (
          places.map(place => {
            const isExpanded = expandedPlace === place.id
            const notes = place.intel_notes || []

            return (
              <div key={place.id} className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                <button
                  className="w-full p-4 text-left"
                  onClick={() => setExpandedPlace(isExpanded ? null : place.id)}
                >
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
                      onClick={() => setIntelPlace(place)}
                      className={`mt-3 flex items-center gap-1.5 text-sm ${hubText} font-medium`}
                    >
                      <Plus className="w-4 h-4" />
                      Add Intel Note
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {intelPlace && (
        <IntelNoteModal
          place={intelPlace}
          hub={hub}
          onClose={() => setIntelPlace(null)}
          onCreated={() => { setIntelPlace(null); fetchPlaces() }}
        />
      )}
    </div>
  )
}
