"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Check, Star, Truck, Shield, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LiveChat } from "@/components/live-chat"
import { getProductById, getRelatedProducts } from "@/lib/api/products"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  
  const [language, setLanguage] = useState<"pashto" | "dari">("dari")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState("specs")
  const [openChat, setOpenChat] = useState<(() => void) | null>(null)
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Prevent auto-opening by ensuring openChat is only set once
  const handleSetOpenChat = (fn: () => void) => {
    if (!openChat) {
      setOpenChat(() => fn)
    }
  }

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      const data = await getProductById(productId)
      if (data) {
        setProduct(data)
        // Load related products
        const related = await getRelatedProducts(productId, data.category, 3)
        setRelatedProducts(related)
      }
      setLoading(false)
    }
    loadProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">محصول یافت نشد</h2>
          <Link href="/products" className="text-primary hover:underline">
            بازگشت به محصولات
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={language === "pashto" || language === "dari" ? "rtl" : "ltr"}>
      <Navigation 
        language={language} 
        setLanguage={setLanguage}
        onOpenChat={() => openChat && openChat()}
      />

      <div className="min-h-screen bg-white pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">
              خانه
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition-colors">
              محصولات
            </Link>
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative h-[500px] bg-gray-100 rounded-2xl overflow-hidden"
              >
                <img
                  src={product.images && product.images[selectedImage] ? product.images[selectedImage] : product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              </motion.div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {(product.images || [product.image_url]).map((image: string, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`h-32 bg-gray-100 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-contain p-2" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {product.category_local}
                  </span>
                  {product.in_stock && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      موجود در انبار
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">{product.name}</h1>
                <p className="text-2xl text-gray-600 mb-4">{product.name_local}</p>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews_count} نظر)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-primary">${product.price.toLocaleString()}</span>
                {product.old_price && <span className="text-2xl text-gray-400 line-through">${product.old_price.toLocaleString()}</span>}
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">رنگ:</h3>
                  <div className="flex gap-3">
                    {product.colors.map((color: any, index: number) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-primary transition-colors"
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">تعداد:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div>
                <Link href={`/checkout?product=${1}&name=${encodeURIComponent(product.name)}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    خرید کنید
                  </motion.button>
                </Link>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">ارسال رایگان</p>
                    <p className="text-xs text-gray-600">در سراسر هرات</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">گارانتی 2 ساله</p>
                    <p className="text-xs text-gray-600">پشتیبانی کامل</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">بازگشت 7 روزه</p>
                    <p className="text-xs text-gray-600">بدون سوال</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="py-12">
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setSelectedTab("specs")}
                  className={`pb-4 px-2 font-medium transition-colors ${
                    selectedTab === "specs" ? "text-primary border-b-2 border-primary" : "text-gray-600 hover:text-black"
                  }`}
                >
                  مشخصات فنی
                </button>
                <button
                  onClick={() => setSelectedTab("features")}
                  className={`pb-4 px-2 font-medium transition-colors ${
                    selectedTab === "features"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  ویژگی‌ها
                </button>
                <button
                  onClick={() => setSelectedTab("reviews")}
                  className={`pb-4 px-2 font-medium transition-colors ${
                    selectedTab === "reviews"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  نظرات ({product.reviews})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {selectedTab === "specs" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {product.specs && product.specs.length > 0 ? product.specs.map((spec: any, index: number) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">{spec.label}</p>
                    <p className="text-xl font-bold text-black">{spec.value}</p>
                  </div>
                )) : (
                  <div className="col-span-4 text-center py-8 text-gray-500">
                    مشخصات فنی به زودی اضافه خواهد شد
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === "features" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                {product.features && product.features.length > 0 ? product.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                )) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    ویژگی‌ها به زودی اضافه خواهند شد
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === "reviews" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center py-12 text-gray-500">
                  نظرات به زودی اضافه خواهند شد ({product.reviews_count} نظر)
                </div>
              </motion.div>
            )}
          </div>


        </div>
      </div>

      <Footer language={language} />
      <LiveChat language={language} onOpenRef={handleSetOpenChat} />
    </div>
  )
}
