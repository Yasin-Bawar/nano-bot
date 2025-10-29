# Messaging Issues & Fixes

## Issues Identified

### 1. Product Card Not Sending Automatically ❌
**Problem:** When clicking "Buy" on a product, it goes to messaging page but doesn't automatically send the product card.

**Root Cause:** The product data might not be passed correctly via URL params, or the auto-send logic isn't triggering.

**Fix Needed:** Check the product page "Buy" button and ensure it passes product data correctly.

### 2. Product Image Not Showing in Admin Panel ❌
**Problem:** Product cards in admin messages don't show the product image.

**Root Cause:** The product card rendering in admin panel might not have the image field, or the image path is incorrect.

**Fix Needed:** Update the admin panel's product card rendering to include the image.

### 3. Customer Messaging Not Real-Time ❌
**Problem:** Customer messaging page doesn't update in real-time.

**Root Cause:** 
- Supabase real-time might not be enabled for messages table
- RLS policies might be blocking real-time subscriptions
- WebSocket connection might not be establishing

**Fix Needed:** 
- Enable real-time in Supabase dashboard
- Fix RLS policies to allow real-time subscriptions
- Add debugging to check subscription status

## Step-by-Step Fixes

### Fix 1: Product Card Auto-Send

**Check Product Page Button:**
The "Buy" button should pass product data like this:
```typescript
router.push(`/messaging?product=${encodeURIComponent(JSON.stringify({
  id: product.id,
  name: product.name,
  name_local: product.name_local,
  price: product.price,
  image: product.image
}))}`)
```

**Check Messaging Page:**
Should automatically send product card on mount if product param exists.

### Fix 2: Product Image in Admin Panel

**Current Issue:** Admin panel product card renderer doesn't show image.

**Fix:** Update the `renderMessage` function in admin messages page to include image display.

### Fix 3: Real-Time Not Working

**Possible Causes:**
1. **Supabase Real-time Not Enabled**
   - Go to Supabase Dashboard → Database → Replication
   - Enable "messages" table for replication

2. **RLS Policies Blocking**
   - Customers need SELECT permission on messages
   - Check policies allow real-time subscriptions

3. **WebSocket Not Connecting**
   - Check browser console for errors
   - Check network tab for WebSocket connection

## Quick Diagnostic Commands

### Check if Real-Time is Enabled
```sql
-- Run in Supabase SQL Editor
SELECT * FROM pg_publication_tables WHERE tablename = 'messages';
```

### Check RLS Policies
```sql
-- Run in Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'messages';
```

### Test Real-Time Connection
```typescript
// Add to messaging page temporarily
useEffect(() => {
  const channel = supabase
    .channel('test-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'messages' },
      (payload) => console.log('✅ Real-time working!', payload)
    )
    .subscribe((status) => {
      console.log('Subscription status:', status)
      if (status === 'SUBSCRIBED') {
        console.log('✅ Successfully subscribed to real-time')
      }
    })
  
  return () => supabase.removeChannel(channel)
}, [])
```

## Priority Order

1. **Fix Product Image in Admin** (Quick fix)
2. **Fix Product Auto-Send** (Medium fix)
3. **Fix Real-Time** (Requires Supabase dashboard access)

## Next Steps

Would you like me to:
1. Fix the product image rendering in admin panel?
2. Fix the product auto-send logic?
3. Add better debugging for real-time issues?
4. All of the above?
