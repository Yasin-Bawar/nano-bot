import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { username, password, ipAddress } = await request.json()

    // Check IP authorization first (IP is sent from client)
    if (ipAddress) {
      const ipCheckResponse = await fetch(`${request.nextUrl.origin}/api/admin/check-device`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipAddress })
      })
      
      const ipData = await ipCheckResponse.json()
      
      if (!ipData.authorized) {
        return NextResponse.json(
          { success: false, error: 'IP address not authorized' },
          { status: 403 }
        )
      }
    }

    // Connect to Supabase with service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Find user by username or email
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .or(`username.eq.${username},email.eq.${username}`)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password (in production, use bcrypt.compare)
    if (user.password_hash !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login time
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    // Create session data
    const sessionData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      loginTime: Date.now()
    }

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })

    // Set secure HTTP-only cookie for session
    response.cookies.set('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    // Set device authorization cookie (for middleware)
    response.cookies.set('device_authorized', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', '', { maxAge: 0 })
  return response
}
