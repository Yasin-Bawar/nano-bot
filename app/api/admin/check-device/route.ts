import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    // Get IP address from client (WebRTC local IP)
    const body = await request.json()
    const ipAddress = body.ipAddress
    
    if (!ipAddress) {
      return NextResponse.json({ 
        authorized: false, 
        error: 'IP address required' 
      }, { status: 400 })
    }
    
    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Check if IP is authorized in authorized_devices table (device_id stores IP)
    const { data: device, error } = await supabase
      .from('authorized_devices')
      .select('id, device_name, is_active')
      .eq('device_id', ipAddress)
      .single()
    
    const authorized = !error && device && device.is_active
    
    // Log the access attempt
    await supabase
      .from('admin_access_logs')
      .insert({
        device_id: ipAddress,
        ip_address: ipAddress,
        access_granted: authorized,
        denial_reason: !authorized ? (error ? 'IP not found in authorized list' : 'IP inactive') : null
      })
    
    if (authorized) {
      // Update last access time
      await supabase
        .from('authorized_devices')
        .update({ last_access: new Date().toISOString() })
        .eq('device_id', ipAddress)
      
      return NextResponse.json({ 
        authorized: true, 
        deviceName: device.device_name,
        ip: ipAddress
      })
    }
    
    return NextResponse.json({ 
      authorized: false, 
      error: 'IP address not authorized',
      ip: ipAddress
    }, { status: 403 })
    
  } catch (error) {
    console.error('IP check error:', error)
    return NextResponse.json({ 
      authorized: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
