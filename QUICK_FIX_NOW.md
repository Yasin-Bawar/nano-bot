# Quick Fix - Add Your Device NOW

## Step 1: Add Service Role Key

Add this line to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmd3ZvcGpueW9jZGt3aXVhbGp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTEzNzYwNywiZXhwIjoyMDc2NzEzNjA3fQ.dAZYtmI7UXjx_x10nmFzn79sWcvqUmva1JgCyo-w_00
```

## Step 2: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 3: Get Your Device ID

1. Go to: `http://localhost:3000/x9k2m7p4q8w5n3j6`
2. You'll see "Access Denied" page
3. Click "📋 Copy Device ID" button
4. Your device ID is now in clipboard!

## Step 4: Add Device to Database

1. Go to Supabase Dashboard → SQL Editor
2. Paste this SQL (replace YOUR_DEVICE_ID with the copied ID):

```sql
INSERT INTO authorized_devices (
  device_id,
  device_name,
  device_fingerprint,
  authorized_by,
  is_active,
  notes
) VALUES (
  'YOUR_DEVICE_ID',
  'My Browser',
  'YOUR_DEVICE_ID',
  'Manual Setup',
  true,
  'Authorized device'
)
ON CONFLICT (device_id) 
DO UPDATE SET is_active = true;
```

3. Click "Run"

## Step 5: Test

1. Refresh the admin page: `http://localhost:3000/x9k2m7p4q8w5n3j6`
2. You should now see the login form!
3. Login with your admin credentials

## If You Get Errors

### Error: "column ip_address already exists"
- **Don't run** `migrate-to-ip-auth.sql`
- Use the SQL above instead

### Error: "table authorized_devices does not exist"
- Run `secure-admin-device-whitelist.sql` first
- Then follow steps above

### Still getting 403?
- Make sure you added the service role key to `.env.local`
- Make sure you restarted the dev server
- Check the device ID matches exactly (no spaces, full ID)

## That's It!

Once you see the login form, you're done. The device authentication is working!
