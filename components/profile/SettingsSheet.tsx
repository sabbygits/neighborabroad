'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, KeyRound, Loader2, CheckCircle } from 'lucide-react'

interface Props {
  profile: any
  onClose: () => void
}

export default function SettingsSheet({ profile, onClose }: Props) {
  const [passwordSent, setPasswordSent] = useState(false)
  const [sending, setSending] = useState(false)
  const supabase = createClient()
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  async function handleChangePassword() {
    if (isTestMode) { setPasswordSent(true); return }
    setSending(true)
    await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setSending(false)
    setPasswordSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '60vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-sora font-semibold text-gray-900">Settings</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-5 py-8 flex flex-col items-center text-center">
          {passwordSent ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Email sent!</p>
              <p className="text-sm text-gray-400">Check your inbox at {profile?.email} for a password reset link.</p>
            </>
          ) : (
            <>
              <KeyRound className="w-12 h-12 text-gray-200 mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Change Password</p>
              <p className="text-sm text-gray-400 mb-6">
                We'll send a reset link to<br />
                <span className="font-medium text-gray-600">{profile?.email}</span>
              </p>
              <button
                onClick={handleChangePassword}
                disabled={sending}
                className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send reset link'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
