'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck } from 'lucide-react'

const rules = [
  {
    emoji: '🤝',
    title: 'Treat everyone with respect',
    body: 'No harassment, hate speech, bullying, or discrimination of any kind.',
  },
  {
    emoji: '📍',
    title: 'Keep it relevant',
    body: 'Posts should relate to student life, travel, or the city you\'re in. No spam or mass self-promotion.',
  },
  {
    emoji: '🔒',
    title: 'Protect privacy',
    body: 'Don\'t share anyone\'s personal information without their consent.',
  },
  {
    emoji: '✅',
    title: 'Be honest',
    body: 'No impersonation, misinformation, or fake accounts.',
  },
  {
    emoji: '⚠️',
    title: 'Violations have consequences',
    body: 'Breaking these rules can result in removal from a hub or a permanent ban from Neighbor Abroad.',
  },
]

export default function AgreePage() {
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  async function handleAgree() {
    if (!agreed || loading) return
    setLoading(true)
    if (!testMode) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({ agreed_at: new Date().toISOString() }).eq('id', user.id)
      }
    }
    router.push('/hub-select')
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-14 pb-10" style={{ background: '#F7F6F3' }}>
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[22px] leading-none">🌐</span>
        <span className="font-sora font-bold text-gray-900 text-[15px] tracking-tight">
          Neighbor Abroad
        </span>
      </div>

      <div className="mb-2">
        <ShieldCheck className="w-8 h-8 text-gray-900 mb-4" />
        <h1 className="font-sora font-bold text-[1.8rem] leading-[1.1] tracking-tight text-gray-950 mb-2">
          Community guidelines
        </h1>
        <p className="text-[13px] text-gray-400 leading-relaxed">
          Neighbor Abroad is built on trust. Before joining, please read and agree to these rules.
        </p>
      </div>

      <div className="mt-7 space-y-4 mb-8">
        {rules.map((rule, i) => (
          <div key={i} className="flex gap-3.5">
            <span className="text-xl leading-none mt-0.5">{rule.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">{rule.title}</p>
              <p className="text-[13px] text-gray-400 leading-relaxed">{rule.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Checkbox */}
      <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
        <div
          onClick={() => setAgreed(v => !v)}
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border-2 flex-shrink-0 transition-all ${
            agreed ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white'
          }`}
        >
          {agreed && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-[13px] text-gray-600 leading-relaxed">
          I have read and agree to the community guidelines. I understand that violations may result in removal or a permanent ban.
        </span>
      </label>

      <button
        onClick={handleAgree}
        disabled={!agreed || loading}
        className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Just a sec...' : 'I agree — let\'s go →'}
      </button>
    </div>
  )
}
