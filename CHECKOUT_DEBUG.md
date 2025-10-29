# 🔍 Checkout Debugging Guide

## How to Debug the Checkout Error

### Step 1: Open Browser Console
1. Press `F12` on your keyboard
2. Click on "Console" tab
3. Keep it open while testing

### Step 2: Try Checkout
1. Go to: `http://localhost:3000/checkout?product=1&name=Sport+SR/F`
2. Fill the form:
   - Name: `احمد محمدی`
   - Phone: `700123456`
   - Location: `هرات`
3. Click "ادامه" (Continue)

### Step 3: Check Console Logs
You should see these messages:
```
Starting checkout process...
Creating customer with data: {...}
Customer created: {...}
Creating order...
Order created: {...}
```

### Step 4: Identify the Error
If there's an error, you'll see:
```
Error creating order: [error message]
Error details: [detailed info]
```

## 🎯 Common Errors & Solutions

### Error 1: "Cannot read property 'id' of undefined"
**Cause:** Customer creation failed
**Solution:** Check Supabase connection

### Error 2: "Invalid UUID"
**Cause:** product_id format issue
**Solution:** Already fixed (set to null)

### Error 3: "Permission denied"
**Cause:** RLS policy blocking insert
**Solution:** Check Supabase RLS policies

### Error 4: "Network error"
**Cause:** Supabase not reachable
**Solution:** Check .env.local file

## ✅ Verification Steps

### Check 1: Supabase Connection
```javascript
// In browser console:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

### Check 2: Database Tables
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Verify these tables exist:
   - customers
   - orders
   - messages

### Check 3: RLS Policies
1. Go to Supabase Dashboard
2. Click "Authentication" → "Policies"
3. Check `customers` table has INSERT policy
4. Check `orders` table has INSERT policy

## 🔧 Quick Fixes

### Fix 1: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Fix 2: Clear Browser Cache
```bash
# In browser:
Ctrl+Shift+Delete
# Clear cache and reload
```

### Fix 3: Check Environment Variables
```bash
# In .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://ifwvopjnyocdkwiualju.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Fix 4: Verify Supabase RLS
Run this in Supabase SQL Editor:
```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename IN ('customers', 'orders');

-- If no policies, run:
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
```

## 📊 Expected Flow

### Success Flow:
```
1. Form validation ✅
2. Create customer ✅
3. Customer saved to database ✅
4. Create order ✅
5. Order saved to database ✅
6. Store in localStorage ✅
7. Redirect to messaging ✅
```

### Error Flow:
```
1. Form validation ✅
2. Create customer ❌ [Error here]
   OR
3. Create order ❌ [Error here]
4. Show error message
5. Stay on checkout page
```

## 🎯 What to Share

If you still get errors, share these from console:
1. The exact error message
2. The "Error details" line
3. Any red error messages
4. The console logs before the error

## 💡 Pro Tips

### Tip 1: Check Network Tab
1. Open F12
2. Click "Network" tab
3. Try checkout
4. Look for failed requests (red)
5. Click on them to see details

### Tip 2: Test Supabase Directly
```javascript
// In browser console:
const { createClient } = await import('@supabase/supabase-js')
const supabase = createClient(
  'https://ifwvopjnyocdkwiualju.supabase.co',
  'your-anon-key'
)

// Test insert
const { data, error } = await supabase
  .from('customers')
  .insert([{ name: 'Test', phone: '123', country_code: '+93', location: 'Test' }])
  .select()

console.log('Result:', data, error)
```

### Tip 3: Simplify Test
Try with minimal data:
- Name: `Test`
- Phone: `700000000`
- Location: `Test`

## 🎊 When It Works

You'll see:
1. ✅ Console logs showing success
2. ✅ Redirect to messaging page
3. ✅ Data in Supabase tables
4. ✅ Can send messages

## 📞 Next Steps

1. Open browser console (F12)
2. Try checkout
3. Copy the error message
4. Share it so I can help fix it

**The detailed logs will show exactly what's wrong! 🔍**
