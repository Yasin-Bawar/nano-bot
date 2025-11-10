// Admin authentication system with high security and database integration

export interface AdminSession {
  id: string
  username: string
  email: string
  role: string
  loginTime: number
}

// Get admin session from localStorage (UI purposes only)
export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null
  
  try {
    const localSession = localStorage.getItem('admin_session_ui')
    if (!localSession) return null
    
    const session = JSON.parse(localSession)
    
    // Check if session is expired (24 hours)
    const sessionAge = Date.now() - session.loginTime
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    if (sessionAge > maxAge) {
      clearAdminSession()
      return null
    }
    
    return session
  } catch (error) {
    console.error("Error parsing admin session:", error)
    clearAdminSession()
    return null
  }
}

// Set admin session UI data
export function setAdminSessionUI(sessionData: AdminSession) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_session_ui', JSON.stringify(sessionData))
  }
}

// Clear admin session
export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_session_ui')
  }
}

// Login admin with API
export async function loginAdmin(username: string, password: string, ipAddress?: string): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, ipAddress }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      // Store UI session data
      setAdminSessionUI({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        loginTime: Date.now()
      })
      
      return { success: true, user: data.user }
    } else {
      return { success: false, error: data.error || 'خطا در ورود' }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'خطای اتصال به سرور' }
  }
}

// Logout admin
export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/x9k2m7p4q8w5n3j6/login', {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    clearAdminSession()
  }
}

// Check if user is admin
export function isAdmin(): boolean {
  const session = getAdminSession()
  return session !== null
}

// Admin route protection
export function requireAdmin(): AdminSession {
  const session = getAdminSession()
  if (!session) {
    throw new Error("Admin authentication required")
  }
  return session
}

// Legacy compatibility - authenticate admin (now uses API)
export async function authenticateAdmin(username: string, password: string): Promise<AdminSession | null> {
  const result = await loginAdmin(username, password)
  if (result.success && result.user) {
    return {
      id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role,
      loginTime: Date.now()
    }
  }
  return null
}