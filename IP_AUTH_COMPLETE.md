# IP-Based Authentication - Complete Setup

## What Changed

✅ **Web Admin**: Now uses WebRTC to detect your local IPv4 address (e.g., 192.168.1.100)
✅ **Electron App**: Now uses Node.js `os.networkInterfaces()` to get your local IPv4 address
✅ **Both use the same IP** for authentication!

## How It Works

1. **Web Admin** (`http://localhost:3000/x9k2m7p4q8w5n3j6`):
   - Uses WebRTC to detect your local IP (192.168.x.x or 10.x.x.x)
   - Sends IP to server for authorization check
   - Shows "Access Denied" with your IP if not authorized

2. **Electron Admin App**:
   - Uses Node.js to get your network interface IP
   - Shows your IP address in the "Current Device" section
   - Can add your IP to the authorized list directly

## Setup Steps

### Step 1: Add Service Role Key

Add to `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmd3ZvcGpueW9jZGt3aXVhbGp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEzNzYwNywiZXhwIjoyMDc2NzEzNjA3fQ.dAZYtmI7UXjx_x10nmFzn79sWcvqUmva1JgCyo-w_00
```

### Step 2: Restart Dev Server

```bash
npm run dev
```

### Step 3: Get Your IP Address

**Option A - From Web Admin:**
1. Go to `http://localhost:3000/x9k2m7p4q8w5n3j6`
2. You'll see "Access Denied" with your IP address
3. Click "📋 Copy IP Address"

**Option B - From Electron App:**
1. Open the Electron Admin App
2. Go to "Current Device" section
3. Your IP will be shown automatically
4. Click "📋 Copy IP Address"

### Step 4: Add Your IP to Database

**Option A - Using Electron App (Easiest):**
1. In Electron app, go to "Current Device"
2. Enter a name (e.g., "My Office Computer")
3. Click "➕ افزودن/به‌روزرسانی IP فعلی"
4. Done!

**Option B - Using SQL:**
1. Go to Supabase SQL Editor
2. Run this (replace YOUR_IP):

```sql
INSERT INTO authorized_devices (
  device_id,
  device_name,
  device_fingerprint,
  authorized_by,
  is_active,
  notes
) VALUES (
  'YOUR_IP',  -- e.g., '192.168.1.100'
  'My Computer',
  'YOUR_IP',
  'Manual Setup',
  true,
  'Authorized IP address'
)
ON CONFLICT (device_id) 
DO UPDATE SET is_active = true;
```

### Step 5: Test

1. Refresh the web admin page
2. You should now see the login form!
3. Login with your credentials

## Example IPs

- **Home WiFi**: `192.168.1.100`
- **Office Network**: `192.168.0.50`
- **Local Development**: `127.0.0.1` (already authorized)

## Benefits of IP-Based Auth

✅ **Simple**: Just your local IP address
✅ **Consistent**: Same IP from web and Electron app
✅ **Secure**: Only authorized IPs can access admin
✅ **Easy to manage**: Add/remove IPs easily

## Troubleshooting

### "No local IPv4 found"
- Make sure you're connected to WiFi or Ethernet
- Check your network settings

### Still getting "Access Denied"
- Make sure the IP in the database matches exactly
- Check that `is_active = true` in the database
- Restart your dev server after adding the service role key

### Different IP each time
- Your router may be using DHCP
- Set a static IP in your router settings
- Or add multiple IPs to the authorized list

## Security Notes

⚠️ **Service Role Key**: Keep it secret! Never commit to git.
⚠️ **IP Addresses**: Only add trusted IPs to the authorized list.
✅ **Local Network**: This works best on local networks (192.168.x.x, 10.x.x.x)
