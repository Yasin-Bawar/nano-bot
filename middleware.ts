import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SECRET_ADMIN_PATH = '/x9k2m7p4q8w5n3j6'

export async function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith(SECRET_ADMIN_PATH)) {
    // Skip the main admin login page - device check happens client-side there
    if (request.nextUrl.pathname === SECRET_ADMIN_PATH) {
      return NextResponse.next()
    }

    // For all other admin pages, check both session and device authorization
    const adminSession = request.cookies.get('admin_session')
    const deviceAuthCookie = request.cookies.get('device_authorized')

    // Check device authorization first
    if (!deviceAuthCookie || deviceAuthCookie.value !== 'true') {
      // Device not authorized, redirect to 404
      return NextResponse.redirect(new URL('/404', request.url))
    }

    // Check admin session
    if (!adminSession) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL(SECRET_ADMIN_PATH, request.url))
    }

    try {
      // Verify the session (basic check - in production use proper JWT verification)
      const sessionData = JSON.parse(adminSession.value)

      // Check if session is expired (24 hours)
      const sessionAge = Date.now() - sessionData.loginTime
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      if (sessionAge > maxAge) {
        // Session expired, redirect to login
        const response = NextResponse.redirect(new URL(SECRET_ADMIN_PATH, request.url))
        response.cookies.set('admin_session', '', { maxAge: 0 })
        return response
      }

      // Session is valid, continue
      return NextResponse.next()
    } catch (error) {
      // Invalid session data, redirect to login
      const response = NextResponse.redirect(new URL(SECRET_ADMIN_PATH, request.url))
      response.cookies.set('admin_session', '', { maxAge: 0 })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/x9k2m7p4q8w5n3j6/:path*'
  ]
}