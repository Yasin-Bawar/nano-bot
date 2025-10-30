"use client"

import { useEffect, useState, useRef } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Send, MessageCircle, Search, Package, Check, CheckCheck, Image, Smile, Clock, X, Upload, Volume2, VolumeX } from "lucide-react"
import { getMessages, sendAdminMessage, getConversation, markMessagesAsRead } from "@/lib/api/admin"
import { searchProducts } from "@/lib/api/products"
import { supabase } from "@/lib/supabase"

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function isToday(dateString: string) {
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isYesterday(dateString: string) {
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toDateString() === yesterday.toDateString()
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all")
  
  // New features state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const productSelectorRef = useRef<HTMLDivElement>(null)

  // Emoji categories with extensive selection
  const emojiCategories: Record<string, string[]> = {
    'اخیر': ['😊', '👍', '❤️', '🎉', '🔥', '✅'],
    'چهره‌ها': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
    'دست‌ها': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶'],
    'قلب‌ها': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    'حیوانات': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    'غذا': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯'],
    'ورزش': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️'],
    'سفر': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕'],
    'اشیاء': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🪠', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪥', '🪒', '🧽', '🪣', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🪆', '🖼️', '🪞', '🪟', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🪄', '🪅', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧'],
    'نمادها': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
  }
  
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('اخیر')

  useEffect(() => {
    loadConversations()

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Set up Supabase real-time subscription
    const channel = supabase
      .channel('admin-messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('📨 New message received:', payload)
          const newMsg: any = payload.new
          
          // Play sound for customer messages
          if (newMsg.sender_type === 'customer' && soundEnabled) {
            playNotificationSound()
            
            // Browser notification
            if (Notification.permission === 'granted') {
              new Notification('پیام جدید از مشتری', {
                body: newMsg.message.substring(0, 50) + (newMsg.message.length > 50 ? '...' : ''),
                icon: '/icon.png',
                tag: 'new-message',
                requireInteraction: false
              })
            }
          }
          
          loadConversations()
          // If viewing a conversation, refresh it
          if (selectedConversation) {
            loadConversation(selectedConversation.customer_id, selectedConversation.order_id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation, soundEnabled])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [newMessage])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
      if (productSelectorRef.current && !productSelectorRef.current.contains(event.target as Node)) {
        setShowProductSelector(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Load products for recommendation
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const results = await searchProducts(productSearch)
        setProducts(results.slice(0, 6)) // Show top 6 products
      } catch (error) {
        console.error("Error loading products:", error)
      }
    }

    if (showProductSelector) {
      loadProducts()
    }
  }, [showProductSelector, productSearch])

  const playNotificationSound = () => {
    // Create a notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)

    // Second beep
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator()
      const gainNode2 = audioContext.createGain()

      oscillator2.connect(gainNode2)
      gainNode2.connect(audioContext.destination)

      oscillator2.frequency.value = 1000
      oscillator2.type = 'sine'

      gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator2.start(audioContext.currentTime)
      oscillator2.stop(audioContext.currentTime + 0.3)
    }, 200)
  }

  const loadConversations = async () => {
    try {
      const data = await getMessages(1, 100)
      const grouped: any = data.messages.reduce((acc: any, msg: any) => {
        const key = msg.customer_id
        if (!acc[key]) {
          acc[key] = {
            customer_id: msg.customer_id,
            customer: msg.customer,
            order_id: msg.order_id,
            lastMessage: msg.message,
            lastMessageTime: msg.created_at,
            unreadCount: 0,
            messages: []
          }
        }
        acc[key].messages.push(msg)
        if (!msg.is_read && msg.sender_type === 'customer') {
          acc[key].unreadCount++
        }
        if (new Date(msg.created_at) > new Date(acc[key].lastMessageTime)) {
          acc[key].lastMessage = msg.message
          acc[key].lastMessageTime = msg.created_at
        }
        return acc
      }, {})

      const convArray = Object.values(grouped).sort((a: any, b: any) =>
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      )

      setConversations(convArray)

      if (selectedConversation) {
        const updated: any = convArray.find((c: any) => c.customer_id === selectedConversation.customer_id)
        if (updated && updated.messages) {
          setMessages(updated.messages.sort((a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          ))
        }
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadConversation = async (customerId: string, orderId?: string) => {
    try {
      const data = await getConversation(customerId, orderId)
      setMessages(data)
      const conv = conversations.find(c => c.customer_id === customerId)
      setSelectedConversation(conv)

      const unreadIds = data.filter((m: any) => !m.is_read && m.sender_type === 'customer').map((m: any) => m.id)
      if (unreadIds.length > 0) {
        await markMessagesAsRead(unreadIds)
        loadConversations()
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return
    setSending(true)
    try {
      await sendAdminMessage(selectedConversation.customer_id, selectedConversation.order_id, newMessage)
      setNewMessage("")
      await loadConversation(selectedConversation.customer_id, selectedConversation.order_id)
      await loadConversations()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
    textareaRef.current?.focus()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedConversation) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از 5 مگابایت باشد')
      return
    }

    setUploading(true)
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `message-images/${fileName}`

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath)

      // Send message with image URL
      await sendAdminMessage(
        selectedConversation.customer_id,
        selectedConversation.order_id,
        `IMAGE:${publicUrl}`
      )

      await loadConversation(selectedConversation.customer_id, selectedConversation.order_id)
      await loadConversations()
    } catch (error) {
      console.error("Error uploading image:", error)
      alert('خطا در آپلود تصویر')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleProductRecommend = async (product: any) => {
    if (!selectedConversation || sending) return
    setSending(true)
    try {
      const productCard = {
        name: product.name,
        name_local: product.name_local,
        price: product.price,
        image: product.image_url
      }
      
      await sendAdminMessage(
        selectedConversation.customer_id,
        selectedConversation.order_id,
        `PRODUCT_CARD:${JSON.stringify(productCard)}`
      )
      
      setShowProductSelector(false)
      await loadConversation(selectedConversation.customer_id, selectedConversation.order_id)
      await loadConversations()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch =
      conv.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.customer?.phone?.includes(searchTerm)

    if (activeFilter === "unread") {
      return matchesSearch && conv.unreadCount > 0
    }

    return matchesSearch
  })

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  const renderMessage = (msg: any) => {
    if (msg.message.startsWith('IMAGE:')) {
      const imageUrl = msg.message.replace('IMAGE:', '')
      return (
        <div className="rounded-lg overflow-hidden max-w-sm">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png'
            }}
          />
        </div>
      )
    }
    
    if (msg.message.startsWith('PRODUCT_CARD:')) {
      try {
        const productData = JSON.parse(msg.message.replace('PRODUCT_CARD:', ''))
        return (
          <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm max-w-sm">
            <div className="flex gap-3">
              {productData.image && (
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                  <img
                    src={productData.image}
                    alt={productData.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <Package className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="font-bold text-gray-900 text-sm">{productData.name}</p>
                </div>
                {productData.name_local && (
                  <p className="text-xs text-gray-600 mb-2">{productData.name_local}</p>
                )}
                <p className="text-primary font-bold text-base">{productData.price?.toLocaleString?.()} افغانی</p>
              </div>
            </div>
          </div>
        )
      } catch (error) {
        return <p className="text-sm">{msg.message}</p>
      }
    }
    return <p className="text-sm leading-relaxed">{msg.message}</p>
  }

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {}

    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }

  const getDisplayDate = (dateString: string) => {
    if (isToday(dateString)) {
      return "امروز"
    } else if (isYesterday(dateString)) {
      return "دیروز"
    } else {
      return formatDate(dateString)
    }
  }

  const groupedMessages = groupMessagesByDate(messages)

  return (
    <AdminLayout>
      <div className="h-screen flex flex-col">

        {/* Main Chat Container */}
        <div className="flex-1 flex bg-gray-50/50">
          {/* Conversations Sidebar */}
          <div className="w-96 bg-white border-l border-gray-100 flex flex-col shadow-sm">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100 w-96">
              <div className="relative mb-4">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در گفتگوها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${activeFilter === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  همه گفتگوها
                </button>
                <button
                  onClick={() => setActiveFilter("unread")}
                  className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all relative ${activeFilter === "unread"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-600 hover:text-red-600"
                    }`}
                >
                  خوانده نشده
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </button>
              </div>
              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col gap-3 p-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="font-medium text-gray-400 text-sm">گفتگویی یافت نشد</p>
                    <p className="text-xs text-gray-400 mt-1 text-center">هیچ گفتگویی مطابق جستجوی شما نیست</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.customer_id}
                        onClick={() => loadConversation(conv.customer_id, conv.order_id)}
                        className={`w-full p-3 rounded-xl text-right transition-all duration-200 mb-1 ${selectedConversation?.customer_id === conv.customer_id
                            ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 shadow-sm'
                            : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${selectedConversation?.customer_id === conv.customer_id
                                ? 'bg-gradient-to-br from-primary to-accent'
                                : 'bg-gradient-to-br from-gray-100 to-gray-200'
                              }`}>
                              <span className={`font-bold text-sm ${selectedConversation?.customer_id === conv.customer_id ? 'text-white' : 'text-gray-600'
                                }`}>
                                {conv.customer?.name?.charAt(0)?.toUpperCase() || 'م'}
                              </span>
                            </div>
                            {conv.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 text-right">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {conv.customer?.name || 'مشتری'}
                              </p>
                              <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
                                <Clock className="w-3 h-3" />
                                {formatTime(conv.lastMessageTime)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 truncate leading-relaxed">
                              {conv.lastMessage?.startsWith('PRODUCT_CARD:') ? (
                                <span className="flex items-center gap-1 text-primary font-medium">
                                  <Package className="w-3 h-3" />
                                  محصول
                                </span>
                              ) : (
                                conv.lastMessage
                              )}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>


          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white shadow-inner relative">
            {selectedConversation ? (
              <>


                {/* Messages Area with padding for input */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-6 pb-32" // Added pb-32 for input space
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <MessageCircle className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="font-medium text-gray-400 mb-1">هنوز پیامی وجود ندارد</p>
                      <p className="text-sm text-gray-400">شروع کننده اولین گفتگو باشید</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                        <div key={date}>
                          {/* Date Separator */}
                          <div className="flex items-center justify-center my-8">
                            <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                              <span className="text-xs font-medium text-gray-500">
                                {getDisplayDate(date)}
                              </span>
                            </div>
                          </div>

                          {/* Messages */}
                          {dateMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'} mb-3`}>
                              <div className={`max-w-md px-4 py-3 rounded-2xl transition-all ${msg.sender_type === 'admin'
                                  ? 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                                  : 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                                }`}>
                                {renderMessage(msg)}
                                <div className={`flex items-center justify-end gap-2 mt-2 text-xs ${msg.sender_type === 'admin' ? 'text-gray-500' : 'text-white/90'
                                  }`}>
                                  <span>{formatTime(msg.created_at)}</span>
                                  {msg.sender_type === 'customer' && (
                                    msg.is_read ?
                                      <CheckCheck className="w-3 h-3" /> :
                                      <Check className="w-3 h-3" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input - Absolute positioned at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 shadow-lg">
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-24 right-6 bg-white rounded-xl shadow-2xl border border-gray-200 w-96 z-50">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700">انتخاب ایموجی</h3>
                        <button onClick={() => setShowEmojiPicker(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Category Tabs */}
                      <div className="flex gap-1 p-2 border-b border-gray-200 overflow-x-auto">
                        {Object.keys(emojiCategories).map((category) => (
                          <button
                            key={category}
                            onClick={() => setActiveEmojiCategory(category)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                              activeEmojiCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                      
                      {/* Emoji Grid */}
                      <div className="p-3 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-1">
                          {emojiCategories[activeEmojiCategory]?.map((emoji: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => handleEmojiSelect(emoji)}
                              className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-colors"
                              title={emoji}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Product Selector */}
                  {showProductSelector && (
                    <div ref={productSelectorRef} className="absolute bottom-24 right-6 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-96 z-50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">توصیه محصول</h3>
                        <button onClick={() => setShowProductSelector(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="جستجوی محصول..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {products.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">محصولی یافت نشد</p>
                        ) : (
                          products.map((product: any) => (
                            <button
                              key={product.id}
                              onClick={() => handleProductRecommend(product)}
                              className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-right"
                            >
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                <p className="text-xs text-gray-600 truncate">{product.name_local}</p>
                                <p className="text-xs text-primary font-bold">{product.price?.toLocaleString?.()} افغانی</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 items-end">
                    <div className="flex gap-1">
                      {/* Sound Toggle */}
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-2.5 rounded-xl transition-colors ${soundEnabled ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-500'}`}
                        title={soundEnabled ? 'صدا فعال' : 'صدا غیرفعال'}
                      >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </button>
                      
                      {/* Image Upload */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                        title="آپلود تصویر"
                      >
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Image className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      {/* Emoji Picker */}
                      <button
                        onClick={() => {
                          setShowEmojiPicker(!showEmojiPicker)
                          setShowProductSelector(false)
                        }}
                        className={`p-2.5 rounded-xl transition-colors ${showEmojiPicker ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-500'}`}
                        title="ایموجی"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      
                      {/* Product Selector */}
                      <button
                        onClick={() => {
                          setShowProductSelector(!showProductSelector)
                          setShowEmojiPicker(false)
                        }}
                        className={`p-2.5 rounded-xl transition-colors ${showProductSelector ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-500'}`}
                        title="توصیه محصول"
                      >
                        <Package className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1 relative">
                      <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="پیام خود را بنویسید..."
                        disabled={sending}
                        rows={1}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="p-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none shadow-sm"
                    >
                      {sending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-12 h-12 text-primary/60" />
                  </div>
                  <p className="text-xl font-bold text-gray-700 mb-2">یک گفتگو را انتخاب کنید</p>
                  <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                    برای شروع چت و مشاهده تاریخچه گفتگو، یک مشتری را از لیست سمت راست انتخاب کنید
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}