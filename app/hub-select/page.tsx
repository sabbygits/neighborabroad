'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Star, Mail, X, HelpCircle, Flag, KeyRound, LogOut } from 'lucide-react'
import InboxSheet from '@/components/messages/InboxSheet'
import ThreadSheet from '@/components/messages/ThreadSheet'

const hubs = [
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    flagImg: 'https://flagcdn.com/w640/gb.png',
    color: '#2563EB',
    cardBg: '#EFF6FF',
    cardBgSelected: '#DBEAFE',
    description: "One of the world's most iconic cities",
    highlights: ['Tube & buses', 'World-class museums', 'Vibrant culture'],
  },
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    flag: '🇰🇷',
    flagImg: 'https://flagcdn.com/w640/kr.png',
    color: '#be1f3b',
    cardBg: '#FFF1F2',
    cardBgSelected: '#FFE4E6',
    description: "East Asia's most dynamic city",
    highlights: ['K-culture & food', 'Fast transport', 'Student-friendly'],
  },
]

const comingSoonHubs = [
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    flagImg: 'https://flagcdn.com/w640/es.png',
    description: 'Sun, architecture & student life',
  },
  {
    id: 'morocco',
    name: 'Morocco',
    country: 'Morocco',
    flag: '🇲🇦',
    flagImg: 'https://flagcdn.com/w640/ma.png',
    description: 'Culture, history & adventure',
  },
  {
    id: 'australia',
    name: 'Australia',
    country: 'Australia',
    flag: '🇦🇺',
    flagImg: 'https://flagcdn.com/w640/au.png',
    description: 'Beaches, campuses & open skies',
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    country: 'South Africa',
    flag: '🇿🇦',
    flagImg: 'https://flagcdn.com/w640/za.png',
    description: 'Where mountains meet the ocean',
  },
]

