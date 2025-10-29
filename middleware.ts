import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip the main admin login page
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next()
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session')

    if (!adminSession) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    try {
      // Verify the session (basic check - in production use proper JWT verification)
      const sessionData = JSON.parse(adminSession.value)

      // Check if session is expired (24 hours)
      const sessionAge = Date.now() - sessionData.loginTime
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      if (sessionAge > maxAge) {
        // Session expired, redirect to login
        const response = NextResponse.redirect(new URL('/admin', request.url))
        response.cookies.set('admin_session', '', { maxAge: 0 })
        return response
      }

      // Session is valid, continue
      return NextResponse.next()
    } catch (error) {
      // Invalid session data, redirect to login
      const response = NextResponse.redirect(new URL('/admin', request.url))
      response.cookies.set('admin_session', '', { maxAge: 0 })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}