'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Bookmark, ArrowLeft } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

interface Props {
  currentUserId: string
  hub: string
  onClose: () => void
}

const categoryColors: Record<string, string> = {
  Travel: 'bg-blue-100 text-blue-700',
  Question: 'bg-purple-100 text-purple-700',
  Social: 'bg-green-100 text-green-700',
  Safety: 'bg-red-100 text-red-700',
}

const categoryEmoji: Record<string, string> = {
  Travel: '✈️',
  Question: '💬',
  Social: '🎉',
  Safety: '🛡️',
}

export default function SavedPostsSheet({ currentUserId, hub, onClose }: Props) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('saved_posts')
        .select('post_id, posts(id, title, body, category, created_at, profiles(name, university))')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
      const flat = (data || []).map((s: any) => s.posts).filter(Boolean)
      setPosts(flat)
      setLoading(false)
    }
    fetch()
  }, [currentUserId])

  // Group by category
  const collections = posts.reduce((acc: Record<string, any[]>, post) => {
    const cat = post.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(post)
    return acc
  }, {})

  const collectionNames = Object.keys(collections)
  const activePosts = activeCollection ? collections[activeCollection] : []

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {activeCollection && (
              <button onClick={() => setActiveCollection(null)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-1">
                <ArrowLeft className="w-3.5 h-3.5 text-gray-600" />
              </button>
            )}
            <h2 className="font-sora font-semibold text-gray-900">
              {activeCollection ?? 'Saved'}
            </h2>
            {activeCollection && (
              <span className="text-xs text-gray-400">{activePosts.length} posts</span>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Bookmark className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-medium">Nothing saved yet</p>
              <p className="text-xs text-gray-300 mt-1">Tap the bookmark icon on any post to save it.</p>
            </div>
          ) : !activeCollection ? (
            // Collections grid
            <div className="p-4 grid grid-cols-2 gap-3">
              {collectionNames.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCollection(cat)}
                  className="bg-gray-50 rounded-2xl p-4 text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl mb-2 block">{categoryEmoji[cat] || '📌'}</span>
                  <p className="font-semibold text-sm text-gray-900">{cat}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{collections[cat].length} saved</p>
                </button>
              ))}
            </div>
          ) : (
            // Posts in collection
            <div className="px-4 py-3 space-y-3">
              {activePosts.map((post: any) => (
                <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                  </div>
                  <h3 className="font-sora font-semibold text-gray-900 text-sm leading-snug mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2">{post.body}</p>
                  <p className="text-xs text-gray-400">{post.profiles?.name} · {post.profiles?.university}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
