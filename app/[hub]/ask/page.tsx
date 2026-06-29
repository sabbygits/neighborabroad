'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, MessageCircle } from 'lucide-react'
import CreateQuestionModal from '@/components/ask/CreateQuestionModal'
import QuestionReplyModal from '@/components/ask/QuestionReplyModal'
import AuthorProfileModal from '@/components/commons/AuthorProfileModal'
import TimeAgo from '@/components/ui/TimeAgo'
import SearchBar from '@/components/ui/SearchBar'

const TOPIC_EMOJI: Record<string, string> = {
  General: '💬',
  Cost: '💰',
  Housing: '🏠',
  Safety: '🛡️',
  Food: '🍜',
  Transport: '🚌',
  Academics: '🎓',
  Culture: '🌏',
}

type Filter = 'All' | 'Unanswered' | 'Answered'

export default function AskPage({ params }: { params: { hub: string } }) {
  const { hub } = params
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('All')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null)
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'
  const hubColor = hub === 'london' ? '#2563EB' : '#be1f3b'
  const hubName = hub === 'london' ? 'London' : 'Seoul'

  const fetchQuestions = useCallback(async () => {
    const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
    try {
      let uid = 'test-user'
      if (!testMode) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        uid = user.id
      }
      setUserId(uid)

      const { data } = await supabase
        .from('hub_questions')
        .select('*, profiles(id, name, university, base_hub), hub_question_replies(id)')
        .eq('hub', hub)
        .order('created_at', { ascending: false })

      setQuestions(data || [])
    } finally {
      setLoading(false)
    }
  }, [hub])

  useEffect(() => {
    setLoading(true)
    fetchQuestions()
  }, [fetchQuestions])

  const filtered = questions.filter(q => {
    const count = q.hub_question_replies?.length || 0
    if (filter === 'Unanswered' && count !== 0) return false
    if (filter === 'Answered' && count === 0) return false
    if (search.trim()) {
      const s = search.toLowerCase()
      return q.title?.toLowerCase().includes(s) || q.body?.toLowerCase().includes(s)
    }
    return true
  })

  const filters: Filter[] = ['All', 'Unanswered', 'Answered']

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-sora font-bold text-gray-900 text-lg">Ask {hubName}</h1>
        <p className="text-xs text-gray-400 mt-0.5">Real answers from students currently studying abroad here</p>
      </div>

      {/* Filter tabs + search */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-2 pb-2 border-b border-gray-100 space-y-2">
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f ? `${hubBg} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search questions..." />
      </div>

      {/* Questions */}
      <div className="px-4 py-3 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 px-6">
            <span className="text-5xl mb-4">
              {filter === 'Unanswered' ? '✅' : filter === 'Answered' ? '💬' : '🙋'}
            </span>
            <p className="font-sora font-semibold text-gray-700 text-base mb-1">
              {filter === 'Unanswered' ? 'All caught up!' : filter === 'Answered' ? 'No answers yet' : 'No questions yet'}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              {filter === 'Unanswered' ? 'Every question here has been answered.' : filter === 'Answered' ? 'Questions are waiting — jump in and help out.' : 'Have a question about this city? Ask away — students here will answer.'}
            </p>
          </div>
        ) : (
          filtered.map(q => {
            const replyCount = q.hub_question_replies?.length || 0
            const isAnswered = replyCount > 0

            return (
              <button
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                className="w-full text-left bg-white rounded-2xl p-4 transition-colors"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
              >
                {/* Author row */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: hubColor }}
                  >
                    {(q.profiles?.name || '?').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-gray-700">{q.profiles?.name}</span>
                    {q.profiles?.university && (
                      <span className="text-xs text-gray-400"> · {q.profiles.university}</span>
                    )}
                  </div>
                  {isAnswered && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ backgroundColor: hubColor }}>
                      Answered
                    </span>
                  )}
                </div>

                {/* Topic + time */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm">{TOPIC_EMOJI[q.category] || '💬'}</span>
                  <span className="text-xs font-medium text-gray-500">{q.category}</span>
                  <span className="text-xs text-gray-300">&middot;</span>
                  <span className="text-xs text-gray-400"><TimeAgo date={q.created_at} /></span>
                </div>

                {/* Question */}
                <h3 className="font-sora font-semibold text-gray-900 text-sm leading-snug mb-1.5">
                  {q.title}
                </h3>

                {q.body && (
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-2.5">
                    {q.body}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="text-xs">{replyCount}</span>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* FAB — everyone can ask */}
      <button
        onClick={() => setShowCreate(true)}
        className={`fixed bottom-24 right-4 w-14 h-14 rounded-full ${hubBg} text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-30`}
      >
        <Plus className="w-6 h-6" />
      </button>

      {showCreate && (
        <CreateQuestionModal
          hub={hub}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); fetchQuestions() }}
        />
      )}

      {selectedQuestion && (
        <QuestionReplyModal
          question={selectedQuestion}
          hub={hub}
          currentUserId={userId}
          onClose={() => setSelectedQuestion(null)}
          onAuthorClick={(id) => { setSelectedQuestion(null); setSelectedAuthorId(id) }}
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
