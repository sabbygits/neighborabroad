'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Send, Loader2 } from 'lucide-react'
import TimeAgo from '@/components/ui/TimeAgo'

const HUB_FLAG: Record<string, string> = { london: '🇬🇧', seoul: '🇰🇷' }
const HUB_COLOR: Record<string, string> = { london: '#2563EB', seoul: '#be1f3b' }

interface Props {
  question: any
  hub: string
  currentUserId: string | null
  onClose: () => void
  onAuthorClick: (authorId: string) => void
}

export default function QuestionReplyModal({ question, hub, currentUserId, onClose, onAuthorClick }: Props) {
  const [replies, setReplies] = useState<any[]>([])
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'

  useEffect(() => {
    fetchReplies()
  }, [])

  async function fetchReplies() {
    const { data } = await supabase
      .from('hub_question_replies')
      .select('*, profiles(id, name, university, base_hub)')
      .eq('question_id', question.id)
      .order('created_at', { ascending: true })
    setReplies(data || [])
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim()) return
    setLoading(true)

    const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
    let authorId = 'test-user'
    if (!testMode) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      authorId = user.id
    }

    await supabase.from('hub_question_replies').insert({
      question_id: question.id,
      author_id: authorId,
      body: reply.trim(),
    })

    setReply('')
    setLoading(false)
    fetchReplies()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-sora font-semibold text-gray-900">Answers</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Original question */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{question.title}</h3>
          {question.body && <p className="text-sm text-gray-500">{question.body}</p>}
        </div>

        {/* Answers */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {replies.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">No answers yet. Be the first!</p>
          ) : (
            replies.map(r => {
              const isLocal = r.profiles?.base_hub === hub
              return (
                <div key={r.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <button
                      onClick={() => { onClose(); onAuthorClick(r.author_id) }}
                      className="text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {r.profiles?.name}
                    </button>
                    {isLocal && (
                      <span
                        className="text-xs font-semibold px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: HUB_COLOR[hub] }}
                      >
                        {HUB_FLAG[hub]} studying here
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      <TimeAgo date={r.created_at} />
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.body}</p>
                </div>
              )
            })
          )}
        </div>

        {/* Reply input */}
        <form onSubmit={handleReply} className="p-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Share your experience..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !reply.trim()}
            className={`w-10 h-10 rounded-xl ${hubBg} text-white flex items-center justify-center disabled:opacity-50 flex-shrink-0`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}
