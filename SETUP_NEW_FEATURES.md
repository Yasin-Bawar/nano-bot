# Quick Setup Guide - New Admin Messaging Features

## 🚀 Quick Start (3 Steps)

### Step 1: Setup Storage Bucket
Run this SQL in your Supabase SQL Editor:

```sql
-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Anyone can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');
```

Or simply run the file:
```bash
# Copy contents of setup-storage-bucket.sql and run in Supabase
```

### Step 2: Test the Features
1. Open admin panel: `http://localhost:3000/admin/messages`
2. Select a conversation
3. Try each feature:
   - Click 😊 for emojis
   - Click 📷 to upload image
   - Click 📦 to recommend product
   - Click 🔊 to toggle sound

### Step 3: Grant Permissions
When you first load the page:
- **Allow** browser notifications when prompted
- This enables desktop notifications for new messages

## ✅ Feature Checklist

### Emoji Picker ✅
- [x] Click emoji button (😊)
- [x] Select an emoji
- [x] Emoji appears in text input
- [x] Click outside to close

### Image Upload ✅
- [x] Click image button (📷)
- [x] Select an image file
- [x] Wait for upload (loading spinner)
- [x] Image appears in chat

### Product Recommendation ✅
- [x] Click package button (📦)
- [x] Search for a product
- [x] Click product to send
- [x] Product card appears in chat

### Notifications ✅
- [x] Sound toggle button (🔊/🔇)
- [x] Receive test message from customer
- [x] Hear notification sound
- [x] See browser notification

## 🎯 Testing Guide

### Test Emoji Picker
```
1. Open admin messages
2. Select a conversation
3. Click 😊 button
4. Click any emoji
5. Type some text
6. Send message
✅ Message should contain emoji
```

### Test Image Upload
```
1. Click 📷 button
2. Select image (< 5MB)
3. Wait for upload
4. Check message appears with image
✅ Image should display in chat
```

### Test Product Recommendation
```
1. Click 📦 button
2. Search "sport" or "urban"
3. Click a product
4. Check product card in chat
✅ Product card should show image, name, price
```

### Test Notifications
```
1. Ensure sound is ON (🔊)
2. Open user messaging in another tab
3. Send a message as customer
4. Switch back to admin tab
✅ Should hear sound and see notification
```

## 🔧 Troubleshooting

### "Storage bucket not found"
**Solution**: Run setup-storage-bucket.sql in Supabase

### "No products found"
**Solution**: Ensure products table has data (run supabase-schema.sql)

### "Notification permission denied"
**Solution**: 
1. Click lock icon in browser address bar
2. Allow notifications
3. Refresh page

### "Sound not playing"
**Solution**:
1. Check sound toggle is ON (🔊)
2. Unmute browser tab
3. Check browser sound settings

## 📱 Browser Compatibility

### Fully Supported
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Partial Support
- ⚠️ Mobile browsers (notifications may vary)
- ⚠️ Older browsers (some features may not work)

## 🎨 Customization

### Change Notification Sound
Edit `playNotificationSound()` function in `app/admin/messages/page.tsx`:
```typescript
oscillator.frequency.value = 800 // Change frequency
gainNode.gain.setValueAtTime(0.3, ...) // Change volume
```

### Add More Emojis
Edit `commonEmojis` array:
```typescript
const commonEmojis = ['😊', '👍', '❤️', ...] // Add your emojis
```

### Change Upload Size Limit
Edit `handleImageUpload()` function:
```typescript
if (file.size > 5 * 1024 * 1024) { // Change 5 to your limit (MB)
```

## 📊 Monitoring

### Check Upload Stats
```sql
-- In Supabase SQL Editor
SELECT COUNT(*) as total_uploads,
       SUM(metadata->>'size')::bigint / 1024 / 1024 as total_mb
FROM storage.objects
WHERE bucket_id = 'uploads';
```

### Check Message Types
```sql
SELECT 
  CASE 
    WHEN message LIKE 'IMAGE:%' THEN 'Image'
    WHEN message LIKE 'PRODUCT_CARD:%' THEN 'Product'
    ELSE 'Text'
  END as message_type,
  COUNT(*) as count
FROM messages
WHERE sender_type = 'admin'
GROUP BY message_type;
```

## 🎉 You're All Set!

All features are now ready to use. Start chatting with customers using:
- 😊 Emojis for friendly communication
- 📷 Images for visual explanations
- 📦 Product recommendations for sales
- 🔔 Notifications to never miss a message

---

**Need Help?** Check ADMIN_MESSAGING_COMPLETE_FEATURES.md for detailed documentation.
