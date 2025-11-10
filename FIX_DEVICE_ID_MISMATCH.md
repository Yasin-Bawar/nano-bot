# Fix Device ID Mismatch

## Problem
The device ID shown in the admin desktop app (`635274f4e38b85ce...`) is **different** from the device ID your website is sending (`7b34e6d69bd6df5f...`).

This happens because:
- The admin desktop app runs in Electron (different environment)
- The website runs in your browser
- They generate slightly different fingerprints due to environment differences

## Solution: Use the Website's Device ID

### Option 1: Get Device ID from Browser Console (EASIEST)

1. **Open your website** in the browser you want to authorize
2. **Go to the admin login page**: `http://localhost:3000/x9k2m7p4q8w5n3j6`
3. **Open Developer Console** (F12 or Right-click → Inspect)
4. **Go to Console tab**
5. **Paste this code** and press Enter:

```javascript
(async function() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('fingerprint', 2, 2);
  
  const fingerprint = {
    canvas: canvas.toDataURL(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  
  const str = JSON.stringify(fingerprint);
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const deviceId = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  console.log('Your Device ID:', deviceId);
  console.log('Copy this ID and add it to your database!');
  return deviceId;
})();
```

6. **Copy the Device ID** that appears in the console
7. **Add it to your database** using Supabase SQL Editor:

```sql
-- Replace YOUR_DEVICE_ID_HERE with the ID from console
INSERT INTO authorized_devices (
  device_id,
  device_name,
  device_fingerprint,
  authorized_by,
  is_active,
  notes
) VALUES (
  'YOUR_DEVICE_ID_HERE',
  'My Browser',
  'YOUR_DEVICE_ID_HERE',
  'Manual Setup',
  true,
  'Authorized from browser console'
);
```

### Option 2: Check Server Logs

1. **Try to access the admin page** (it will fail with 403)
2. **Check your server console** - it should show the device ID in the error
3. **Look for**: `Device ID: 7b34e6d69bd6df5f...`
4. **Copy that ID** and add it to the database using the SQL above

### Option 3: Temporarily Show Device ID on Page

I can add a temporary feature to show the device ID on the access denied page, so you can easily copy it.

## After Adding the Device ID

1. **Restart your dev server** (if you haven't already added the service role key)
2. **Go to the admin login page**
3. **It should now show "Device Authorized"** instead of "Access Denied"
4. **Login with your credentials**

## Why This Happens

The device fingerprint includes:
- Canvas rendering (different in Electron vs Browser)
- User agent (different in Electron vs Browser)
- Screen resolution
- Timezone
- Platform info

Since Electron and your browser have different environments, they generate different fingerprints.

## Quick Test

After adding the correct device ID, you should see:
- ✅ "Verifying device authorization..." (loading)
- ✅ Login form appears (device authorized)
- ❌ NOT "Access Denied"
