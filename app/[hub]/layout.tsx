'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { HUB_CONFIG } from '@/lib/utils'
import { MessageSquare, Calendar, User, Mail, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import InboxSheet from '@/components/messages/InboxSheet'
import ThreadSheet from '@/components/messages/ThreadSheet'
import WelcomeModal from '@/components/WelcomeModal'
import NotificationPrompt from '@/components/NotificationPrompt'

const navItems = [
  { id: 'commons', label: 'Commons', icon: MessageSquare, href: 'commons' },
  { id: 'meetups', label: 'Meetups', icon: Calendar, href: 'meetups' },
  { id: 'ask', label: 'Ask', icon: HelpCircle, href: 'ask' },
  { id: 'profile', label: 'Profile', icon: User, href: 'profile' },
]

export default function HubLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { hub: string }
}) {
  const { hub } = params
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [inboxOpen, setInboxOpen] = useState(false)
  const [thread, setThread] = useState<{ conversationId: string; otherProfile: any } | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showNotifPrompt, setShowNotifPrompt] = useState(false)
  const hubConfig = HUB_CONFIG[hub as keyof typeof HUB_CONFIG]

  useEffect(() => {
    if (!sessionStorage.getItem('welcomed')) {
      setShowWelcome(true)
    }
  }, [hub])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  function handleWelcomeClose() {
    sessionStorage.setItem('welcomed', '1')
    setShowWelcome(false)
    if (!localStorage.getItem('notif_asked') && 'Notification' in window && Notification.permission === 'default') {
      setShowNotifPrompt(true)
    }
  }

  useEffect(() => {
    function handleOpenThread(e: Event) {
      const { convId, otherProfile } = (e as CustomEvent).detail
      openThread(convId, otherProfile)
    }
    window.addEventListener('open-thread', handleOpenThread)
    return () => window.removeEventListener('open-thread', handleOpenThread)
  }, [])

  useEffect(() => {
    const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
    if (testMode) {
      const name = sessionStorage.getItem('test_display_name') || 'Tester'
      setUserName(name)
      setCurrentUserId('test-user')
      return
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/')
        return
      }
      setCurrentUserId(user.id)
      supabase.from('profiles').select('name').eq('id', user.id).single().then(({ data }) => {
        if (data) setUserName(data.name)
      })
    })
  }, [router])

  useEffect(() => {
    if (!currentUserId) return
    const supabase = createClient()
    async function fetchUnread() {
      const { data } = await supabase
        .from('conversations')
        .select('participant_1, last_message_at, p1_last_read_at, p2_last_read_at')
        .or(`participant_1.eq.${currentUserId},participant_2.eq.${currentUserId}`)
      if (!data) return
      const count = data.filter(conv => {
        const lastRead = conv.participant_1 === currentUserId ? conv.p1_last_read_at : conv.p2_last_read_at
        return conv.last_message_at && (!lastRead || conv.last_message_at > lastRead)
      }).length
      setUnreadCount(count)
    }
    fetchUnread()
  }, [currentUserId, thread])

  if (!hubConfig) {
    router.push('/')
    return null
  }

  const activeTab = pathname.split('/')[2] || 'commons'
  const hubColor = hub === 'london' ? '#2563EB' : '#be1f3b'
  const hubText = hub === 'london' ? 'text-london' : 'text-seoul'
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  function openThread(conversationId: string, otherProfile: any) {
    setInboxOpen(false)
    setThread({ conversationId, otherProfile })
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F2F1EE' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-sora font-bold text-lg text-gray-900">Neighbor</span>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: hubColor }}
          >
            {hubConfig.emoji} {hubConfig.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-sm text-gray-500">{userName.split(' ')[0]}</span>
          )}
          <button
            onClick={() => setInboxOpen(true)}
            className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            title="Messages"
          >
            <Mail className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 safe-bottom z-40">
        <div className="flex">
          {navItems.map(item => {
            const isActive = activeTab === item.id
            return (
              <Link
                key={item.id}
                href={`/${hub}/${item.href}`}
                className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${
                  isActive ? hubText : 'text-gray-400'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Inbox sheet */}
      {inboxOpen && currentUserId && (
        <InboxSheet
          hub={hub}
          currentUserId={currentUserId}
          onClose={() => setInboxOpen(false)}
          onOpenThread={openThread}
        />
      )}

      {/* Welcome modal */}
      {showWelcome && (
        <WelcomeModal hub={hub} onClose={handleWelcomeClose} />
      )}

      {/* Notification permission prompt */}
      {showNotifPrompt && !showWelcome && (
        <NotificationPrompt hub={hub} onClose={() => setShowNotifPrompt(false)} />
      )}

      {/* Thread sheet */}
      {thread && currentUserId && (
        <ThreadSheet
          conversationId={thread.conversationId}
          otherProfile={thread.otherProfile}
          currentUserId={currentUserId}
          hub={hub}
          onBack={() => { setThread(null); setInboxOpen(true) }}
          onClose={() => setThread(null)}
        />
      )}
    </div>
  )
}
