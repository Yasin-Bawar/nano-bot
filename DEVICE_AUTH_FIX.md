# Device Authentication Fix

## Problem
The device authentication was returning 403 errors because the API routes were using the **anon key** instead of the **service role key**. The RLS policies on `authorized_devices` table require service role access.

## What Was Fixed
✅ Updated `app/api/admin/check-device/route.ts` to use service role key
✅ Updated `lib/device-auth.ts` to use service role key
✅ Updated `app/api/admin/login/route.ts` to use service role key

## Required Action: Add Service Role Key

You need to add the **SUPABASE_SERVICE_ROLE_KEY** to your `.env.local` file:

### Step 1: Get Your Service Role Key
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Find the **service_role** key (it's marked as secret)
5. Copy the key

### Step 2: Add to .env.local
Add this line to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Your `.env.local` should look like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ifwvopjnyocdkwiualju.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Restart Your Dev Server
After adding the key, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Why Service Role Key?
- The **anon key** is for public/client-side access with RLS enabled
- The **service role key** bypasses RLS and is used for server-side admin operations
- Device authentication needs to check the `authorized_devices` table which has RLS enabled
- Only the service role can access these protected admin tables

## Security Note
⚠️ **NEVER** expose the service role key in client-side code or commit it to git!
- It's only used in API routes (server-side)
- Keep it in `.env.local` which is gitignored
- In production, add it to your Vercel environment variables

## Test After Fix
1. Add the service role key to `.env.local`
2. Restart your dev server
3. Try accessing the admin panel
4. Device authentication should now work without 403 errors
