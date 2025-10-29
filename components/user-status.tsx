"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserStatusProps {
  language: "pashto" | "dari"
}

export function UserStatus({ language }: UserStatusProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const router = useRouter()

  const translations = {
    pashto: {
      loggedInAs: "د دې په نوم ننوتل:",
      logout: "وتل",
      login: "ننوتل",
    },
    dari: {
      loggedInAs: "وارد شده به نام:",
      logout: "خروج",
      login: "ورود",
    },
  }

  const t = translations[language]

  useEffect(() => {
    async function checkUserStatus() {
      try {
        const { getUserSession } = await import("@/lib/cookies")
        const session = getUserSession()
        
        if (session) {
          setIsLoggedIn(true)
          setCustomerName(session.customerName)
        } else {
          setIsLoggedIn(false)
          setCustomerName("")
        }
      } catch (error) {
        console.error("Error checking user status:", error)
      }
    }

    checkUserStatus()
    
    // Check every 5 seconds for changes
    const interval = setInterval(checkUserStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    if (confirm(language === "dari" ? "آیا می‌خواهید از حساب خود خارج شوید؟" : "ایا تاسو غواړئ چې خپل حساب څخه وځئ؟")) {
      const { clearUserSession } = await import("@/lib/cookies")
      clearUserSession()
      setIsLoggedIn(false)
      setCustomerName("")
      router.push("/")
    }
  }

  const handleLogin = () => {
    router.push("/checkout?product=1&name=Sport+SR/F")
  }

  const handleGoToMessaging = () => {
    router.push("/messaging")
  }

  // Only show messaging icon when logged in, nothing when not logged in
  if (isLoggedIn) {
    return (
      <button
        onClick={handleGoToMessaging}
        className="relative p-2 text-primary hover:text-primary/80 transition-colors hover:bg-primary/10 rounded-full"
        title={language === "dari" ? "پیام‌ها" : "پیغامونه"}
      >
        <MessageCircle className="w-6 h-6" />
        {/* Optional: Add notification dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </button>
    )
  }

  // Return nothing when not logged in
  return null
}