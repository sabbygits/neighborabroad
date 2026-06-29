'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, Lightbulb } from 'lucide-react'

interface Props {
  place: any
  hub: string
  onClose: () => void
  onCreated: () => void
}

export default function IntelNoteModal({ place, hub, onClose, onCreated }: Props) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('intel_notes').insert({
      place_id: place.id,
      author_id: user.id,
      note: note.trim(),
    })

    setLoading(false)
    onCreated()
  }

  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'
  const hubBgLight = hub === 'london' ? 'bg-london-light' : 'bg-seoul-light'
  const hubText = hub === 'london' ? 'text-london' : 'text-seoul'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl p-6 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl ${hubBgLight} flex items-center justify-center`}>
              <Lightbulb className={`w-4 h-4 ${hubText}`} />
            </div>
            <h2 className="font-sora font-bold text-lg text-gray-900">Add Intel Note</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">Sharing a tip for <span className="font-medium text-gray-700">{place.name}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Best time to visit is on weekday mornings, way less crowded. The cold brew is excellent!"
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-london/20 focus:border-london text-gray-900 placeholder:text-gray-400 resize-none text-sm"
          />
          <button
            type="submit"
            disabled={loading || !note.trim()}
            className={`w-full py-3.5 rounded-xl ${hubBg} text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Share Intel'}
          </button>
        </form>
      </div>
    </div>
  )
}
