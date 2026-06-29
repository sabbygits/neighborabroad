'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, BadgeCheck, MapPin, Loader2, Instagram, Flag } from 'lucide-react'
import { getOrCreateConversation } from '@/lib/dm'
import ReportSheet from '@/components/commons/ReportSheet'

interface Props {
  authorId: string
  hub: string
  currentUserId: string | null
  onMessage: (conversationId: string, otherProfile: any) => void
  onClose: () => void
}

const hubColor: Record<string, string> = {
  london: '#2563EB',
  seoul: '#be1f3b',
}

const hubFlag: Record<string, string> = {
  london: '🇬🇧',
  seoul: '🇰🇷',
}

const hubName: Record<string, string> = {
  london: 'London',
  seoul: 'Seoul',
}

export default function AuthorProfileModal({ authorId, hub, currentUserId, onMessage, onClose }: Props) {
  const [profile, setProfile] = useState<any>(null)
  const [postCount, setPostCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [messaging, setMessaging] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const supabase = createClient()
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  useEffect(() => {
    async function fetch() {
      const [{ data: p }, { count }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', authorId).single(),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', authorId).eq('hub', hub),
      ])
      setProfile(p)
      setPostCount(count || 0)
      setLoading(false)
    }
    fetch()
  }, [authorId])

  const getInitials = (name: string) =>
    name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const isEduVerified = (email: string) =>
    email?.endsWith('.edu') || email?.includes('.ac.')

  const isVisitor = profile?.base_hub && profile.base_hub !== hub
  const color = hubColor[profile?.base_hub || hub] || hubColor[hub]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl"
        style={{ maxHeight: '75vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin" />
          </div>
        ) : (
          <div className="px-6 pb-8 pt-4 flex flex-col items-center text-center">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-sora font-bold text-xl mb-3 shadow-sm"
              style={{ backgroundColor: color }}
            >
              {getInitials(profile?.name)}
            </div>

            {/* Name + badge */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <h2 className="font-sora font-bold text-gray-900 text-lg">{profile?.name}</h2>
              {isEduVerified(profile?.email) && (
                <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
              )}
            </div>

            {/* University */}
            <p className="text-sm text-gray-400 mb-3">{profile?.university}</p>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-5">
              {profile?.base_hub && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
                  <span className="text-sm">{hubFlag[profile.base_hub]}</span>
                  <span className="text-xs font-medium text-gray-600">
                    {isVisitor ? `Based in ${hubName[profile.base_hub]}` : `${hubName[profile.base_hub]} local`}
                  </span>
                </div>
              )}
              {isVisitor && (
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span className="text-xs font-medium text-amber-600">Visiting {hubName[hub]}</span>
                </div>
              )}
            </div>

            {/* Instagram */}
            {profile?.instagram_handle && (
              <a
                href={`https://instagram.com/${profile.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 rounded-full mb-4"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                <span className="text-xs font-medium text-pink-500">@{profile.instagram_handle}</span>
              </a>
            )}

            {/* Stats */}
            <div className="w-full bg-gray-50 rounded-2xl px-6 py-4 mb-5">
              <p className="text-2xl font-bold font-sora text-gray-900">{postCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">posts in {hubName[hub]}</p>
            </div>

            {/* Studying in */}
            {profile?.studying_in && (
              <p className="text-sm font-medium text-gray-700 mb-1">✈️ Studying abroad in {profile.studying_in}</p>
            )}

            {/* Bio */}
            {profile?.bio && (
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{profile.bio}</p>
            )}

            {/* Message button */}
            <button
              disabled={!currentUserId || currentUserId === authorId || messaging}
              onClick={async () => {
                if (!currentUserId || currentUserId === authorId) return
                setMessaging(true)
                if (isTestMode) {
                  setMessaging(false)
                  const convId = `test-conv-${authorId}`
                  // Persist conversation so inbox can show it
                  const existing = JSON.parse(sessionStorage.getItem('test_conversations') || '[]')
                  if (!existing.find((c: any) => c.id === convId)) {
                    existing.unshift({ id: convId, otherProfile: profile, lastMessage: null, lastAt: new Date().toISOString() })
                    sessionStorage.setItem('test_conversations', JSON.stringify(existing))
                  }
                  onClose()
                  onMessage(convId, profile)
                  return
                }
                const convId = await getOrCreateConversation(supabase, currentUserId, authorId)
                setMessaging(false)
                if (convId) { onClose(); onMessage(convId, profile) }
              }}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: color, color: 'white' }}
            >
              {messaging
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : currentUserId === authorId
                  ? "That's you"
                  : 'Message'
              }
            </button>

            {/* Report button — only show for other users */}
            {currentUserId && currentUserId !== authorId && (
              <button
                onClick={() => setShowReport(true)}
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-red-400 transition-colors mt-3"
              >
                <Flag className="w-3 h-3" />
                Report this user
              </button>
            )}
          </div>
        )}
      </div>

      {showReport && currentUserId && profile && (
        <ReportSheet
          reportedUserId={authorId}
          reportedName={profile.name}
          currentUserId={currentUserId}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  )
}
