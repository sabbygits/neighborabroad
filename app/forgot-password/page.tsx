'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isValidUniversityEmail } from '@/lib/utils'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!isValidUniversityEmail(trimmed)) {
      setError('Please use your university email')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (err) throw err
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white px-7 pt-10 pb-10">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors mb-8 -ml-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      {sent ? (
        <div className="flex flex-col items-center text-center mt-16">
          <span className="text-5xl mb-5">📬</span>
          <h1 className="font-sora font-bold text-2xl text-gray-900 mb-2">Check your inbox</h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            We sent a password reset link to <span className="font-medium text-gray-600">{email}</span>. Check your inbox and follow the link.
          </p>
        </div>
      ) : (
        <>
          <span className="text-4xl mb-4 block">🔑</span>
          <h1 className="font-sora font-bold text-2xl text-gray-900 mb-1">Forgot password?</h1>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Enter your university email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="you@university.edu"
              autoComplete="email"
              inputMode="email"
              required
              className={`w-full px-4 py-3.5 rounded-xl border text-sm text-gray-900 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 transition-all ${
                error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-[#2563EB]/15 focus:border-[#2563EB]'
              }`}
            />
            {error && <p className="text-[12px] text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send reset link'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
