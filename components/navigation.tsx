"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserStatus } from "@/components/user-status"

// Mobile messaging link component
function MobileMessagingLink({ language, onClose }: { language: "pashto" | "dari", onClose: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function checkLogin() {
      try {
        const { isUserLoggedIn } = await import("@/lib/cookies")
        setIsLoggedIn(isUserLoggedIn())
      } catch (error) {
        console.error("Error checking login:", error)
      }
    }
    checkLogin()
  }, [])

  if (!isLoggedIn) return null

  const text = language === "dari" ? "پیام‌ها" : "پیغامونه"

  return (
    <Link href="/messaging">
      <motion.button
        onClick={onClose}
        className="block w-full text-right py-3 text-primary hover:text-primary/80 transition-colors font-semibold flex items-center justify-end gap-2"
      >
        <span>{text}</span>
        <MessageCircle className="w-4 h-4" />
      </motion.button>
    </Link>
  )
}

interface NavigationProps {
  language: "pashto" | "dari"
  setLanguage: (lang: "pashto" | "dari") => void
  onOpenChat?: () => void
}

const translations = {
  pashto: {
    home: "کور",
    products: "محصولات",
    models: "ماډلونه",
    technology: "ټکنالوژي",
    sustainability: "پایښت",
    contact: "اړیکه",
    address: "پته",
    preOrder: "مخکینۍ امر",
  },
  dari: {
    home: "خانه",
    products: "محصولات",
    models: "مدل‌ها",
    technology: "تکنولوژی",
    sustainability: "پایداری",
    contact: "تماس",
    address: "آدرس",
    preOrder: "پیش‌سفارش",
  },
}

export function Navigation({ language, setLanguage, onOpenChat }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()
  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Check if scrolled past threshold
      setScrolled(currentScrollY > 50)

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  const isHomePage = pathname === "/"

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHomePage
        ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border"
        : "bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-lg"
        }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Desktop Navigation - on left side for RTL */}
          <div className="hidden lg:flex items-center gap-6">
            <UserStatus language={language} />
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  if (onOpenChat) {
                    onOpenChat()
                  }
                }}
                className="bg-primary text-white hover:bg-primary/90 font-semibold px-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                {t.contact}
              </Button>
            </motion.div>

            <Link href="/">
              <motion.button
                className={`text-sm font-semibold transition-colors ${pathname === "/"
                  ? "text-primary"
                  : scrolled || !isHomePage
                    ? "text-foreground hover:text-primary"
                    : "text-white/80 hover:text-white"
                  }`}
                whileHover={{ y: -2 }}
              >
                {t.home}
              </motion.button>
            </Link>

            <Link href="/products">
              <motion.button
                className={`text-sm font-semibold transition-colors ${pathname === "/products" || pathname?.startsWith("/products/")
                  ? "text-primary"
                  : scrolled || !isHomePage
                    ? "text-foreground hover:text-primary"
                    : "text-white/80 hover:text-white"
                  }`}
                whileHover={{ y: -2 }}
              >
                {t.products}
              </motion.button>
            </Link>



            <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
              <button
                onClick={() => setLanguage("dari")}
                className={`px-4 py-2 text-sm font-semibold transition-all rounded-full ${language === "dari"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                دری
              </button>
              <button
                onClick={() => setLanguage("pashto")}
                className={`px-4 py-2 text-sm font-semibold transition-all rounded-full ${language === "pashto"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                پښتو
              </button>
            </div>
          </div>

          {/* Logo - on right side for RTL */}
          <Link href="/">
            <motion.div
              className="text-2xl font-bold tracking-tight cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-primary">NANO</span>
              <span className={scrolled || !isHomePage ? "text-foreground" : "text-white"}> BOT</span>
            </motion.div>
          </Link>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 ${scrolled || !isHomePage ? "text-foreground" : "text-white"}`}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-6 space-y-4 border-t border-border">
                <Link href="/">
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-right py-3 text-foreground hover:text-primary transition-colors font-semibold"
                  >
                    {t.home}
                  </motion.button>
                </Link>

                <Link href="/products">
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-right py-3 text-foreground hover:text-primary transition-colors font-semibold"
                  >
                    {t.products}
                  </motion.button>
                </Link>

                {/* Show messaging link in mobile menu if user is logged in */}
                <MobileMessagingLink language={language} onClose={() => setIsOpen(false)} />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setLanguage("dari")}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${language === "dari"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    دری
                  </button>
                  <button
                    onClick={() => setLanguage("pashto")}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${language === "pashto"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    پښتو
                  </button>
                </div>

                <Link href="/products">
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-right py-3 text-foreground hover:text-primary transition-colors font-semibold"
                  >
                    {t.address}
                  </motion.button>
                </Link>

                <Button
                  onClick={() => {
                    if (onOpenChat) {
                      onOpenChat()
                    }
                    setIsOpen(false)
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-accent font-semibold rounded-full shadow-lg"
                >
                  {t.contact}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
