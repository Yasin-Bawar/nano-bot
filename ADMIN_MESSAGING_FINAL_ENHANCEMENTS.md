# Admin Messaging - Final Enhancements Implementation Guide

## Features to Add

### 1. Sound Notifications 🔊

**Step 1:** Create notification sound file
- Download a notification sound (e.g., from https://notificationsounds.com/)
- Save as `public/sounds/notification.mp3`

**Step 2:** Add to admin messages page

```typescript
// Add to state
const [soundEnabled, setSoundEnabled] = useState(true)
const audioRef = useRef<HTMLAudioElement | null>(null)

// Add useEffect to initialize audio
useEffect(() => {
  audioRef.current = new Audio('/sounds/notification.mp3')
  audioRef.current.volume = 0.5
}, [])

// Add to real-time subscription callback
const channel = supabase
  .channel('admin-messages')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      const newMsg = payload.new
      // Only play sound for customer messages
      if (newMsg.sender_type === 'customer' && soundEnabled) {
        audioRef.current?.play()
        
        // Browser notification
        if (Notification.permission === 'granted') {
          new Notification('پیام جدید', {
            body: `پیام از ${newMsg.customer?.name || 'مشتری'}`,
            icon: '/icon.png'
          })
        }
      }
      loadConversations()
    }
  )
  .subscribe()

// Request notification permission on mount
useEffect(() => {
  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }
}, [])
```

**Step 3:** Add sound toggle button

```tsx
<button
  onClick={() => setSoundEnabled(!soundEnabled)}
  className="p-2 hover:bg-gray-100 rounded-lg"
  title={soundEnabled ? 'صدا روشن' : 'صدا خاموش'}
>
  {soundEnabled ? '🔊' : '🔇'}
</button>
```

### 2. Emoji Picker 😊

**Step 1:** Add simple emoji picker

```typescript
// Add to state
const [showEmojiPicker, setShowEmojiPicker] = useState(false)

// Common emojis
const commonEmojis = ['😊', '👍', '❤️', '😂', '🙏', '👌', '✅', '🎉', '💯', '🔥']

// Add emoji to message
const addEmoji = (emoji: string) => {
  setNewMessage(prev => prev + emoji)
  setShowEmojiPicker(false)
}
```

**Step 2:** Add emoji picker UI

```tsx
{/* Emoji Picker Button */}
<button
  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
  className="p-2 hover:bg-gray-100 rounded-lg"
>
  <Smile className="w-5 h-5 text-gray-600" />
</button>

{/* Emoji Picker Dropdown */}
{showEmojiPicker && (
  <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border p-3 z-10">
    <div className="grid grid-cols-5 gap-2">
      {commonEmojis.map(emoji => (
        <button
          key={emoji}
          onClick={() => addEmoji(emoji)}
          className="text-2xl hover:bg-gray-100 rounded p-1"
        >
          {emoji}
        </button>
      ))}
    </div>
  </div>
)}
```

### 3. Image Upload 📷

**Step 1:** Add image upload state

```typescript
const [selectedImage, setSelectedImage] = useState<File | null>(null)
const [imagePreview, setImagePreview] = useState<string | null>(null)
const fileInputRef = useRef<HTMLInputElement>(null)

// Handle image selection
const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
}

// Upload image to Supabase storage
const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `messages/${fileName}`

  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return publicUrl
}

// Send message with image
const handleSendWithImage = async () => {
  if (selectedImage) {
    const imageUrl = await uploadImage(selectedImage)
    await sendAdminMessage(
      selectedConversation.customer_id,
      selectedConversation.order_id,
      `IMAGE:${imageUrl}`
    )
    setSelectedImage(null)
    setImagePreview(null)
  }
}
```

**Step 2:** Add image upload UI

```tsx
{/* Hidden file input */}
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleImageSelect}
  className="hidden"
/>

{/* Image upload button */}
<button
  onClick={() => fileInputRef.current?.click()}
  className="p-2 hover:bg-gray-100 rounded-lg"
>
  <Image className="w-5 h-5 text-gray-600" />
</button>

{/* Image preview */}
{imagePreview && (
  <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border p-3">
    <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded" />
    <div className="flex gap-2 mt-2">
      <button onClick={handleSendWithImage} className="flex-1 bg-primary text-white px-3 py-1 rounded">
        ارسال
      </button>
      <button onClick={() => {setSelectedImage(null); setImagePreview(null)}} className="flex-1 bg-gray-200 px-3 py-1 rounded">
        لغو
      </button>
    </div>
  </div>
)}
```

### 4. Product Recommendation 🛍️

**Step 1:** Add product selector state

```typescript
const [showProductSelector, setShowProductSelector] = useState(false)
const [products, setProducts] = useState<any[]>([])
const [productSearch, setProductSearch] = useState("")

// Load products
useEffect(() => {
  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .limit(20)
    setProducts(data || [])
  }
  loadProducts()
}, [])

// Send product recommendation
const sendProductRecommendation = async (product: any) => {
  const productCard = {
    id: product.id,
    name: product.name,
    name_local: product.name_local,
    price: product.price,
    image: product.image
  }
  
  await sendAdminMessage(
    selectedConversation.customer_id,
    selectedConversation.order_id,
    `PRODUCT_CARD:${JSON.stringify(productCard)}`
  )
  
  setShowProductSelector(false)
}
```

**Step 2:** Add product selector UI

```tsx
{/* Product recommendation button */}
<button
  onClick={() => setShowProductSelector(true)}
  className="p-2 hover:bg-gray-100 rounded-lg"
  title="توصیه محصول"
>
  <Package className="w-5 h-5 text-gray-600" />
</button>

{/* Product selector modal */}
{showProductSelector && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowProductSelector(false)}>
    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-bold text-right">انتخاب محصول برای توصیه</h3>
        <input
          type="text"
          placeholder="جستجو محصول..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          className="w-full mt-3 px-4 py-2 border rounded-lg text-right"
        />
      </div>
      <div className="p-4 overflow-y-auto max-h-96">
        <div className="grid grid-cols-2 gap-4">
          {products
            .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
            .map(product => (
              <button
                key={product.id}
                onClick={() => sendProductRecommendation(product)}
                className="border rounded-lg p-3 hover:border-primary transition-colors text-right"
              >
                <img src={product.image} alt={product.name} className="w-full h-32 object-contain mb-2" />
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-primary font-bold text-sm">{product.price} افغانی</p>
              </button>
            ))}
        </div>
      </div>
    </div>
  </div>
)}
```

### 5. Render Images in Messages

**Update renderMessage function:**

```typescript
const renderMessage = (msg: any) => {
  // Handle images
  if (msg.message.startsWith('IMAGE:')) {
    const imageUrl = msg.message.replace('IMAGE:', '')
    return (
      <img 
        src={imageUrl} 
        alt="Shared image" 
        className="max-w-xs rounded-lg cursor-pointer"
        onClick={() => window.open(imageUrl, '_blank')}
      />
    )
  }
  
  // Handle product cards (existing code)
  if (msg.message.startsWith('PRODUCT_CARD:')) {
    // ... existing product card code
  }
  
  // Regular text
  return <p className="text-sm leading-relaxed">{msg.message}</p>
}
```

## Complete Input Area Layout

```tsx
<div className="p-4 bg-white border-t border-gray-200">
  <div className="flex items-end gap-2">
    {/* Emoji picker */}
    <div className="relative">
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-gray-100 rounded-lg">
        <Smile className="w-5 h-5 text-gray-600" />
      </button>
      {showEmojiPicker && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-lg border p-3 z-10">
          <div className="grid grid-cols-5 gap-2">
            {commonEmojis.map(emoji => (
              <button key={emoji} onClick={() => addEmoji(emoji)} className="text-2xl hover:bg-gray-100 rounded p-1">
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Image upload */}
    <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-lg">
      <Image className="w-5 h-5 text-gray-600" />
    </button>
    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

    {/* Product recommendation */}
    <button onClick={() => setShowProductSelector(true)} className="p-2 hover:bg-gray-100 rounded-lg">
      <Package className="w-5 h-5 text-gray-600" />
    </button>

    {/* Message input */}
    <textarea
      ref={textareaRef}
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
      placeholder="پیام خود را بنویسید..."
      disabled={sending}
      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-right disabled:opacity-50 resize-none"
      rows={1}
    />

    {/* Send button */}
    <button
      onClick={handleSendMessage}
      disabled={!newMessage.trim() || sending}
      className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
    >
      <Send className="w-5 h-5" />
    </button>
  </div>
</div>
```

## Summary

After implementing these features, the admin messaging will have:

✅ Sound notifications when new messages arrive
✅ Browser desktop notifications
✅ Emoji picker for friendly conversations
✅ Image upload and sharing
✅ Product recommendation to customers
✅ Beautiful, functional UI

All features are designed to work seamlessly with the existing real-time messaging system!
