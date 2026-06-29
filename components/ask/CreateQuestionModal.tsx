'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2 } from 'lucide-react'

interface Props {
  hub: string
  onClose: () => void
  onCreated: () => void
}

const TOPICS = [
  { value: 'General', emoji: '💬', label: 'General' },
  { value: 'Cost', emoji: '💰', label: 'Cost' },
  { value: 'Housing', emoji: '🏠', label: 'Housing' },
  { value: 'Safety', emoji: '🛡️', label: 'Safety' },
  { value: 'Food', emoji: '🍜', label: 'Food' },
  { value: 'Transport', emoji: '🚌', label: 'Transport' },
  { value: 'Academics', emoji: '🎓', label: 'Academics' },
  { value: 'Culture', emoji: '🌏', label: 'Culture' },
]

export default function CreateQuestionModal({ hub, onClose, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('General')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setSaving(true)

    const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
    let authorId = 'test-user'
    if (!testMode) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setSaving(false); return }
      authorId = user.id
    }

    await supabase.from('hub_questions').insert({
      author_id: authorId,
      hub,
      category,
      title: title.trim(),
      body: body.trim(),
    })

    setSaving(false)
    onCreated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-sora font-semibold text-gray-900">Ask the Hub</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Topic</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setCategory(t.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    category === t.value ? `${hubBg} text-white` : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span>{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Your question</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. How expensive is housing in Seoul?"
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">More context <span className="text-gray-300 normal-case font-normal">(optional)</span></label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Add any details that might help students answer better..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim() || saving}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2 ${hubBg}`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post question'}
          </button>

          <p className="text-xs text-gray-300 text-center pb-2">
            Anyone studying or visiting {hub === 'london' ? 'London' : 'Seoul'} can answer your question.
          </p>
        </form>
      </div>
    </div>
  )
}
