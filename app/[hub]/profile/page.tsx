'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BadgeCheck, ChevronRight, Loader2, Settings, Shield, HelpCircle, Pencil, Instagram, Bookmark, RefreshCw } from 'lucide-react'
import EditProfileSheet from '@/components/profile/EditProfileSheet'
import SettingsSheet from '@/components/profile/SettingsSheet'
import HelpSheet from '@/components/profile/HelpSheet'
import PrivacySheet from '@/components/profile/PrivacySheet'
import SavedPostsSheet from '@/components/profile/SavedPostsSheet'

export default function ProfilePage({ params }: { params: { hub: string } }) {
  const { hub } = params
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const hubColor = hub === 'london' ? '#2563EB' : '#be1f3b'
  const hubName = hub === 'london' ? 'London' : 'Seoul'
  const flagEmoji = hub === 'london' ? '🇬🇧' : '🇰🇷'

  useEffect(() => {
    async function fetchProfile() {
      const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'

      if (testMode) {
        const displayName = sessionStorage.getItem('test_display_name') || 'Tester'
        const email = sessionStorage.getItem('pending_email') || 'test@university.edu'
        const domain = email.split('@')[1] || 'university.edu'
        const uni = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
        const hostCountry = sessionStorage.getItem('host_country') || null
        setProfile({ name: displayName, email, university: uni, hub, bio: null, instagram_handle: null, host_country: hostCountry })
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  async function handleSwitchHub() {
    router.push('/hub-select')
  }

  async function handleSignOut() {
    setSigningOut(true)
    // Clear welcome flags so the modal shows again on next login
    localStorage.removeItem('welcomed_london')
    localStorage.removeItem('welcomed_seoul')
    localStorage.removeItem('notif_asked')
    const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
    if (testMode) {
      document.cookie = 'na-test-uid=; path=/; max-age=0'
      sessionStorage.clear()
      router.push('/')
      return
    }
    await supabase.auth.signOut()
    router.push('/')
  }

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const getUsername = (email: string) =>
    '@' + (email?.split('@')[0] || 'user').replace(/[._]/g, '').toLowerCase()

  const isEduVerified = (email: string) =>
    email?.endsWith('.edu') || email?.includes('.ac.')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-8">
      <div className="flex flex-col items-center px-4 pt-8">
        <div className="relative mb-3">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 rounded-full object-cover shadow-md" />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-sora font-bold text-2xl shadow-md"
              style={{ backgroundColor: hubColor }}
            >
              {getInitials(profile?.name || '?')}
            </div>
          )}
          <button
            onClick={() => setShowEdit(true)}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        {/* Name + verified badge */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <h2 className="font-sora font-bold text-gray-900 text-xl leading-tight">{profile?.name}</h2>
          {isEduVerified(profile?.email) && (
            <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
          )}
        </div>

        {/* Username */}
        <p className="text-sm text-gray-400 mb-2">{getUsername(profile?.email)}</p>

        {/* Studying in */}
        {profile?.studying_in && (
          <p className="text-sm font-medium text-gray-600 mb-1">
            ✈️ {profile.studying_in}
          </p>
        )}

        {/* Bio */}
        {profile?.bio && (
          <p className="text-sm text-gray-500 text-center max-w-[240px] mb-5 leading-relaxed">
            {profile.bio}
          </p>
        )}
        {!profile?.bio && <div className="mb-5" />}

        {/* Badges row */}
        <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
          <span className="text-sm">{flagEmoji}</span>
          <span className="text-xs font-medium text-gray-600">{hubName}</span>
        </div>

        {profile?.instagram_handle ? (
          <a
            href={`https://instagram.com/${profile.instagram_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 rounded-full group"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span className="text-xs font-medium text-pink-500">@{profile.instagram_handle}</span>
          </a>
        ) : (
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full hover:bg-pink-50 transition-colors group"
          >
            <Instagram className="w-3.5 h-3.5 text-gray-500 group-hover:text-pink-500 transition-colors" />
            <span className="text-xs font-medium text-gray-600 group-hover:text-pink-500 transition-colors">Connect</span>
          </button>
        )}
      </div>

      {/* Saved posts */}
      <div className="w-full mb-6">
        <button
          onClick={() => setShowSaved(true)}
          className="w-full bg-white rounded-2xl flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <span className="flex-1 text-left text-sm font-medium text-gray-800">Saved Posts</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Account section */}
      <div className="w-full mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Account</p>
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setShowEdit(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <Pencil className="w-4 h-4 text-gray-500" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-gray-800">Edit Profile</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <Settings className="w-4 h-4 text-gray-500" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-gray-800">Settings</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          <button
            onClick={() => setShowPrivacy(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <Shield className="w-4 h-4 text-gray-500" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-gray-800">Privacy</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-gray-500" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-gray-800">Help</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Switch hub */}
      <button
        onClick={handleSwitchHub}
        className="flex items-center gap-2 text-sm font-semibold transition-colors py-2"
        style={{ color: hubColor }}
      >
        <RefreshCw className="w-4 h-4" />
        Switch hub
      </button>

      {/* Log out */}
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="text-sm font-semibold text-red-400 hover:text-red-500 transition-colors py-2 disabled:opacity-50"
      >
        {signingOut ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Log out'}
      </button>

      <p className="text-xs text-gray-300 mt-6">Neighbor Abroad ™ 2026</p>
      </div>{/* end inner px-4 items-center */}

      {showEdit && (
        <EditProfileSheet
          profile={profile}
          hubColor={hubColor}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => setProfile(updated)}
        />
      )}

      {showSettings && (
        <SettingsSheet
          profile={profile}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showHelp && <HelpSheet onClose={() => setShowHelp(false)} />}
      {showPrivacy && <PrivacySheet onClose={() => setShowPrivacy(false)} />}
      {showSaved && profile && (
        <SavedPostsSheet
          currentUserId={profile.id || 'test-user'}
          hub={hub}
          onClose={() => setShowSaved(false)}
        />
      )}
    </div>
  )
}
