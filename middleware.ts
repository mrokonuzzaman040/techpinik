import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const MAINTENANCE_PATH = '/maintenance'

function isPublicPath(pathname: string) {
  if (pathname.startsWith('/admin')) return false
  if (pathname.startsWith('/api')) return false
  if (pathname.startsWith('/_next')) return false
  if (pathname === '/favicon.ico') return false
  if (pathname === '/robots.txt') return false
  if (pathname === '/sitemap.xml') return false
  return true
}

const cleanEnv = (value?: string) => value?.trim().replace(/^['"]|['"]$/g, '')

async function readMaintenanceMode(): Promise<boolean> {
  const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseAnonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  if (!supabaseUrl || !supabaseAnonKey) return false

  try {
    const statusUrl = `${supabaseUrl}/rest/v1/site_settings?id=eq.1&select=maintenance_mode`
    const response = await fetch(statusUrl, {
      cache: 'no-store',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    })
    if (!response.ok) return false
    const rows = (await response.json()) as Array<{ maintenance_mode?: boolean }>
    return rows?.[0]?.maintenance_mode === true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Handle Admin routes - Force no cache to prevent 304 issues on specific IPs
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  if (!isPublicPath(pathname)) {
    return response
  }

  const maintenanceMode = await readMaintenanceMode()

  if (maintenanceMode && pathname !== MAINTENANCE_PATH) {
    const maintenanceUrl = request.nextUrl.clone()
    maintenanceUrl.pathname = MAINTENANCE_PATH
    maintenanceUrl.search = ''
    return NextResponse.redirect(maintenanceUrl)
  }

  if (!maintenanceMode && pathname === MAINTENANCE_PATH) {
    const homeUrl = request.nextUrl.clone()
    homeUrl.pathname = '/'
    homeUrl.search = ''
    return NextResponse.redirect(homeUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
