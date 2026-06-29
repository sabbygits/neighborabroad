'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2 } from 'lucide-react'

const CATEGORIES = ['Social', 'Culture', 'Study', 'Outdoors', 'Food']

interface Props {
  hub: string
  onClose: () => void
  onCreated: () => void
}

export default function CreateMeetupModal({ hub, onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    name: '',
    location: '',
    category: 'Social',
    description: '',
    date: '',
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  function update(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('meetups').insert({
      creator_id: user.id,
      hub,
      ...form,
    })

    setLoading(false)
    onCreated()
  }

  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sora font-bold text-lg text-gray-900">Create Meetup</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => update('category', cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    form.category === cat
                      ? `${hubBg} text-white border-transparent`
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {[
            { key: 'name', label: 'Meetup Name', placeholder: 'e.g. Brunch in Shoreditch' },
            { key: 'location', label: 'Location', placeholder: 'e.g. Covent Garden, London' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-london/20 focus:border-london text-gray-900 placeholder:text-gray-400 text-sm"
              />
            </div>
          ))}

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Date &amp; Time</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={e => update('date', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-london/20 focus:border-london text-gray-900 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="What's this meetup about?"
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-london/20 focus:border-london text-gray-900 placeholder:text-gray-400 resize-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.name || !form.location || !form.date || !form.description}
            className={`w-full py-3.5 rounded-xl ${hubBg} text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Meetup'}
          </button>
        </form>
      </div>
    </div>
  )
}
