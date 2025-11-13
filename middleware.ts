import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only apply middleware to admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    try {
      // Check for various Supabase session cookie patterns
      const cookies = request.cookies.getAll()
      const hasSupabaseSession = cookies.some(cookie => 
        cookie.name.includes('supabase') || 
        cookie.name.includes('sb-') ||
        cookie.name.includes('auth')
      )

      console.log('Middleware check for admin route:', request.nextUrl.pathname)
      console.log('Available cookies:', cookies.map(c => c.name))
      console.log('Has Supabase session:', hasSupabaseSession)

      if (!hasSupabaseSession) {
        console.log('No Supabase session found, redirecting to login')
        // No session found, redirect to login
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      console.log('Session found, allowing access')
      // For now, we'll rely on client-side auth verification
      // The middleware will just check for the presence of auth cookies
      // Full verification will happen on the client side
      return NextResponse.next()
      
    } catch (error) {
      console.error('Middleware error:', error)
      // On any error, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}