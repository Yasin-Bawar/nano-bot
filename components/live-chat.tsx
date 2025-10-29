"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send } from "lucide-react"

interface LiveChatProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    title: "ژوندی چیټ",
    subtitle: "موږ آنلاین یو",
    placeholder: "خپل پیغام دلته ولیکئ...",
    send: "واستوئ",
    welcomeMessage: "سلام! موږ څنګه مرسته کولای شو؟",
  },
  dari: {
    title: "چت زنده",
    subtitle: "ما آنلاین هستیم",
    placeholder: "پیام خود را اینجا بنویسید...",
    send: "ارسال",
    welcomeMessage: "سلام! چطور می‌توانیم کمک کنیم؟",
  },
}

export function LiveChat({ language, onOpenRef }: LiveChatProps & { onOpenRef?: (fn: () => void) => void }) {
  const t = translations[language]
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Only register the callback if provided
    if (onOpenRef) {
      onOpenRef(() => {
        setIsOpen(true)
      })
    }
  }, [onOpenRef])
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { text: t.welcomeMessage, sender: "bot", time: "الآن" },
  ])

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user", time: "الآن" }])
      setMessage("")
      
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: language === "pashto" 
              ? "مننه! زموږ ټیم به ډیر ژر تاسو سره اړیکه ونیسي."
              : "متشکرم! تیم ما به زودی با شما تماس خواهد گرفت.",
            sender: "bot",
            time: "الآن",
          },
        ])
      }, 1000)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl flex items-center justify-center"
        animate={{
          boxShadow: [
            "0 10px 30px rgba(82, 183, 136, 0.3)",
            "0 10px 40px rgba(82, 183, 136, 0.5)",
            "0 10px 30px rgba(82, 183, 136, 0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">{t.title}</h3>
                  <p className="text-xs opacity-90">{t.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white text-black rounded-bl-none shadow-md"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user" ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t.placeholder}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary transition-colors"
                />
                <motion.button
                  onClick={handleSend}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
