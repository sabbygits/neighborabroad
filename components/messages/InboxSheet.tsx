'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, MessageSquare } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

interface Props {
  hub?: string
  currentUserId: string
  onClose: () => void
  onOpenThread: (conversationId: string, otherProfile: any) => void
}

const hubColor: Record<string, string> = {
  london: '#2563EB',
  seoul: '#be1f3b',
}

export default function InboxSheet({ hub, currentUserId, onClose, onOpenThread }: Props) {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const color = (hub && hubColor[hub]) || '#6B7280'

  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  useEffect(() => {
    if (isTestMode) {
      const stored = JSON.parse(sessionStorage.getItem('test_conversations') || '[]')
      setConversations(stored)
      setLoading(false)
      return
    }

    async function fetch() {
      const { data } = await supabase
        .from('conversations')
        .select(`
          *,
          p1:profiles!conversations_participant_1_fkey(id, name, university, base_hub),
          p2:profiles!conversations_participant_2_fkey(id, name, university, base_hub)
        `)
        .or(`participant_1.eq.${currentUserId},participant_2.eq.${currentUserId}`)
        .order('last_message_at', { ascending: false })

      setConversations(data || [])
      setLoading(false)
    }
    fetch()
  }, [currentUserId])

  function getOther(conv: any) {
    return conv.participant_1 === currentUserId ? conv.p2 : conv.p1
  }

  const getInitials = (name: string) =>
    name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-sora font-semibold text-gray-900">Messages</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-medium">No messages yet</p>
              <p className="text-xs text-gray-300 mt-1">Tap someone's name in Commons to start chatting.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {conversations.map(conv => {
                const other = isTestMode ? conv.otherProfile : getOther(conv)
                const lastAt = isTestMode ? conv.lastAt : conv.last_message_at
                const preview = isTestMode ? conv.lastMessage : null
                return (
                  <button
                    key={conv.id}
                    onClick={() => onOpenThread(conv.id, other)}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-sora font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {getInitials(other?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{other?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{preview || other?.university}</p>
                    </div>
                    <span className="text-xs text-gray-300 flex-shrink-0">{timeAgo(lastAt)}</span>
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
