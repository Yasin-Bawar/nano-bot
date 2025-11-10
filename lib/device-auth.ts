// IP-based authorization system for admin access
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Get device info for logging (not for authentication)
export function getDeviceInfo(): { userAgent: string; platform: string; language: string } {
  if (typeof window === 'undefined') {
    return { userAgent: '', platform: '', language: '' }
  }
  
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language
  }
}

// Check if IP is authorized (server-side)
export async function isIpAuthorized(ip: string): Promise<{ authorized: boolean; name?: string }> {
  try {
    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    const { data, error } = await supabase
      .from('authorized_ips')
      .select('name, is_active')
      .eq('ip_address', ip)
      .eq('is_active', true)
      .single()
    
    if (error || !data) {
      return { authorized: false }
    }
    
    // Update last access time
    await supabase
      .from('authorized_ips')
      .update({ last_access: new Date().toISOString() })
      .eq('ip_address', ip)
    
    return { authorized: true, name: data.name }
  } catch (error) {
    console.error('IP authorization check failed:', error)
    return { authorized: false }
  }
}

// Log access attempt (server-side)
export async function logAccessAttempt(
  ip: string,
  granted: boolean,
  denialReason?: string,
  deviceInfo?: { userAgent?: string; platform?: string }
): Promise<void> {
  try {
    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    await supabase
      .from('admin_access_logs')
      .insert({
        ip_address: ip,
        access_granted: granted,
        denial_reason: denialReason || null,
        user_agent: deviceInfo?.userAgent || null,
        platform: deviceInfo?.platform || null,
        device_info: deviceInfo ? JSON.stringify(deviceInfo) : null
      })
  } catch (error) {
    console.error('Failed to log access attempt:', error)
  }
}

// Get client IP address (client-side - for display only)
// Note: Actual IP verification happens server-side
export async function getClientIp(): Promise<string> {
  try {
    const response = await fetch('/api/admin/get-ip')
    const data = await response.json()
    return data.ip || 'unknown'
  } catch (error) {
    console.error('Failed to get client IP:', error)
    return 'unknown'
  }
}
