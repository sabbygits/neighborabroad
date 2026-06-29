'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Send, Loader2 } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

interface Props {
  post: any
  hub: string
  onClose: () => void
  onAuthorClick: (authorId: string) => void
}

export default function ReplyModal({ post, hub, onClose, onAuthorClick }: Props) {
  const [replies, setReplies] = useState<any[]>([])
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [isExplorer, setIsExplorer] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setIsExplorer(sessionStorage.getItem('onboarding_status') === 'exploring')
  }, [])

  useEffect(() => {
    fetchReplies()
  }, [])

  async function fetchReplies() {
    const { data } = await supabase
      .from('replies')
      .select('*, profiles(name, university)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
    setReplies(data || [])
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim()) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('replies').insert({
      post_id: post.id,
      author_id: user.id,
      body: reply.trim(),
    })

    // Notify post author
    if (post.author_id && post.author_id !== user.id) {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: post.author_id,
          title: 'New reply on your post',
          body: reply.trim(),
          url: `/${hub}/commons`,
        }),
      })
    }

    setReply('')
    setLoading(false)
    fetchReplies()
  }

  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-sora font-semibold text-gray-900">Replies</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Original post */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{post.title}</h3>
          <p className="text-sm text-gray-600">{post.body}</p>
        </div>

        {/* Replies */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {replies.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">No replies yet. Start the conversation!</p>
          ) : (
            replies.map(r => (
              <div key={r.id} className="flex gap-3">
                <div className="flex-1 bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => { onClose(); onAuthorClick(r.author_id) }}
                      className="text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {r.profiles?.name}
                    </button>
                    <span className="text-xs text-gray-400">{timeAgo(r.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{r.body}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply input */}
        {isExplorer ? (
          <div className="p-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Only enrolled students can reply. Use <span className="font-semibold">Ask</span> to post your questions.</p>
          </div>
        ) : (
        <form onSubmit={handleReply} className="p-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-london/20 focus:border-london"
          />
          <button
            type="submit"
            disabled={loading || !reply.trim()}
            className={`w-10 h-10 rounded-xl ${hubBg} text-white flex items-center justify-center disabled:opacity-50 flex-shrink-0`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        )}
      </div>
    </div>
  )
}
