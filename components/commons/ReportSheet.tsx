'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, CheckCircle2 } from 'lucide-react'

const REASONS = [
  'Harassment or bullying',
  'Fake or impersonation',
  'Spam',
  'Inappropriate content',
  'Other',
]

interface Props {
  reportedUserId: string
  reportedName: string
  currentUserId: string
  onClose: () => void
}

export default function ReportSheet({ reportedUserId, reportedName, currentUserId, onClose }: Props) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  async function handleSubmit() {
    if (!reason) return
    setLoading(true)
    await supabase.from('reports').insert({
      reporter_id: currentUserId,
      reported_user_id: reportedUserId,
      reason,
      details: details.trim() || null,
    })
    setLoading(false)
    setSubmitted(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl p-6 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-sora font-bold text-gray-900 text-lg">Report user</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-5">{reportedName}</p>

        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="font-semibold text-gray-900">Report submitted</p>
            <p className="text-sm text-gray-400 text-center">
              Thanks for helping keep the community safe.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              What's going on?
            </p>
            <div className="space-y-2 mb-4">
              {REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    reason === r
                      ? 'border-red-400 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Any additional details... (optional)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none mb-4"
            />
            <button
              onClick={handleSubmit}
              disabled={!reason || loading}
              className="w-full py-3.5 rounded-xl bg-red-500 text-white font-semibold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit report'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
