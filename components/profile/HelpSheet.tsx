'use client'

import { useState } from 'react'
import { X, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  onClose: () => void
}

const FAQS = [
  {
    q: 'How do I join a hub?',
    a: 'During onboarding, enter your host country and we\'ll match you to the right hub. You can explore other hubs freely.',
  },
  {
    q: 'What is a visitor badge?',
    a: 'If your home hub is different from the hub you\'re posting in, you\'ll show as a "visitor" so locals know you\'re passing through.',
  },
  {
    q: 'Can I message anyone?',
    a: 'Yes! Tap on any name in Commons, Meetups, or replies to view their profile and send them a direct message.',
  },
  {
    q: 'How do meetups work?',
    a: 'Anyone can create a meetup. Hit Join to RSVP and tap the attendee count to see who else is going.',
  },
]

export default function HelpSheet({ onClose }: Props) {
  const [view, setView] = useState<'main' | 'report'>('main')
  const [reportText, setReportText] = useState('')
  const [reportSent, setReportSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-sora font-semibold text-gray-900">
            {view === 'main' ? 'Help & Support' : 'Report a Problem'}
          </h2>
          <button
            onClick={view === 'main' ? onClose : () => setView('main')}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {view === 'main' && (
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">FAQs</p>
              <div className="space-y-2 mb-6">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                    >
                      <span className="text-sm font-medium text-gray-800 pr-3">{faq.q}</span>
                      {openFaq === i
                        ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      }
                    </button>
                    {openFaq === i && (
                      <p className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Still need help?</p>
              <button
                onClick={() => setView('report')}
                className="w-full py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Report a Problem / Send Feedback
              </button>
            </div>
          )}

          {view === 'report' && (
            <div className="px-5 py-5">
              {reportSent ? (
                <div className="flex flex-col items-center text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
                  <p className="font-semibold text-gray-900 mb-1">Thanks for letting us know</p>
                  <p className="text-sm text-gray-400">We'll look into this as soon as possible.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">Describe the issue or share any feedback — we read everything.</p>
                  <textarea
                    value={reportText}
                    onChange={e => setReportText(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 transition-all resize-none mb-4"
                  />
                  <button
                    onClick={() => setReportSent(true)}
                    disabled={!reportText.trim()}
                    className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-40"
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