export default function HubSelectPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [suggestedHub, setSuggestedHub] = useState<string | null>(null)
  const [starred, setStarred] = useState<Set<string>>(new Set())
  const [userName, setUserName] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [inboxOpen, setInboxOpen] = useState(false)
  const [thread, setThread] = useState<{ conversationId: string; otherProfile: any } | null>(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  useEffect(() => {
    const suggested = sessionStorage.getItem('suggested_hub')
    if (suggested) setSuggestedHub(suggested)

    if (testMode) {
      const name = sessionStorage.getItem('test_display_name') || ''
      setUserName(name.split(' ')[0])
      setCurrentUserId('test-user')
      return
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setCurrentUserId(user.id)
      supabase.from('profiles').select('name, starred_hubs').eq('id', user.id).single().then(({ data }) => {
        if (data?.name) setUserName(data.name.split(' ')[0])
        if (data?.starred_hubs) setStarred(new Set(data.starred_hubs))
      })
    })
  }, [])

  async function toggleStar(e: React.MouseEvent, hubId: string) {
    e.stopPropagation()
    const next = new Set(starred)
    if (next.has(hubId)) next.delete(hubId)
    else next.add(hubId)
    setStarred(next)

    if (!testMode) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('profiles').update({ starred_hubs: Array.from(next) }).eq('id', user.id)
    }
  }

  async function handleConfirm() {
    if (!selected) return
    setLoading(true)

    try {
      if (testMode) {
        sessionStorage.setItem('test_hub', selected)
        router.push(`/${selected}/commons`)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      await supabase.from('profiles').update({ hub: selected }).eq('id', user.id)

      router.push(`/${selected}/commons`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const selectedHub = hubs.find(h => h.id === selected)

  async function handleSignOut() {
    if (testMode) {
      document.cookie = 'na-test-uid=; path=/; max-age=0'
      sessionStorage.clear()
      router.push('/')
      return
    }
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col pb-12" style={{ background: '#F7F6F3' }}>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">🌐</span>
          <span className="font-sora font-bold text-gray-900 text-[15px] tracking-tight">Neighbor Abroad</span>
        </div>
        <div className="flex items-center gap-3">
          {userName && (
            <button
              onClick={() => setAccountOpen(true)}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              {userName}
            </button>
          )}
          <button
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Messages"
            onClick={() => setInboxOpen(true)}
          >
            <Mail className="w-[18px] h-[18px]" />
          </button>
        </div>
      </header>

      <div className="px-6 pt-8 mb-6">
        <h1 className="font-sora font-bold text-[1.9rem] leading-[1.1] tracking-tight text-gray-950 mb-1">
          Choose your hub
        </h1>
        <p className="text-[13px] text-gray-400 leading-relaxed">
          Pick the city you're in or headed to. Star your favorites.
        </p>
      </div>

      <div className="px-6">

      <div className="space-y-4 mb-8">
        {[...hubs].sort((a, b) => a.name.localeCompare(b.name)).map(hub => {
          const isSelected = selected === hub.id
          const isSuggested = hub.id === suggestedHub
          const isStarred = starred.has(hub.id)
          return (
            <button
              key={hub.id}
              onClick={() => setSelected(hub.id)}
              className="w-full rounded-2xl text-left transition-all overflow-hidden relative"
              style={{
                backgroundColor: isSelected ? hub.cardBgSelected : hub.cardBg,
                border: `2px solid ${isSelected ? hub.color : 'transparent'}`,
                boxShadow: isSelected
                  ? `0 4px 20px ${hub.color}30`
                  : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {/* Flag faded in from the right */}
              <img
                src={hub.flagImg}
                alt=""
                aria-hidden
                className="absolute top-0 right-0 h-full w-2/5 object-cover"
                style={{ opacity: isSelected ? 0.22 : 0.12 }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${isSelected ? hub.cardBgSelected : hub.cardBg} 45%, ${isSelected ? hub.cardBgSelected : hub.cardBg}cc 65%, transparent)`,
                }}
              />

              {/* Star toggle */}
              <div
                onClick={(e) => toggleStar(e, hub.id)}
                role="button"
                className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full transition-all cursor-pointer"
                style={{ backgroundColor: isStarred ? '#FEF3C7' : 'rgba(255,255,255,0.7)' }}
              >
                <Star
                  className="w-4 h-4 transition-all"
                  style={{ color: isStarred ? '#F59E0B' : '#9CA3AF' }}
                  fill={isStarred ? '#F59E0B' : 'none'}
                />
              </div>

              {/* Content */}
              <div className="relative p-5 flex items-start gap-4">
                <span className="text-4xl">{hub.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3
                      className="font-sora font-bold text-lg"
                      style={{ color: isSelected ? hub.color : '#111' }}
                    >
                      {hub.name}
                    </h3>
                    <span className="text-xs text-gray-400">{hub.country}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{hub.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hub.highlights.map(h => (
                      <span
                        key={h}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={
                          isSelected
                            ? { backgroundColor: `${hub.color}18`, color: hub.color }
                            : { backgroundColor: '#f3f4f6', color: '#4b5563' }
                        }
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </button>
          )
        })}
      </div>

      {/* Coming soon hubs */}
      <div className="space-y-3 mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Coming soon</p>
        {[...comingSoonHubs].sort((a, b) => a.name.localeCompare(b.name)).map(hub => (
          <div
            key={hub.id}
            className="w-full rounded-2xl overflow-hidden relative opacity-60"
            style={{ backgroundColor: '#EFEFEC', border: '2px solid transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <img
              src={hub.flagImg}
              alt=""
              aria-hidden
              className="absolute top-0 right-0 h-full w-2/5 object-cover"
              style={{ opacity: 0.1 }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #EFEFEC 45%, #EFEFECcc 65%, transparent)' }} />
            <div className="relative p-4 flex items-center gap-4">
              <span className="text-3xl">{hub.flag}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-sora font-bold text-base text-gray-500">{hub.name}</h3>
                  <span className="text-xs text-gray-400">{hub.country}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">Coming soon</span>
                </div>
                <p className="text-sm text-gray-400">{hub.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom sheet when a hub is selected */}
      {selected && selectedHub && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white w-full max-w-md rounded-t-3xl px-6 pt-5 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">{selectedHub.flag}</span>
              <div>
                <h3 className="font-sora font-bold text-lg text-gray-900">{selectedHub.name}</h3>
                <p className="text-sm text-gray-400">{selectedHub.country}</p>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Enter ${selectedHub.name} →`}
            </button>
          </div>
        </div>
      )}
      </div>{/* end px-6 */}

      {/* Account sheet */}
      {accountOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setAccountOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white w-full max-w-md rounded-t-3xl px-6 pt-4 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center justify-between mb-5">
              <p className="font-sora font-semibold text-gray-900">{userName}</p>
              <button onClick={() => setAccountOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { setAccountOpen(false); router.push('/forgot-password') }}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <KeyRound className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-800">Reset password</span>
              </button>
              <a
                href="mailto:support@neighborabroad.com"
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => setAccountOpen(false)}
              >
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-800">Help & support</span>
              </a>
              <a
                href="mailto:support@neighborabroad.com?subject=Report"
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => setAccountOpen(false)}
              >
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Flag className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-800">Report a problem</span>
              </a>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm font-medium text-red-400">Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {inboxOpen && currentUserId && (
        <InboxSheet
          currentUserId={currentUserId}
          onClose={() => setInboxOpen(false)}
          onOpenThread={(convId, otherProfile) => {
            setInboxOpen(false)
            setThread({ conversationId: convId, otherProfile })
          }}
        />
      )}

      {thread && currentUserId && (
        <ThreadSheet
          conversationId={thread.conversationId}
          otherProfile={thread.otherProfile}
          currentUserId={currentUserId}
          onBack={() => { setThread(null); setInboxOpen(true) }}
          onClose={() => setThread(null)}
        />
      )}
    </div>
  )
}
