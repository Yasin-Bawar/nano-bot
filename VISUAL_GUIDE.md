# 📸 Visual Guide - Admin Messaging Features

## 🎨 Interface Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Admin Messages                                    [Logout] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │              │  │                                      │  │
│  │ Conversations│  │        Chat Messages                │  │
│  │              │  │                                      │  │
│  │ [Search...]  │  │  ┌──────────────────────────────┐  │  │
│  │              │  │  │ امروز                         │  │  │
│  │ ┌──────────┐ │  │  ├──────────────────────────────┤  │  │
│  │ │ Customer │ │  │  │ Customer: سلام               │  │  │
│  │ │ Name     │ │  │  │ 10:30                        │  │  │
│  │ │ Last msg │ │  │  └──────────────────────────────┘  │  │
│  │ └──────────┘ │  │                                      │  │
│  │              │  │  ┌──────────────────────────────┐  │  │
│  │ ┌──────────┐ │  │  │ Admin: چطور میتونم کمک کنم؟ │  │  │
│  │ │ Customer │ │  │  │ 10:31                        │  │  │
│  │ │ Name     │ │  │  └──────────────────────────────┘  │  │
│  │ │ Last msg │ │  │                                      │  │
│  │ └──────────┘ │  │                                      │  │
│  │              │  │                                      │  │
│  └──────────────┘  └────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [🔊] [📷] [😊] [📦] [Type message...] [Send ➤]        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Feature Popups

### Emoji Picker Popup
```
┌─────────────────────────────┐
│ انتخاب ایموجی            [X]│
├─────────────────────────────┤
│ 😊 👍 ❤️ 🎉 🔥 ✅ 👌 💯 🙏 😍│
│ 🤝 💪 ⭐ 🎁 🚀 💰 📦 ✨ 👏 🌟│
└─────────────────────────────┘
```

### Product Selector Popup
```
┌──────────────────────────────────┐
│ توصیه محصول                   [X]│
├──────────────────────────────────┤
│ [Search products...]             │
├──────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ [IMG] Sport SR/F           │  │
│ │       اسپرت SR/F            │  │
│ │       19,995 افغانی         │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ [IMG] Urban Cruiser        │  │
│ │       کروزر شهری            │  │
│ │       17,995 افغانی         │  │
│ └────────────────────────────┘  │
└──────────────────────────────────┘
```

## 💬 Message Types

### Text Message
```
┌─────────────────────────────┐
│ Admin: سلام! چطور میتونم    │
│ کمک کنم؟                    │
│                      10:30  │
└─────────────────────────────┘
```

### Image Message
```
┌─────────────────────────────┐
│ Admin:                      │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │    [IMAGE PREVIEW]      │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                      10:31  │
└─────────────────────────────┘
```

### Product Card Message
```
┌─────────────────────────────────┐
│ Admin:                          │
│ ┌─────────────────────────────┐ │
│ │ [IMG] 📦 Sport SR/F         │ │
│ │       اسپرت SR/F             │ │
│ │       19,995 افغانی          │ │
│ └─────────────────────────────┘ │
│                          10:32  │
└─────────────────────────────────┘
```

### Emoji Message
```
┌─────────────────────────────┐
│ Admin: عالی! 👍 ممنون 🙏    │
│                      10:33  │
└─────────────────────────────┘
```

## 🔔 Notification

### Browser Notification
```
┌─────────────────────────────────┐
│ 🔔 پیام جدید از مشتری           │
├─────────────────────────────────┤
│ سلام! می‌خواهم این محصول را...│
│                                 │
│                         [Close] │
└─────────────────────────────────┘
```

### Sound Wave (Visual Representation)
```
🔊 Beep 1: ~~~∿∿∿~~~  (800Hz, 0.5s)
   Pause:  ----       (0.2s)
🔊 Beep 2: ~~~∿∿∿~~~  (1000Hz, 0.3s)
```

## 🎨 Button States

### Sound Toggle
```
Active:   [🔊]  ← Blue background
Inactive: [🔇]  ← Gray background
```

### Image Upload
```
Normal:   [📷]  ← Gray background
Hover:    [📷]  ← Light gray background
Loading:  [⟳]  ← Spinner animation
```

### Emoji Picker
```
Closed:   [😊]  ← Gray background
Open:     [😊]  ← Blue background
```

### Product Selector
```
Closed:   [📦]  ← Gray background
Open:     [📦]  ← Blue background
```

## 📱 Mobile View

```
┌─────────────────────────┐
│ Admin Messages  [Logout]│
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ Customer: سلام      │ │
│ │ 10:30               │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Admin: چطور میتونم  │ │
│ │ کمک کنم؟            │ │
│ │ 10:31               │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ [🔊][📷][😊][📦]       │
│ [Type message...]       │
│ [Send ➤]                │
└─────────────────────────┘
```

## 🎯 User Flow

### Sending Emoji
```
1. Click 😊 button
   ↓
2. Popup opens with emojis
   ↓
3. Click desired emoji
   ↓
4. Emoji inserted in text
   ↓
5. Popup closes
   ↓
6. Click Send ➤
```

### Uploading Image
```
1. Click 📷 button
   ↓
2. File picker opens
   ↓
3. Select image file
   ↓
4. Loading spinner shows
   ↓
5. Image uploads to Supabase
   ↓
6. Image appears in chat
```

### Recommending Product
```
1. Click 📦 button
   ↓
2. Product selector opens
   ↓
3. Type search term
   ↓
4. Products filter in real-time
   ↓
5. Click desired product
   ↓
6. Product card sent to chat
   ↓
7. Popup closes
```

### Receiving Notification
```
Customer sends message
   ↓
Real-time update received
   ↓
Sound plays (if enabled)
   ↓
Browser notification shows
   ↓
Message appears in chat
   ↓
Conversation moves to top
```

## 🎨 Color Scheme

```
Primary:    #2563EB (Blue)
Accent:     #3B82F6 (Light Blue)
Success:    #10B981 (Green)
Warning:    #F59E0B (Orange)
Error:      #EF4444 (Red)
Gray:       #6B7280 (Gray)
Background: #F9FAFB (Light Gray)
White:      #FFFFFF (White)
```

## 📐 Dimensions

```
Button Size:        44px × 44px (touch-friendly)
Emoji Grid:         10 columns
Product Card:       Full width, max 384px
Popup Width:        320px (emoji), 384px (product)
Message Max Width:  448px (28rem)
Input Height:       Auto (min 48px, max 120px)
```

## ✨ Animations

```
Popup Open:     Fade in + Slide up (200ms)
Popup Close:    Fade out + Slide down (200ms)
Button Hover:   Scale 1.05 (150ms)
Button Click:   Scale 0.95 (100ms)
Loading:        Rotate 360° (1s infinite)
Message Send:   Fade in + Slide up (300ms)
```

---

**This visual guide helps you understand the layout and flow of all features!**
