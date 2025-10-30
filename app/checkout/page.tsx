"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, User, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState<"pashto" | "dari">("dari")
  const [openChat, setOpenChat] = useState<(() => void) | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+93",
    phone: "",
    location: "",
  })
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Prevent auto-opening by ensuring openChat is only set once
  const handleSetOpenChat = (fn: () => void) => {
    if (!openChat) {
      setOpenChat(() => fn)
    }
  }

  const productId = searchParams.get("product")
  const productName = searchParams.get("name") || "محصول"

  // Check if user is already logged in and redirect
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const { isUserLoggedIn } = await import("@/lib/cookies")
        if (isUserLoggedIn()) {
          // User is already logged in, redirect to messaging
          router.push("/messaging")
        }
      } catch (error) {
        console.error("Error checking session:", error)
      }
    }
    checkExistingSession()
  }, [router])

  const translations = {
    pashto: {
      title: "د پیرود معلومات",
      subtitle: "مهرباني وکړئ خپل معلومات ولیکئ",
      name: "نوم",
      namePlaceholder: "خپل بشپړ نوم ولیکئ",
      phone: "د تلیفون شمیره",
      phonePlaceholder: "7XX XXX XXX",
      location: "موقعیت",
      locationPlaceholder: "خپل پته ولیکئ",
      detectLocation: "زما موقعیت ومومئ",
      detecting: "موندل کیږي...",
      continue: "دوام ورکړئ",
      product: "محصول",
      required: "دا ډګر اړین دی",
      invalidPhone: "د تلیفون شمیره سمه نده",
    },
    dari: {
      title: "اطلاعات خرید",
      subtitle: "لطفاً اطلاعات خود را وارد کنید",
      name: "نام",
      namePlaceholder: "نام کامل خود را وارد کنید",
      phone: "شماره تلفن",
      phonePlaceholder: "7XX XXX XXX",
      location: "موقعیت",
      locationPlaceholder: "آدرس خود را وارد کنید",
      detectLocation: "تشخیص موقعیت من",
      detecting: "در حال تشخیص...",
      continue: "ادامه",
      product: "محصول",
      required: "این فیلد الزامی است",
      invalidPhone: "شماره تلفن معتبر نیست",
    },
  }

  const t = translations[language]

  const detectLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // Use reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            setFormData((prev) => ({
              ...prev,
              location: data.display_name || `${latitude}, ${longitude}`,
            }))
          } catch (error) {
            setFormData((prev) => ({
              ...prev,
              location: `${latitude}, ${longitude}`,
            }))
          }
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
          alert(language === "dari" ? "خطا در دریافت موقعیت" : "د موقعیت په موندلو کې تېروتنه")
        }
      )
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = t.required
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.required
    } else if (formData.countryCode === "+93" && !/^[7][0-9]{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = t.invalidPhone
    } else if (formData.phone.length < 7) {
      newErrors.phone = t.invalidPhone
    }

    if (!formData.location.trim()) {
      newErrors.location = t.required
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      console.log("Starting checkout process...")
      
      try {
        // Import the API functions
        const { createCustomer, createOrder } = await import("@/lib/api/orders")
        
        console.log("Creating customer with data:", {
          name: formData.name,
          phone: formData.phone,
          country_code: formData.countryCode,
          location: formData.location,
        })
        
        // First, create the customer
        const customer = await createCustomer({
          name: formData.name,
          phone: formData.phone,
          country_code: formData.countryCode,
          location: formData.location,
        })
        
        console.log("Customer created:", customer)
        
        // Then create the order (product_id can be null if not a valid UUID)
        console.log("Creating order...")
        const order = await createOrder({
          customer_id: customer.id,
          product_id: null, // Set to null for now, or fetch real product UUID
          product_name: productName,
          quantity: 1,
          total_price: 19995,
        })
        
        console.log("Order created:", order)
        
        // Store user session in cookies (persists across browser sessions)
        const { saveUserSession } = await import("@/lib/cookies")
        saveUserSession({
          customerId: customer.id,
          orderId: order.id,
          customerName: formData.name,
          customerPhone: `${formData.countryCode} ${formData.phone}`,
          productName: productName
        })
        
        // Redirect to messaging page
        router.push(`/messaging?order=${order.id}&customer=${customer.id}&name=${encodeURIComponent(productName)}`)
      } catch (error: any) {
        console.error("Error creating order:", error)
        console.error("Error details:", error.message, error.details)
        
        // Show detailed error message
        const errorMsg = error.message || "Unknown error"
        alert(
          language === "dari" 
            ? `خطا در ثبت سفارش: ${errorMsg}\nلطفاً دوباره تلاش کنید.` 
            : `د امر په ثبتولو کې تېروتنه: ${errorMsg}\nمهرباني وکړئ بیا هڅه وکړئ.`
        )
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className={language === "pashto" || language === "dari" ? "rtl" : "ltr"}>
      <Navigation language={language} setLanguage={setLanguage} onOpenChat={() => openChat && openChat()} />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-black mb-4"
            >
              {t.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600"
            >
              {t.subtitle}
            </motion.p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 mb-8 shadow-md"
            >
              <p className="text-sm text-gray-600 mb-2">{t.product}:</p>
              <h2 className="text-2xl font-bold text-black">{productName}</h2>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-xl p-8 shadow-md space-y-6"
            >
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  {t.name}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.namePlaceholder}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  {t.phone}
                </label>
                <div className="flex gap-0">
                  {/* Country Code Selector - Compact */}
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-24 px-2 py-3 border border-gray-300 rounded-l-lg border-r-0 focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 transition-colors bg-white text-sm"
                    style={{ direction: "ltr" }}
                  >
                    <option value="+93">🇦🇫 +93</option>
                    <option value="+92">🇵🇰 +92</option>
                    <option value="+98">🇮🇷 +98</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                  </select>

                  {/* Phone Number Input */}
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/\D/g, "")
                      setFormData({ ...formData, phone: value })
                    }}
                    placeholder={t.phonePlaceholder}
                    maxLength={10}
                    className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                {formData.phone && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.countryCode} {formData.phone}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  {t.location}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={t.locationPlaceholder}
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLoadingLocation}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    {isLoadingLocation ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.detecting}
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" />
                        {t.detectLocation}
                      </>
                    )}
                  </button>
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-4 rounded-lg font-semibold text-lg shadow-lg transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-primary/70 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === "dari" ? "در حال پردازش..." : "پروسس کیږي..."}
                  </>
                ) : (
                  t.continue
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  )
}
