import { NextRequest, NextResponse } from 'next/server'

// Secure admin credentials (in production, use database with hashed passwords)
const ADMIN_USERS = [
  {
    id: '1',
    username: 'yasinadil834@gmail.com',
    email: 'yasinadil834@gmail.com',
    password: 'Yasin2025@',
    role: 'super_admin'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@nanobot.com',
    password: 'admin123',
    role: 'admin'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Find user
    const user = ADMIN_USERS.find(
      u => (u.username === username || u.email === username) && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

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

    // Set secure HTTP-only cookie
    response.cookies.set('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
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
