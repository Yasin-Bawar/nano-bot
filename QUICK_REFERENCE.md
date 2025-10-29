# 🚀 Quick Reference - Admin Messaging Features

## One-Time Setup (30 seconds)

```sql
-- 1. Run this in Supabase SQL Editor:
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Anyone can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');
```

## Feature Buttons

| Button | Feature | Action |
|--------|---------|--------|
| 🔊 | Sound ON | Click to enable notifications |
| 🔇 | Sound OFF | Click to disable notifications |
| 📷 | Image Upload | Click to upload image |
| 😊 | Emoji Picker | Click to select emoji |
| 📦 | Product Recommend | Click to search & send product |
| ➤ | Send | Click to send message |

## Quick Actions

### Send Emoji
```
1. Click 😊
2. Click emoji
3. Send
```

### Upload Image
```
1. Click 📷
2. Select image
3. Wait for upload
```

### Recommend Product
```
1. Click 📦
2. Search product
3. Click to send
```

### Toggle Sound
```
1. Click 🔊/🔇
2. Done!
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Esc` | Close popup |

## Message Types

| Type | Format | Example |
|------|--------|---------|
| Text | Plain text | "Hello customer" |
| Image | `IMAGE:url` | Displays image |
| Product | `PRODUCT_CARD:json` | Shows product card |
| Emoji | Unicode | "Great! 👍" |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No sound | Check 🔊 is active |
| No notifications | Allow in browser |
| Upload fails | Run SQL setup |
| No products | Check database |

## Browser Permissions

### First Time Setup
1. Allow notifications when prompted
2. Keep sound unmuted
3. Done!

## File Limits

- **Max Image Size**: 5MB
- **Supported Formats**: JPG, PNG, GIF, WebP
- **Storage**: Supabase Storage (unlimited)

## Support

- **Full Docs**: `ADMIN_MESSAGING_COMPLETE_FEATURES.md`
- **Setup Guide**: `SETUP_NEW_FEATURES.md`
- **Summary**: `ADMIN_MESSAGING_ENHANCEMENTS_COMPLETE.md`

---

**Version**: 2.0 | **Status**: ✅ Ready
