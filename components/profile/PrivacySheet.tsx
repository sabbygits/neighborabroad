'use client'

import { X } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function PrivacySheet({ onClose }: Props) {
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
          <h2 className="font-sora font-semibold text-gray-900">Privacy</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 text-sm text-gray-600 leading-relaxed">
          <div>
            <p className="font-semibold text-gray-900 mb-1">What we collect</p>
            <p>We collect your name, university email, and any profile information you choose to share (bio, Instagram handle). We also store posts, replies, meetups, and messages you create on the platform.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-1">How we use it</p>
            <p>Your information is used solely to power the Neighbor Abroad experience — connecting students abroad with their local hub community. We do not sell your data to third parties.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-1">Who can see your profile</p>
            <p>Other users on Neighbor Abroad can see your name, university, bio, and posts. Your email address is never shown publicly.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-1">Direct messages</p>
            <p>Messages are private between you and the other person. Only participants in a conversation can read it.</p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-1">Deleting your account</p>
            <p>To delete your account and all associated data, contact us through the Help section. We'll process your request within 7 days.</p>
          </div>

          <p className="text-xs text-gray-300 pt-2">Last updated March 2026</p>
        </div>
      </div>
    </div>
  )
}
