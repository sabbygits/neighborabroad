'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, MapPin, Calendar as CalIcon, Users, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import CreateMeetupModal from '@/components/meetups/CreateMeetupModal'
import AuthorProfileModal from '@/components/commons/AuthorProfileModal'
import AttendeesSheet from '@/components/meetups/AttendeesSheet'
import { format } from 'date-fns'

const CATEGORIES = ['All', 'Social', 'Outdoors', 'Food']

function getMapsUrl(location: string, hub: string): string {
  const query = encodeURIComponent(location)
  if (hub === 'seoul') {
    return `https://map.naver.com/v5/search/${query}`
  }
  const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Mac/.test(navigator.userAgent)
  return isApple
    ? `https://maps.apple.com/?q=${query}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`
}

const categoryColors: Record<string, string> = {
  Social: 'bg-pink-100 text-pink-700',
  Outdoors: 'bg-green-100 text-green-700',
  Food: 'bg-orange-100 text-orange-700',
}

export default function MeetupsPage({ params }: { params: { hub: string } }) {
  const { hub } = params
  const [meetups, setMeetups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [showCreate, setShowCreate] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [joinedMeetups, setJoinedMeetups] = useState<Set<string>>(new Set())
  const [joiningId, setJoiningId] = useState<string | null>(null)
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null)
  const [attendeesMeetup, setAttendeesMeetup] = useState<any | null>(null)
  const [showPast, setShowPast] = useState(false)
  const supabase = createClient()

  const fetchMeetups = useCallback(async () => {
    const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
    let uid: string | null = null

    try {
      if (testMode) {
        uid = 'test-user'
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        uid = user.id
      }
      setUserId(uid)

      let query = supabase
        .from('meetups')
        .select('*, profiles(name, university), meetup_joins(id, user_id, profiles(id, name, university, base_hub))')
        .eq('hub', hub)
        .order('date', { ascending: true })

      if (filter !== 'All') {
        query = query.eq('category', filter)
      }

      const { data } = await query
      setMeetups(data || [])

      if (!testMode) {
        const { data: joins } = await supabase
          .from('meetup_joins')
          .select('meetup_id')
          .eq('user_id', uid)
        setJoinedMeetups(new Set(joins?.map((j: any) => j.meetup_id) || []))
      }
    } finally {
      setLoading(false)
    }
  }, [hub, filter])

  useEffect(() => {
    setLoading(true)
    fetchMeetups()
  }, [fetchMeetups])

  async function handleJoin(meetupId: string) {
    if (!userId || joiningId) return
    setJoiningId(meetupId)

    const isJoined = joinedMeetups.has(meetupId)
    if (isJoined) {
      await supabase.from('meetup_joins').delete()
        .eq('meetup_id', meetupId).eq('user_id', userId)
      setJoinedMeetups(prev => { const n = new Set(prev); n.delete(meetupId); return n })
    } else {
      await supabase.from('meetup_joins').insert({ meetup_id: meetupId, user_id: userId })
      setJoinedMeetups(prev => new Set([...prev, meetupId]))
    }
    setJoiningId(null)
    fetchMeetups()
  }

  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'
  const hubText = hub === 'london' ? 'text-london' : 'text-seoul'
  const hubBorder = hub === 'london' ? 'border-london' : 'border-seoul'
  const hubBgLight = hub === 'london' ? 'bg-london-light' : 'bg-seoul-light'
  const hubColor = hub === 'london' ? '#2563EB' : '#be1f3b'

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-scroll scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === cat ? `${hubBg} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
            </div>
          ))
        ) : (() => {
          const now = new Date()
          const upcoming = meetups.filter(m => new Date(m.date) >= now)
          const past = meetups.filter(m => new Date(m.date) < now).reverse()

          const renderCard = (meetup: any, isPast: boolean) => {
            const isJoined = joinedMeetups.has(meetup.id)
            const attendeeCount = meetup.meetup_joins?.length || 0
            const meetupDate = new Date(meetup.date)

            return (
              <div key={meetup.id} className={`bg-white rounded-2xl p-4 ${isPast ? 'opacity-60' : ''}`} style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                {/* Author row */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: hubColor }}
                  >
                    {(meetup.profiles?.name || '?').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setSelectedAuthorId(meetup.creator_id)}
                      className="text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {meetup.profiles?.name}
                    </button>
                    {meetup.profiles?.university && (
                      <span className="text-xs text-gray-400"> · {meetup.profiles.university}</span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[meetup.category] || 'bg-gray-100 text-gray-600'}`}>
                    {meetup.category}
                  </span>
                  {isPast && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Past</span>}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sora font-semibold text-gray-900 text-sm leading-snug mb-1.5">
                      {meetup.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2.5">{meetup.description}</p>

                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <a
                        href={getMapsUrl(meetup.location, hub)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-600 underline-offset-2 hover:underline transition-colors"
                      >
                        <MapPin className="w-3 h-3" />
                        {meetup.location}
                      </a>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <CalIcon className="w-3 h-3" />
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
                      onClick={() => handleJoin(meetup.id)}
                      disabled={!!joiningId || isPast}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isJoined
                          ? `${hubBgLight} ${hubText} ${hubBorder}`
                          : `${hubBg} text-white border-transparent`
                      } disabled:opacity-50`}
                    >
                      {isJoined ? 'Joined ✓' : 'Join'}
                    </button>
                    <button
                      onClick={() => setAttendeesMeetup(meetup)}
                      className="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-600 transition-colors"
                    >
                      <Users className="w-3 h-3" />
                      {attendeeCount}
                    </button>
                  </div>
                </div>

              </div>
            )
          }

          return (
            <>
              {upcoming.length === 0 && past.length === 0 ? (
                <div className="flex flex-col items-center text-center py-16 px-6">
                  <span className="text-5xl mb-4">📅</span>
                  <p className="font-sora font-semibold text-gray-700 text-base mb-1">No meetups yet</p>
                  <p className="text-sm text-gray-400 leading-relaxed">Be the first to organize something — a food run, a hike, a study session. Anything goes.</p>
                </div>
              ) : upcoming.length === 0 ? (
                <div className="flex flex-col items-center text-center py-10 px-6">
                  <span className="text-4xl mb-3">👀</span>
                  <p className="font-sora font-semibold text-gray-700 text-base mb-1">No upcoming meetups</p>
                  <p className="text-sm text-gray-400">Create one and get people together.</p>
                </div>
              ) : (
                upcoming.map(m => renderCard(m, false))
              )}

              {past.length > 0 && (
                <div className="pt-2 pb-4">
                  <button
                    onClick={() => setShowPast(v => !v)}
                    className="w-full flex items-center justify-between px-1 py-2 mb-1"
                  >
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Past events ({past.length})</span>
                    {showPast ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {showPast && (
                    <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-50" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                      {past.map(m => {
                        const meetupDate = new Date(m.date)
                        const attendeeCount = m.meetup_joins?.length || 0
                        return (
                          <div key={m.id} className="px-4 py-3 flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-700 leading-snug truncate">{m.name}</p>
                              <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <CalIcon className="w-3 h-3" />
                                  {format(meetupDate, 'MMM d')}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-[120px]">{m.location}</span>
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {attendeeCount} went
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )
        })()}
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className={`fixed bottom-24 right-4 w-14 h-14 rounded-full ${hubBg} text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-30`}
      >
        <Plus className="w-6 h-6" />
      </button>

      {showCreate && (
        <CreateMeetupModal
          hub={hub}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); fetchMeetups() }}
        />
      )}

      {attendeesMeetup && (
        <AttendeesSheet
          meetup={attendeesMeetup}
          hub={hub}
          onClose={() => setAttendeesMeetup(null)}
          onAuthorClick={(id) => setSelectedAuthorId(id)}
        />
      )}

      {selectedAuthorId && (
        <AuthorProfileModal
          authorId={selectedAuthorId}
          hub={hub}
          currentUserId={userId}
          onMessage={(convId, otherProfile) => {
            setSelectedAuthorId(null)
            window.dispatchEvent(new CustomEvent('open-thread', { detail: { convId, otherProfile } }))
          }}
          onClose={() => setSelectedAuthorId(null)}
        />
      )}
    </div>
  )
}
