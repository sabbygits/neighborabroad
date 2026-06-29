'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, ImagePlus, XCircle } from 'lucide-react'

const CATEGORIES = ['Travel', 'Question', 'Social', 'Safety']

interface Props {
  hub: string
  onClose: () => void
  onCreated: () => void
}

export default function CreatePostModal({ hub, onClose, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('Social')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
      let userId: string

      if (testMode) {
        userId = 'test-user'
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        userId = user.id
      }

      let image_url: string | null = null

      if (imageFile && !testMode) {
        const ext = imageFile.name.split('.').pop()
        const path = `${hub}/${userId}/${Date.now()}.${ext}`
        const { error } = await supabase.storage
          .from('post-images')
          .upload(path, imageFile, { upsert: false })
        if (!error) {
          const { data } = supabase.storage.from('post-images').getPublicUrl(path)
          image_url = data.publicUrl
        }
      }

      await supabase.from('posts').insert({
        author_id: userId,
        hub,
        category,
        title,
        body,
        ...(image_url ? { image_url } : {}),
      })

      onCreated()
    } finally {
      setLoading(false)
    }
  }

  const hubBg = hub === 'london' ? 'bg-london' : 'bg-seoul'
  const hubColor = hub === 'london' ? '#2563EB' : '#be1f3b'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white w-full max-w-md rounded-t-3xl p-6 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sora font-bold text-lg text-gray-900">New Post</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    category === cat
                      ? `${hubBg} text-white border-transparent`
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              style={{ '--tw-ring-color': `${hubColor}30` } as React.CSSProperties}
            />
          </div>

          <div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Share something with the community..."
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Image picker */}
          <div>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={imagePreview} alt="preview" className="w-full max-h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center"
                >
                  <XCircle className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors text-sm font-medium"
              >
                <ImagePlus className="w-4 h-4" />
                Add a photo (optional)
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !title || !body}
            className={`w-full py-3.5 rounded-xl ${hubBg} text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post to Commons'}
          </button>
        </form>
      </div>
    </div>
  )
}
