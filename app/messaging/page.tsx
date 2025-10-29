"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, ArrowLeft, Phone, MapPin, User, Package, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { sendMessage, getOrderMessages, subscribeToMessages, unsubscribeFromMessages } from "@/lib/api/messages"
import { Message } from "@/lib/supabase"

// Product Card Component for messages
function ProductCard({ product, language }: { product: any, language: "pashto" | "dari" }) {
  const translations = {
    pashto: {
      viewProduct: "محصول وګورئ",
    },
    dari: {
      viewProduct: "مشاهده محصول",
    },
  }

  const t = translations[language]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-3 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
    >
      <div className="flex gap-3 p-3">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg flex-shrink-0 border border-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-1">{product.name_local}</p>
          <p className="text-primary font-bold text-lg sm:text-xl mb-2">${product.price.toLocaleString()}</p>
          <Link href="/products">
            <button className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t.viewProduct}
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// Quick Product Selection Component
function ProductQuickSelect({ language, onProductSelect, showProducts, setShowProducts }: {
  language: "pashto" | "dari"
  onProductSelect: (product: any) => void
  showProducts: boolean
  setShowProducts: (show: boolean) => void
}) {
  const products = [
    { id: 1, name: "Sport SR/F", name_local: "اسپرت SR/F", price: 19995, image: "/images/bike-blue-sport.png" },
    { id: 2, name: "Urban Cruiser", name_local: "کروزر شهری", price: 17995, image: "/images/bike-blue-front.png" },
    { id: 3, name: "White Sport", name_local: "اسپرت سفید", price: 10995, image: "/images/bike-white-sport.png" },
    { id: 4, name: "Silver Edition", name_local: "نسخه نقره‌ای", price: 11995, image: "/images/bike-blue-silver.png" },
    { id: 5, name: "White Rounded", name_local: "سفید گرد", price: 12995, image: "/images/bike-white-rounded.png" },
  ]

  const translations = {
    pashto: {
      selectProduct: "محصول غوره کړئ",
      interestedIn: "زه پدې علاقه لرم:",
    },
    dari: {
      selectProduct: "انتخاب محصول",
      interestedIn: "من به این علاقه‌مندم:",
    },
  }

  const t = translations[language]

  // Only show the expanded product grid, positioned above input
  if (!showProducts) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-20 left-0 right-0 px-4 z-10"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">{t.interestedIn}</h3>
            <button
              onClick={() => setShowProducts(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products.map((product) => (
              <motion.button
                key={product.id}
                onClick={() => {
                  onProductSelect(product)
                  setShowProducts(false)
                }}
                className="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-16 object-contain mb-2"
                />
                <div className="text-xs font-medium text-gray-900">{product.name}</div>
                <div className="text-xs text-gray-600">{product.name_local}</div>
                <div className="text-xs font-bold text-primary">${product.price.toLocaleString()}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function MessagingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState<"pashto" | "dari">("dari")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  // Get IDs from URL or cookies (persistent)
  const [orderId, setOrderId] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [productName, setProductName] = useState("محصول")
  const [customerName, setCustomerName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProductSelection, setShowProductSelection] = useState(false)

  useEffect(() => {
    async function loadUserSession() {
      const { getUserSession } = await import("@/lib/cookies")

      // Try to get from URL first
      const orderFromUrl = searchParams.get("order")
      const customerFromUrl = searchParams.get("customer")
      const productFromUrl = searchParams.get("name")

      // If not in URL, try cookies
      const session = getUserSession()

      setOrderId(orderFromUrl || session?.orderId || "")
      setCustomerId(customerFromUrl || session?.customerId || "")
      setProductName(productFromUrl || session?.productName || "محصول")
      setCustomerName(session?.customerName || "")
      setIsLoggedIn(!!session)
    }

    loadUserSession()
  }, [searchParams])

  const translations = {
    pashto: {
      title: "د پیرود چیټ",
      subtitle: "زموږ ټیم سره خبرې وکړئ",
      placeholder: "خپل پیغام دلته ولیکئ...",
      send: "واستوئ",
      admin: "اډمین",
      you: "تاسو",
      initialMessage: "سلام! زه غواړم دا محصول واخلم:",
      adminResponse: "سلام! مننه چې زموږ سره اړیکه ونیولئ. موږ به ډیر ژر تاسو سره اړیکه ونیسو.",
      viewProduct: "محصول وګورئ",
    },
    dari: {
      title: "چت خرید",
      subtitle: "با تیم ما صحبت کنید",
      placeholder: "پیام خود را اینجا بنویسید...",
      send: "ارسال",
      admin: "ادمین",
      you: "شما",
      initialMessage: "سلام! می‌خواهم این محصول را خریداری کنم:",
      adminResponse: "سلام! از تماس شما متشکریم. به زودی با شما تماس خواهیم گرفت.",
      viewProduct: "مشاهده محصول",
    },
  }

  const t = translations[language]

  // Product data (in real app, fetch from API)
  const productData = {
    name: productName,
    price: "$19,995",
    image: "/images/bike-blue-sport.png",
  }

  useEffect(() => {
    // Load messages from database
    async function loadMessages() {
      if (!orderId || !customerId) {
        // If no order/customer ID, show simple chat without database
        setLoading(false)
        // Add initial messages locally
        const initialMsgs: any[] = [
          {
            id: "1",
            customer_id: "temp",
            order_id: "temp",
            sender_type: "customer",
            message: `${t.initialMessage} ${productName}`,
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            customer_id: "temp",
            order_id: "temp",
            sender_type: "admin",
            message: t.adminResponse,
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]
        setMessages(initialMsgs)
        return
      }

      setLoading(true)
      try {
        const data = await getOrderMessages(orderId)

        if (data.length === 0) {
          // Send initial message if no messages exist
          const msg1 = await sendMessage({
            customer_id: customerId,
            order_id: orderId,
            sender_type: "customer",
            message: `${t.initialMessage} ${productName}`,
          })

          // Auto-reply from admin after 1 second
          setTimeout(async () => {
            const msg2 = await sendMessage({
              customer_id: customerId,
              order_id: orderId,
              sender_type: "admin",
              message: t.adminResponse,
            })
            // Reload messages
            const updatedData = await getOrderMessages(orderId)
            setMessages(updatedData)
          }, 1000)

          setMessages([msg1])
        } else {
          setMessages(data)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
        // Fallback to local messages
        const fallbackMsgs: any[] = [
          {
            id: "1",
            customer_id: customerId,
            order_id: orderId,
            sender_type: "customer",
            message: `${t.initialMessage} ${productName}`,
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            customer_id: customerId,
            order_id: orderId,
            sender_type: "admin",
            message: t.adminResponse,
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]
        setMessages(fallbackMsgs)
      }

      setLoading(false)
    }

    loadMessages()
  }, [orderId, customerId, productName, router, t.initialMessage, t.adminResponse])

  // Subscribe to real-time messages
  useEffect(() => {
    if (!orderId) {
      console.log('⚠️ No orderId, skipping real-time subscription')
      return
    }

    console.log('🔌 Setting up real-time subscription for order:', orderId)

    try {
      const subscription = subscribeToMessages(orderId, (newMessage) => {
        console.log('📨 New message received via real-time:', newMessage)
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some(m => m.id === newMessage.id)) {
            return prev
          }
          return [...prev, newMessage]
        })
      })

      console.log('✅ Real-time subscription created')

      return () => {
        console.log('🔌 Cleaning up real-time subscription')
        unsubscribeFromMessages(subscription)
      }
    } catch (error) {
      console.error("❌ Error subscribing to messages:", error)
    }
  }, [orderId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (message.trim()) {
      const messageText = message.trim()
      setMessage("")

      if (customerId && orderId) {
        // Send to database
        try {
          const newMsg = await sendMessage({
            customer_id: customerId,
            order_id: orderId,
            sender_type: "customer",
            message: messageText,
          })
          // Add to local state if not using real-time
          setMessages((prev) => [...prev, newMsg])
        } catch (error) {
          console.error("Error sending message:", error)
          // Add locally even if database fails
          const localMsg: any = {
            id: Date.now().toString(),
            customer_id: customerId,
            order_id: orderId,
            sender_type: "customer",
            message: messageText,
            is_read: false,
            created_at: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, localMsg])
        }
      } else {
        // No database, just add locally
        const localMsg: any = {
          id: Date.now().toString(),
          customer_id: "temp",
          order_id: "temp",
          sender_type: "customer",
          message: messageText,
          is_read: false,
          created_at: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, localMsg])

        // Simulate admin response
        setTimeout(() => {
          const adminMsg: any = {
            id: (Date.now() + 1).toString(),
            customer_id: "temp",
            order_id: "temp",
            sender_type: "admin",
            message: language === "dari" ? "پیام شما دریافت شد. متشکریم!" : "ستاسو پیغام ترلاسه شو. مننه!",
            is_read: false,
            created_at: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, adminMsg])
        }, 1500)
      }
    }
  }

  const handleProductSelect = async (product: any) => {
    const productMessage = language === "dari"
      ? `می‌خواهم این محصول را خریداری کنم: ${product.name}`
      : `زه غواړم دا محصول واخلم: ${product.name}`

    if (customerId && orderId) {
      try {
        // Send the text message first
        const textMsg = await sendMessage({
          customer_id: customerId,
          order_id: orderId,
          sender_type: "customer",
          message: productMessage,
        })

        // Send the product card message to database
        const cardMsg = await sendMessage({
          customer_id: customerId,
          order_id: orderId,
          sender_type: "customer",
          message: `PRODUCT_CARD:${JSON.stringify(product)}`,
        })

        // Add both to local state (they should also come through real-time)
        setMessages((prev) => [...prev, textMsg, cardMsg])

      } catch (error) {
        console.error("Error sending product message:", error)
        // Fallback to local messages if database fails
        const localTextMsg: any = {
          id: Date.now().toString(),
          customer_id: customerId,
          order_id: orderId,
          sender_type: "customer",
          message: productMessage,
          is_read: false,
          created_at: new Date().toISOString(),
        }

        const localCardMsg: any = {
          id: (Date.now() + 1).toString(),
          customer_id: customerId,
          order_id: orderId,
          sender_type: "customer",
          message: `PRODUCT_CARD:${JSON.stringify(product)}`,
          is_read: false,
          created_at: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, localTextMsg, localCardMsg])
      }
    } else {
      // Local fallback when no database connection
      const localTextMsg: any = {
        id: Date.now().toString(),
        customer_id: "temp",
        order_id: "temp",
        sender_type: "customer",
        message: productMessage,
        is_read: false,
        created_at: new Date().toISOString(),
      }

      const localCardMsg: any = {
        id: (Date.now() + 1).toString(),
        customer_id: "temp",
        order_id: "temp",
        sender_type: "customer",
        message: `PRODUCT_CARD:${JSON.stringify(product)}`,
        is_read: false,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, localTextMsg, localCardMsg])

      // Simulate admin response
      setTimeout(() => {
        const adminMsg: any = {
          id: (Date.now() + 2).toString(),
          customer_id: "temp",
          order_id: "temp",
          sender_type: "admin",
          message: language === "dari" ? "محصول جالبی انتخاب کردید! چه سوالی دارید؟" : "ښه محصول یې غوره کړ! کومه پوښتنه لرئ؟",
          is_read: false,
          created_at: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, adminMsg])
      }, 1500)
    }
  }

  return (
    <div className={`${language === "pashto" || language === "dari" ? "rtl" : "ltr"} h-screen flex flex-col bg-gray-50 relative`}>
      {/* Fixed Header at Top */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-accent shadow-md z-20">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">{t.title}</h1>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span>آنلاین</span>
                {customerName && (
                  <>
                    <span>•</span>
                    <span>{customerName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Logout Button */}
          {isLoggedIn && (
            <button
              onClick={async () => {
                if (confirm(language === "dari" ? "آیا می‌خواهید از حساب خود خارج شوید؟" : "ایا تاسو غواړئ چې خپل حساب څخه وځئ؟")) {
                  const { clearUserSession } = await import("@/lib/cookies")
                  clearUserSession()
                  router.push("/")
                }
              }}
              className="text-xs text-white/80 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
            >
              {language === "dari" ? "خروج" : "وتل"}
            </button>
          )}
        </div>
      </div>

      {/* Messages Area - Full Screen with padding for header and input */}
      <div className="flex-1 overflow-y-auto px-4 bg-gray-50" style={{ paddingTop: "70px", paddingBottom: "85px" }}>
        <div className="space-y-4 max-w-4xl mx-auto pt-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender_type === "customer" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] sm:max-w-[70%]`}>
                  {/* Sender Name & Time */}
                  <div className={`flex items-center gap-2 mb-1.5 px-1 ${msg.sender_type === "customer" ? "justify-end" : "justify-start"}`}>
                    <span className="text-xs font-bold text-gray-600">
                      {msg.sender_type === "customer" ? t.you : t.admin}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 shadow-md ${msg.sender_type === "customer"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                      }`}
                  >
                    {/* Regular message, image, or product card */}
                    {msg.message.startsWith('IMAGE:') ? (
                      <div className="rounded-lg overflow-hidden max-w-sm">
                        <img
                          src={msg.message.replace('IMAGE:', '')}
                          alt="Uploaded"
                          className="w-full h-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png'
                          }}
                        />
                      </div>
                    ) : msg.message.startsWith('PRODUCT_CARD:') ? (
                      <ProductCard
                        product={JSON.parse(msg.message.replace('PRODUCT_CARD:', ''))}
                        language={language}
                      />
                    ) : (
                      <p className="text-sm sm:text-base leading-relaxed">{msg.message}</p>
                    )}

                    {/* Product Card for initial message */}
                    {index === 0 && msg.message.includes(productName) && !msg.message.startsWith('PRODUCT_CARD:') && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
                      >
                        <div className="flex gap-3 p-3">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg flex-shrink-0 border border-gray-100">
                            <img
                              src={productData.image}
                              alt={productData.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 truncate">{productData.name}</h3>
                            <p className="text-primary font-bold text-lg sm:text-xl mb-2">{productData.price}</p>
                            <Link href="/products">
                              <button className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
                                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                {t.viewProduct}
                              </button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Product Selection - Show above input when expanded */}
      <ProductQuickSelect
        language={language}
        onProductSelect={handleProductSelect}
        showProducts={showProductSelection}
        setShowProducts={setShowProductSelection}
      />

      {/* Input Area - Absolute Position at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white shadow-lg z-20">
        <div className="flex flex-row-reverse gap-2 max-w-4xl mx-auto">
          <motion.button
            onClick={handleSend}
            whileHover={{ scale: message.trim() ? 1.05 : 1 }}
            whileTap={{ scale: message.trim() ? 0.95 : 1 }}
            disabled={!message.trim()}
            className={`px-4 sm:px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all min-w-[44px] ${message.trim()
              ? "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">{t.send}</span>
          </motion.button>

          {/* Product Selection Button */}
          <motion.button
            onClick={() => setShowProductSelection(!showProductSelection)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-3 rounded-full font-medium flex items-center justify-center transition-all min-w-[44px] ${showProductSelection
              ? "bg-primary text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            title={language === "dari" ? "انتخاب محصول" : "محصول غوره کړئ"}
          >
            <Package className="w-5 h-5" />
          </motion.button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t.placeholder}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-gray-50 text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  )
}
