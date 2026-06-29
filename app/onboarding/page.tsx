'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getUniversityFromEmail } from '@/lib/utils'
import { Eye, EyeOff, Loader2, ArrowLeft, Camera } from 'lucide-react'

type Step = 'password' | 'profile' | 'avatar' | 'about' | 'welcome'
const PROGRESS_STEPS: Step[] = ['password', 'profile', 'avatar', 'about']

function matchHub(input: string): 'london' | 'seoul' | null {
  const val = input.toLowerCase().trim()
  if (['korea', 'south korea', 'seoul', '한국'].some(k => val.includes(k))) return 'seoul'
  if (['uk', 'united kingdom', 'england', 'britain', 'london'].some(k => val.includes(k))) return 'london'
  return null
}

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('password')

  // Step 1: password
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Step 2: profile
  const [name, setName] = useState('')
  const [university, setUniversity] = useState('')

  // Step 3: avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 4: about
  const [bio, setBio] = useState('')
  const [country, setCountry] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()
  const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  useEffect(() => {
    const pendingName = sessionStorage.getItem('pending_name') || ''
    const pendingEmail = sessionStorage.getItem('pending_email') || ''
    if (pendingName) setName(pendingName)
    else if (pendingEmail) {
      setName(pendingEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
    }
    if (pendingEmail) setUniversity(getUniversityFromEmail(pendingEmail))
  }, [])

  const currentProgress = PROGRESS_STEPS.indexOf(step) + 1

  function goBack() {
    const prev = PROGRESS_STEPS[PROGRESS_STEPS.indexOf(step) - 1]
    if (prev) { setStep(prev); setError('') }
  }

  // --- Step 1: Password ---
  async function handlePasswordContinue() {
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirmPassword) { setError("Passwords don't match"); return }
    setError('')
    setLoading(true)
    try {
      if (!testMode) {
        const { error: err } = await supabase.auth.updateUser({ password })
        if (err) throw err
      }
      setStep('profile')
    } catch (err: any) {
      setError(err.message || 'Failed to set password.')
    } finally {
      setLoading(false)
    }
  }

  // --- Step 3: Avatar ---
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  // --- Step 4: About + final save ---
  async function handleAboutContinue() {
    if (!country.trim()) { setError('Please tell us where you\'re headed'); return }
    setError('')
    setLoading(true)

    try {
      if (country.trim()) sessionStorage.setItem('host_country', country.trim())
      const matched = matchHub(country)
      if (matched) sessionStorage.setItem('suggested_hub', matched)

      if (testMode) {
        sessionStorage.setItem('test_display_name', name)
        setStep('welcome')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload avatar if provided
      let avatar_url: string | null = null
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop()
        const path = `${user.id}/avatar.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true })
        if (!uploadErr) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(path)
          avatar_url = data.publicUrl
        }
      }

      // Save full profile
      const email = sessionStorage.getItem('pending_email') || user.email || ''
      await supabase.from('profiles').upsert({
        id: user.id,
        email,
        name: name.trim() || email.split('@')[0],
        university: university.trim() || null,
        bio: bio.trim() || null,
        studying_in: country.trim() || null,
        hub: null,
        ...(avatar_url ? { avatar_url } : {}),
      })

      setStep('welcome')
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const firstName = name.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F3' }}>
      {/* Progress bar */}
      {step !== 'welcome' && (
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={step === 'password' ? () => router.push('/') : goBack}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500" />
            </button>
            <div className="flex gap-1.5 flex-1">
              {PROGRESS_STEPS.map((s, i) => (
                <div
                  key={s}
                  className="h-1 rounded-full flex-1 transition-all duration-300"
                  style={{ backgroundColor: i < currentProgress ? '#111827' : '#E5E7EB' }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium flex-shrink-0">
              {currentProgress} of {PROGRESS_STEPS.length}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col px-6 pt-8 pb-10">

          {/* ── Step 1: Password ── */}
          {step === 'password' && (
            <>
              <h1 className="font-sora font-bold text-[2rem] leading-[1.1] text-gray-900 mb-1">Set your<br />password</h1>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                You'll use this to log in from now on.
              </p>

              <div className="space-y-3 mb-5">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="Password (min. 8 characters)"
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
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all pr-12"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              <button
                onClick={handlePasswordContinue}
                disabled={loading || !password || !confirmPassword}
                className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-sm disabled:opacity-40 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue →'}
              </button>
            </>
          )}

          {/* ── Step 2: Profile ── */}
          {step === 'profile' && (
            <>
              <h1 className="font-sora font-bold text-[2rem] leading-[1.1] text-gray-900 mb-1">Your profile</h1>
              <p className="text-sm text-gray-400 mb-6">How other students will know you.</p>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Display name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">
                    University
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    placeholder="e.g. University College London"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                  />
                  <p className="text-xs text-gray-300 mt-1.5">
                    Used for verification only — not shown on your profile.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { setError(''); setStep('avatar') }}
                disabled={!name.trim()}
                className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-sm disabled:opacity-40 hover:bg-gray-800 transition-colors"
              >
                Continue →
              </button>
            </>
          )}

          {/* ── Step 3: Avatar ── */}
          {step === 'avatar' && (
            <>
              <h1 className="font-sora font-bold text-[2rem] leading-[1.1] text-gray-900 mb-1">Add a photo</h1>
              <p className="text-sm text-gray-400 mb-6">Optional — you can always change it later.</p>

              <div className="flex flex-col items-center mb-8">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-200 hover:border-[#2563EB] transition-colors"
                >
                  {avatarPreview
                    ? <img src={avatarPreview} className="w-full h-full object-cover" alt="preview" />
                    : <Camera className="w-8 h-8 text-gray-300" />
                  }
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-[#2563EB] font-medium mt-3"
                >
                  {avatarPreview ? 'Change photo' : 'Choose photo'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <button
                onClick={() => setStep('about')}
                className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
              >
                {avatarPreview ? 'Continue →' : 'Skip for now'}
              </button>
            </>
          )}

          {/* ── Step 4: About ── */}
          {step === 'about' && (
            <>
              <h1 className="font-sora font-bold text-[2rem] leading-[1.1] text-gray-900 mb-1">Almost there</h1>
              <p className="text-sm text-gray-400 mb-5">Tell us a bit about your situation.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Where are you headed? <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. South Korea, London, Japan..."
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2563EB] transition-all"
                  />
                  {country.trim() && (
                    matchHub(country) ? (
                      <p className="text-xs text-green-600 mt-1.5 font-medium">
                        ⭐ We'll highlight the {matchHub(country) === 'seoul' ? 'Seoul' : 'London'} hub for you
                      </p>
                    ) : (
                      <p className="text-xs text-amber-500 mt-1.5 leading-relaxed">
                        We don't have that hub yet, but we're working on it! You can explore our current hubs in the meantime.
                      </p>
                    )
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Bio <span className="normal-case font-normal text-gray-300">(optional)</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="A sentence about yourself..."
                    rows={2}
                    maxLength={160}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2563EB] transition-all resize-none"
                  />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              <button
                onClick={handleAboutContinue}
                disabled={loading || !country.trim()}
                className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-sm disabled:opacity-40 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Let's go →"}
              </button>
            </>
          )}

          {/* ── Welcome ── */}
          {step === 'welcome' && (
            <div className="flex flex-col pt-16">
              <h1 className="font-sora font-bold text-[2.2rem] leading-[1.1] text-gray-900 mb-3">
                Welcome,<br />{firstName}!
              </h1>
              <p className="text-sm text-gray-500 mb-2 leading-relaxed">
                Your profile is set. Now pick the city you're headed to.
              </p>
              <p className="text-xs text-gray-400 mb-10">
                A welcome email is on its way to your inbox.
              </p>
              <button
                onClick={() => router.push('/agree')}
                className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
              >
                Choose your hub →
              </button>
            </div>
          )}

      </div>
    </div>
  )
}
