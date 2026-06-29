'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, Camera } from 'lucide-react'

interface Props {
  profile: any
  hubColor: string
  onClose: () => void
  onSaved: (updated: any) => void
}

export default function EditProfileSheet({ profile, hubColor, onClose, onSaved }: Props) {
  const [name, setName] = useState(profile?.name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [studyingIn, setStudyingIn] = useState(profile?.studying_in || '')
  const [instagram, setInstagram] = useState(profile?.instagram_handle || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const getInitials = (n: string) =>
    n?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) || '?'

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'test-user'
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = data.publicUrl + `?t=${Date.now()}`
      setAvatarUrl(url)
    }
    setUploadingPhoto(false)
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    const updates = {
      name: name.trim(),
      bio: bio.trim() || null,
      studying_in: studyingIn.trim() || null,
      instagram_handle: instagram.replace('@', '').trim() || null,
      avatar_url: avatarUrl || null,
    }
    const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
    if (!testMode) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await supabase.from('profiles').update(updates).eq('id', user.id)
    }
    setSaving(false)
    onSaved({ ...profile, ...updates })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-sora font-semibold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Avatar picker */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-sora font-bold text-2xl shadow-md"
                  style={{ backgroundColor: hubColor }}
                >
                  {getInitials(name)}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                {uploadingPhoto
                  ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  : <Camera className="w-4 h-4 text-gray-500" />
                }
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-gray-400 mt-2 hover:text-gray-600 transition-colors"
            >
              Upload or take a photo
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Studying abroad in</label>
            <input
              type="text"
              value={studyingIn}
              onChange={e => setStudyingIn(e.target.value)}
              placeholder="e.g. Seoul, South Korea"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell people a bit about yourself..."
              rows={3}
              maxLength={160}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 transition-all resize-none"
            />
            <p className="text-xs text-gray-300 text-right mt-1">{bio.length}/160</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Instagram</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">@</span>
              <input
                type="text"
                value={instagram.replace('@', '')}
                onChange={e => setInstagram(e.target.value.replace('@', ''))}
                placeholder="username"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ backgroundColor: hubColor }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
