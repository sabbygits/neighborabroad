import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
  const testUid = request.cookies.get('na-test-uid')?.value
  const pathname = request.nextUrl.pathname

  // In test mode, skip all Supabase auth checks entirely
  if (testMode) {
    const isProtectedPath = pathname.startsWith('/london') || pathname.startsWith('/seoul')
    if (isProtectedPath && !testUid) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return supabaseResponse
  }

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    return supabaseResponse
  }

  const isProtectedPath = pathname.startsWith('/london') || pathname.startsWith('/seoul')

  if (!user && isProtectedPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/hub-select', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
