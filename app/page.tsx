'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isValidUniversityEmail } from '@/lib/utils'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('remembered_email')
    if (saved) { setEmail(saved); setRememberMe(true) }
  }, [])

  const router = useRouter()
  const supabase = createClient()
  const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  function reset() { setEmail(''); setPassword(''); setError('') }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const trimmedEmail = email.trim().toLowerCase()

    if (!isValidUniversityEmail(trimmedEmail)) {
      setError('Please use a university email (.edu, .ac.uk, .ac.kr, or .edu.au)')
      return
    }

    if (rememberMe) localStorage.setItem('remembered_email', trimmedEmail)
    else localStorage.removeItem('remembered_email')

    setLoading(true)

    try {
      if (testMode) {
        sessionStorage.setItem('pending_email', trimmedEmail)
        if (tab === 'login') {
          document.cookie = 'na-test-uid=test-user; path=/; max-age=86400'
          router.push('/hub-select')
        } else {
          router.push('/verify')
        }
        return
      }

      if (tab === 'login') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        })
        if (signInError) throw signInError
        router.push('/hub-select')
      } else {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: trimmedEmail,
          options: { shouldCreateUser: true },
        })
        if (otpError) throw otpError
        sessionStorage.setItem('pending_email', trimmedEmail)
        router.push('/verify')
      }
    } catch (err: any) {
      if (err.message?.includes('Invalid login credentials')) {
        setError('Wrong email or password.')
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F3' }}>
      {testMode && (
        <div className="bg-amber-400 text-amber-900 text-[11px] font-semibold text-center py-2 px-4 tracking-wide z-10">
          TEST MODE — any .edu email works
        </div>
      )}

      <div className="flex-1 flex flex-col px-7 pt-14 pb-10 overflow-y-auto">

        {/* Brand */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl leading-none">🌐</span>
            <span className="font-sora font-extrabold text-gray-900 text-[22px] tracking-tight leading-none">
              Neighbor Abroad
            </span>
          </div>
          <h1 className="font-sora font-bold text-[2rem] leading-[1.1] tracking-tight text-gray-950">
            Your campus,<br />far from home.
          </h1>
        </div>

        {/* Tab toggle — underline style */}
        <div className="flex border-b border-gray-200 mb-7">
          <button
            type="button"
            onClick={() => { setTab('login'); reset() }}
            className={`mr-6 pb-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === 'login' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); reset() }}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === 'register' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-2 tracking-widest uppercase">
              University Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="you@university.edu"
              autoComplete="email"
              inputMode="email"
              required
              className={`w-full px-4 py-3.5 rounded-2xl border text-sm text-gray-900 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 transition-all ${
                error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-[#2563EB]/15 focus:border-[#2563EB]'
              }`}
            />
          </div>

          {tab === 'login' && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-2 tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-[12px] text-red-500 leading-snug">{error}</p>}

          {tab === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(r => !r)}
                  className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all ${
                    rememberMe ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300 bg-white'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[12px] text-gray-500">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-[12px] text-[#2563EB] font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {tab === 'register' && (
            <p className="text-[12px] text-gray-400 leading-relaxed">
              We'll send a 6-digit code to verify your university email.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || (tab === 'login' && !password)}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white text-sm font-semibold tracking-tight hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : tab === 'login' ? 'Login' : 'Send verification code'
            }
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-300 font-medium tracking-widest uppercase mt-8">
          Neighbor Abroad ™ 2026
        </p>
      </div>
    </div>
  )
}
