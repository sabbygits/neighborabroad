'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'

interface Props {
  conversationId: string
  otherProfile: any
  currentUserId: string
  hub?: string
  onBack: () => void
  onClose: () => void
}

const hubColor: Record<string, string> = {
  london: '#2563EB',
  seoul: '#be1f3b',
}

export default function ThreadSheet({ conversationId, otherProfile, currentUserId, hub, onBack, onClose }: Props) {
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const color = (hub && hubColor[hub]) || '#6B7280'

  const getInitials = (name: string) =>
    name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const isTestMode = conversationId.startsWith('test-conv-')

  useEffect(() => {
    if (isTestMode) {
      const stored = JSON.parse(sessionStorage.getItem(`test_messages_${conversationId}`) || '[]')
      setMessages(stored)
      setTimeout(() => bottomRef.current?.scrollIntoView(), 50)
      return
    }

    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      setMessages(data || [])
      setTimeout(() => bottomRef.current?.scrollIntoView(), 50)
    }
    fetchMessages()

    async function markRead() {
      const { data: conv } = await supabase
        .from('conversations')
        .select('participant_1')
        .eq('id', conversationId)
        .single()
      if (!conv) return
      const field = conv.participant_1 === currentUserId ? 'p1_last_read_at' : 'p2_last_read_at'
      await supabase.from('conversations').update({ [field]: new Date().toISOString() }).eq('id', conversationId)
    }
    markRead()

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)

    if (isTestMode) {
      const fakeMsg = { id: Date.now().toString(), sender_id: currentUserId, body: text.trim(), created_at: new Date().toISOString() }
      setMessages(prev => {
        const updated = [...prev, fakeMsg]
        sessionStorage.setItem(`test_messages_${conversationId}`, JSON.stringify(updated))
        return updated
      })
      // Update last message in sessionStorage so inbox reflects it
      const convs = JSON.parse(sessionStorage.getItem('test_conversations') || '[]')
      const idx = convs.findIndex((c: any) => c.id === conversationId)
      if (idx !== -1) { convs[idx].lastMessage = text.trim(); convs[idx].lastAt = fakeMsg.created_at }
      sessionStorage.setItem('test_conversations', JSON.stringify(convs))
      setText('')
      setSending(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      return
    }

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      body: text.trim(),
    })
    setText('')
    setSending(false)
  }

  return (
    <div className="fixed inset-0 flex items-end justify-center" style={{ zIndex: 60 }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {getInitials(otherProfile?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{otherProfile?.name}</p>
            <p className="text-xs text-gray-400">{otherProfile?.university}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {messages.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-8">Say hello 👋</p>
          )}
          {messages.map(msg => {
            const isMe = msg.sender_id === currentUserId
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={isMe
                    ? { backgroundColor: color, color: 'white', borderBottomRightRadius: 4 }
                    : { backgroundColor: '#F3F4F6', color: '#1F2937', borderBottomLeftRadius: 4 }
                  }
                >
                  {msg.body}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 transition-all"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 text-white transition-opacity"
            style={{ backgroundColor: color }}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}
