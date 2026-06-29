'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, MessageCircle, Bookmark, Trash2 } from 'lucide-react'
import CreatePostModal from '@/components/commons/CreatePostModal'
import ReplyModal from '@/components/commons/ReplyModal'
import AuthorProfileModal from '@/components/commons/AuthorProfileModal'
import TimeAgo from '@/components/ui/TimeAgo'
import SearchBar from '@/components/ui/SearchBar'

const CATEGORIES = ['All', 'Travel', 'Question', 'Social', 'Safety']

const categoryColors: Record<string, string> = {
  Travel: 'bg-blue-100 text-blue-700',
  Question: 'bg-purple-100 text-purple-700',
  Social: 'bg-green-100 text-green-700',
  Safety: 'bg-red-100 text-red-700',
}

export default function CommonsPage({ params }: { params: { hub: string } }) {
  const { hub } = params
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set())
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
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
        .from('posts')
        .select(`*, profiles(name, university), replies(id)`)
        .eq('hub', hub)
        .order('created_at', { ascending: false })

      if (filter !== 'All') {
        query = query.eq('category', filter)
      }

      const { data } = await query
      setPosts(data || [])

      if (!testMode) {
        const { data: saves } = await supabase
          .from('saved_posts').select('post_id').eq('user_id', uid)
        setSavedPosts(new Set(saves?.map((s: any) => s.post_id) || []))
      }
    } finally {
      setLoading(false)
    }
  }, [hub, filter])

  useEffect(() => {
    setLoading(true)
    fetchPosts()
  }, [fetchPosts])

  async function handleSave(postId: string) {
    if (!userId) return
    const isSaved = savedPosts.has(postId)
    setSavedPosts(prev => {
      const next = new Set(prev)
      if (isSaved) next.delete(postId)
      else next.add(postId)
      return next
    })
    if (isSaved) {
      await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', userId)
    } else {
      await supabase.from('saved_posts').insert({ post_id: postId, user_id: userId })
    }
  }

  async function handleDelete(postId: string) {
    setDeletingId(postId)
    await supabase.from('posts').delete().eq('id', postId)
    setPosts(prev => prev.filter(p => p.id !== postId))
    setConfirmDeleteId(null)
    setDeletingId(null)
  }

  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'
  const hubColor = hub === 'london' ? '#2563EB' : '#be1f3b'

  return (
    <div className="flex flex-col">
      {/* Category Filter + Search */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-2 border-b border-gray-100 space-y-2">
        <div className="flex gap-2 overflow-x-scroll scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? `${hubBg} text-white`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search posts..." />
      </div>

      {/* Posts */}
      <div className="px-4 py-3 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 px-6">
            <span className="text-5xl mb-4">💬</span>
            <p className="font-sora font-semibold text-gray-700 text-base mb-1">Nothing here yet</p>
            <p className="text-sm text-gray-400 leading-relaxed">Be the first to post — share a tip, ask something, or just say hi to your fellow students.</p>
          </div>
        ) : (
          posts
          .filter(post => {
            if (!search.trim()) return true
            const q = search.toLowerCase()
            return post.title?.toLowerCase().includes(q) || post.body?.toLowerCase().includes(q)
          })
          .map(post => {
            const isOwn = post.author_id === userId
            const isConfirming = confirmDeleteId === post.id
            const isDeleting = deletingId === post.id

            return (
              <div key={post.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                {/* Author row */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: hubColor }}
                  >
                    {(post.profiles?.name || '?').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setSelectedAuthorId(post.author_id)}
                      className="text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {post.profiles?.name}
                    </button>
                    {post.profiles?.university && (
                      <span className="text-xs text-gray-400"> · {post.profiles.university}</span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                    {post.category}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs text-gray-400"><TimeAgo date={post.created_at} /></span>
                    </div>
                    <h3 className="font-sora font-semibold text-gray-900 text-sm leading-snug mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-2.5">
                      {post.body}
                    </p>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt=""
                        className="w-full rounded-xl object-cover max-h-48 mb-2.5"
                      />
                    )}
                  </div>
                </div>

                {/* Action row */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  {isConfirming ? (
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-xs text-gray-500 flex-1">Delete this post?</span>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs font-medium text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => handleSave(post.id)}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${
                          savedPosts.has(post.id) ? 'text-amber-500' : 'text-gray-400 hover:text-amber-400'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${savedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      </button>
                      {isOwn && (
                        <button
                          onClick={() => setConfirmDeleteId(post.id)}
                          className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className={`fixed bottom-24 right-4 w-14 h-14 rounded-full ${hubBg} text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-30`}
      >
        <Plus className="w-6 h-6" />
      </button>

      {showCreate && (
        <CreatePostModal
          hub={hub}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); fetchPosts() }}
        />
      )}

      {selectedPost && (
        <ReplyModal
          post={selectedPost}
          hub={hub}
          onClose={() => setSelectedPost(null)}
          onAuthorClick={(id) => { setSelectedPost(null); setSelectedAuthorId(id) }}
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
