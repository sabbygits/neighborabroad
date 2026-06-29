import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY
  if (!vapidPublic || !vapidPrivate) return NextResponse.json({ ok: false })

  try {
    const webpush = (await import('web-push')).default
    webpush.setVapidDetails('mailto:hello@neighborabroad.app', vapidPublic, vapidPrivate)

    const { targetUserId, title, body, url } = await req.json()
    if (!targetUserId) return NextResponse.json({ ok: false })

    const supabase = await createClient()
    const { data: sub } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_id', targetUserId)
      .single()

    if (!sub) return NextResponse.json({ ok: false })

    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify({ title, body, url })
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
