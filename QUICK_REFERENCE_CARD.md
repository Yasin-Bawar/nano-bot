# 🚀 Home Page Settings - Quick Reference Card

## 📍 URLs

| Page | URL |
|------|-----|
| Admin Panel | `/admin/home-settings` |
| Home Page | `/` |

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `home_hero_settings` | Hero section content |
| `home_features` | Feature cards |
| `home_section_settings` | Visibility controls |
| `home_settings_audit_log` | Change tracking |

## 🎨 Available Icons

```
Battery, Zap, Gauge, Shield, Wifi, Leaf
```

## 📝 Quick SQL Queries

### View All Settings
```sql
SELECT * FROM home_page_config;
```

### Check Hero Settings
```sql
SELECT * FROM home_hero_settings;
```

### List Features
```sql
SELECT * FROM home_features ORDER BY order_index;
```

### Check Visibility
```sql
SELECT * FROM home_section_settings;
```

### View Recent Changes
```sql
SELECT * FROM home_settings_audit_log 
ORDER BY changed_at DESC 
LIMIT 10;
```

## 🔧 API Functions

### Get Settings
```typescript
import { getHomeSettings } from "@/lib/api/home-settings"
const settings = await getHomeSettings()
```

### Update Settings
```typescript
import { updateHomeSettings } from "@/lib/api/home-settings"
await updateHomeSettings(settings)
```

### Upload Image
```typescript
import { uploadImage } from "@/lib/api/home-settings"
const url = await uploadImage(file)
```

## 🎯 Admin Panel Tabs

1. **Hero Section** - Main banner content
2. **Features** - Feature cards management
3. **Products Section** - Products section titles
4. **Visibility** - Show/hide sections

## ✅ Installation Checklist

- [ ] Run `SQL_CODE_ONLY.sql` in Supabase
- [ ] Verify tables created
- [ ] Access `/admin/home-settings`
- [ ] Test editing content
- [ ] Test image upload
- [ ] Test adding features
- [ ] Verify changes on home page

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| SQL fails | Run admin-schema.sql first |
| 404 error | Restart Next.js server |
| Images not uploading | Check storage bucket exists |
| Changes not showing | Hard refresh (Ctrl+Shift+R) |

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Security

- ✅ Public READ access
- ✅ Admin WRITE access
- ✅ RLS enabled
- ✅ Secure storage

## 📚 Documentation Files

1. `SQL_CODE_ONLY.sql` - Copy-paste SQL
2. `INSTALLATION_STEPS.md` - Setup guide
3. `HOME_PAGE_EDITOR_GUIDE.md` - Full guide
4. `COMPLETE_IMPLEMENTATION.md` - Overview
5. `QUICK_REFERENCE_CARD.md` - This file

## 🎉 Quick Start (3 Steps)

1. **Run SQL** → Copy `SQL_CODE_ONLY.sql` to Supabase
2. **Access Admin** → Go to `/admin/home-settings`
3. **Start Editing** → Edit content and save!

---

**Need Help?** Check `INSTALLATION_STEPS.md` for detailed troubleshooting.
