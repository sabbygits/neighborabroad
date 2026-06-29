'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getUniversityFromEmail } from '@/lib/utils'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function VerifyPage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(60)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const supabase = createClient()
  const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  useEffect(() => {
    const pendingEmail = sessionStorage.getItem('pending_email')
    if (!pendingEmail) { router.push('/'); return }
    setEmail(pendingEmail)
  }, [router])

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  function handleInput(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError('')
    if (value && index < 5) inputs.current[index + 1]?.focus()
    if (newCode.every(d => d !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''))
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setCode(pasted.split(''))
      handleVerify(pasted)
    }
  }

  async function handleVerify(token: string) {
    if (loading) return
    setLoading(true)
    setError('')

    try {
      if (testMode) {
        document.cookie = 'na-test-uid=test-user; path=/; max-age=86400'
        const displayName = sessionStorage.getItem('pending_name') ||
          email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
        sessionStorage.setItem('test_display_name', displayName)
        router.push('/onboarding')
        return
      }

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email, token, type: 'email',
      })
      if (verifyError) throw verifyError
      if (!data.user) throw new Error('Verification failed')
      const userId = data.user.id

      const { data: profile } = await supabase
        .from('profiles').select('id, hub').eq('id', userId).single()

      if (profile?.hub) {
        router.push(`/${profile.hub}/commons`)
      } else {
        await supabase.from('profiles').upsert({
          id: userId,
          email,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          university: getUniversityFromEmail(email),
          hub: null,
        })
        router.push('/onboarding')
      }
    } catch (err: any) {
      setError('Invalid or expired code. Please try again.')
      setCode(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResending(true)
    try {
      await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
      setCountdown(60)
      setCode(['', '', '', '', '', ''])
      setError('')
      inputs.current[0]?.focus()
    } catch {}
    setResending(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F3' }}>
      {testMode && (
        <div className="bg-amber-400 text-amber-900 text-[11px] font-semibold text-center py-2 px-4 tracking-wide z-10">
          TEST MODE — enter any 6 digits to continue
        </div>
      )}

      <div className="flex-1 px-7 pt-10 pb-10 overflow-y-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors mb-6 -ml-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[22px] leading-none">🌐</span>
          <span className="font-sora font-bold text-gray-900 text-[15px] tracking-tight">
            Neighbor Abroad
          </span>
        </div>

        {/* Title */}
        <h1 className="font-sora font-bold text-[1.6rem] leading-tight tracking-tight text-gray-950 mb-2">
          Check your inbox.
        </h1>
        <p className="text-gray-400 text-[13px] leading-relaxed mb-1">
          We sent a 6-digit code to your email.
        </p>
        {email && (
          <p className="text-gray-600 text-[13px] font-medium mb-6 truncate">{email}</p>
        )}

        {/* OTP inputs */}
        <div className="flex gap-2 mb-5" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`flex-1 min-w-0 h-[52px] text-center text-lg font-bold rounded-2xl border-2 transition-all focus:outline-none
                ${digit
                  ? 'border-gray-900 bg-white text-gray-900'
                  : 'border-gray-200 bg-white text-gray-900'
                }
                ${error ? '!border-red-300 !bg-red-50' : ''}
                focus:border-gray-900`}
            />
          ))}
        </div>

        {error && (
          <p className="text-[12px] text-red-500 leading-snug mb-3">{error}</p>
        )}

        {/* Verify button */}
        <button
          onClick={() => handleVerify(code.join(''))}
          disabled={loading || code.some(d => !d)}
          className="w-full py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold tracking-tight hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : 'Verify & Continue'
          }
        </button>

        {/* Resend */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-[12px] text-gray-300">Resend code in {countdown}s</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[12px] text-[#2563EB] font-medium hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
