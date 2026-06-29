'use client'

import { Bell } from 'lucide-react'

interface Props {
  hub: string
  onClose: () => void
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i)
  return output
}

export default function NotificationPrompt({ hub, onClose }: Props) {
  const hubColor = hub === 'london' ? '#2563EB' : '#be1f3b'

  async function handleAllow() {
    localStorage.setItem('notif_asked', '1')
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        const reg = await navigator.serviceWorker.ready
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidKey) { onClose(); return }
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        })
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
        })
      }
    } catch (err) {
      console.error('Push subscription failed:', err)
    }
    onClose()
  }

  function handleDismiss() {
    localStorage.setItem('notif_asked', '1')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-10">
      <div className="absolute inset-0 bg-black/40" onClick={handleDismiss} />
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${hubColor}18` }}
        >
          <Bell className="w-6 h-6" style={{ color: hubColor }} />
        </div>
        <h2 className="font-sora font-bold text-gray-900 text-lg text-center mb-1">
          Stay in the loop
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
          Get notified when someone replies to your post or likes something you shared.
        </p>
        <button
          onClick={handleAllow}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white mb-2"
          style={{ backgroundColor: hubColor }}
        >
          Allow notifications
        </button>
        <button
          onClick={handleDismiss}
          className="w-full py-2.5 text-sm font-medium text-gray-400"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
