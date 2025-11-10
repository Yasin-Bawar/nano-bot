import { NextRequest, NextResponse } from 'next/server'

// This API route is deprecated - use useLocalIPv4 hook on client side instead
// The hook uses WebRTC to detect local IPv4 address (192.168.x.x, 10.x.x.x)
export async function GET(request: NextRequest) {
    // Server-side IP detection (public IP from headers)
    const publicIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
        || request.headers.get('x-real-ip')
        || '127.0.0.1'

    return NextResponse.json({
        ip: publicIp,
        note: 'This is the public/forwarded IP. For local IP, use useLocalIPv4 hook on client side.'
    })
}
