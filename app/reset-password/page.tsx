'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirm) { setError("Passwords don't match"); return }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) throw err
      setDone(true)
      setTimeout(() => router.push('/'), 2000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white px-7 pt-10 pb-10">
      {done ? (
        <div className="flex flex-col items-center text-center mt-16">
          <span className="text-5xl mb-5">✅</span>
          <h1 className="font-sora font-bold text-2xl text-gray-900 mb-2">Password updated!</h1>
          <p className="text-sm text-gray-400">Taking you back to login...</p>
        </div>
      ) : (
        <>
          <span className="text-4xl mb-4 block">🔐</span>
          <h1 className="font-sora font-bold text-2xl text-gray-900 mb-1">Set new password</h1>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Choose a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="New password (min. 8 characters)"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all pr-12"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError('') }}
                placeholder="Confirm password"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all pr-12"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-[12px] text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password || !confirm}
              className="w-full py-3.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update password'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
