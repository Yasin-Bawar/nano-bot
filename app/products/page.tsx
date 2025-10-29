"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Grid, List, ShoppingCart, Star, Package, Zap, Shield, TrendingUp, Heart, Eye } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LiveChat } from "@/components/live-chat"
import { getProducts, searchProducts } from "@/lib/api/products"
import { Product } from "@/lib/supabase"

export default function ProductsPage() {
  const [language] = useState<"pashto" | "dari">("dari")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openChat, setOpenChat] = useState<(() => void) | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  // Prevent auto-opening by ensuring openChat is only set once
  const handleSetOpenChat = (fn: () => void) => {
    if (!openChat) {
      setOpenChat(() => fn)
    }
  }

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const data = await getProducts(selectedCategory)
      setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [selectedCategory])

  const t = {
    title: "محصولات نانوبات",
    subtitle: "موتورسیکلت‌های برقی پیشرفته با تکنولوژی روز دنیا",
    search: "جستجوی محصولات...",
    filter: "فیلتر",
    all: "همه محصولات",
    motorcycles: "موتورسیکلت‌ها",
    parts: "قطعات یدکی",
    accessories: "لوازم جانبی",
    addToCart: "افزودن به سبد خرید",
    viewDetails: "مشاهده جزئیات",
    inStock: "موجود در انبار",
    outOfStock: "ناموجود",
    newArrival: "جدید",
    featured: "ویژه",
    bestSeller: "پرفروش",
    currency: "افغانی",
    reviews: "نظرات",
    specifications: "مشخصات",
    compare: "مقایسه",
    quickView: "نمایش سریع",
    addToWishlist: "افزودن به علاقه‌مندی‌ها",
    sortBy: "مرتب‌سازی بر اساس",
    priceRange: "محدوده قیمت",
    showingResults: "نمایش نتایج",
    noResults: "محصولی یافت نشد",
    tryDifferent: "لطفاً جستجوی دیگری امتحان کنید",
  }

  // Search functionality
  useEffect(() => {
    async function handleSearch() {
      if (searchQuery.trim()) {
        setLoading(true)
        const results = await searchProducts(searchQuery)
        setProducts(results)
        setLoading(false)
      } else {
        // Reload products if search is cleared
        const data = await getProducts(selectedCategory)
        setProducts(data)
      }
    }

    const debounce = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery, selectedCategory])

  const filteredProducts = products

  return (
    <div className="rtl">
      <Navigation
        language={language}
        setLanguage={() => { }}
        onOpenChat={() => openChat && openChat()}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">

        <div className="container mx-auto px-6 py-12">
          {/* Filters & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search}
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-right"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory("all")}
                  className={`px-6 py-4 rounded-xl font-bold transition-all ${selectedCategory === "all"
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{t.all}</span>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory("motorcycle")}
                  className={`px-6 py-4 rounded-xl font-bold transition-all ${selectedCategory === "motorcycle"
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>{t.motorcycles}</span>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory("part")}
                  className={`px-6 py-4 rounded-xl font-bold transition-all ${selectedCategory === "part"
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>{t.parts}</span>
                  </div>
                </motion.button>
              </div>

              {/* View Mode */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all ${viewMode === "grid"
                    ? "bg-white text-primary shadow-md"
                    : "text-gray-600"
                    }`}
                >
                  <Grid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all ${viewMode === "list"
                    ? "bg-white text-primary shadow-md"
                    : "text-gray-600"
                    }`}
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              {t.showingResults}: <span className="font-bold text-primary">{filteredProducts.length}</span> محصول
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-72 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                      <div className="h-10 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Grid/List */}
          {!loading && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-6"
              }
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/20 ${viewMode === "list" ? "flex gap-6" : ""
                    }`}
                >
                  {/* Image */}
                  <Link
                    href={`/products/${product.id}`}
                    className={`relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ${viewMode === "list" ? "w-80 h-80" : "h-72"
                      }`}
                  >
                    <motion.img
                      animate={{
                        scale: hoveredProduct === product.id ? 1.1 : 1,
                        rotate: hoveredProduct === product.id ? 2 : 0
                      }}
                      transition={{ duration: 0.4 }}
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain p-6"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <div className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {product.category_local}
                      </div>
                      {product.featured && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{t.featured}</span>
                        </div>
                      )}
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute bottom-4 left-4">
                      {product.in_stock ? (
                        <div className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span>{t.inStock}</span>
                        </div>
                      ) : (
                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {t.outOfStock}
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: hoveredProduct === product.id ? 1 : 0,
                        y: hoveredProduct === product.id ? 0 : 20
                      }}
                      className="absolute top-4 left-4 flex flex-col gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
                        title={t.addToWishlist}
                      >
                        <Heart className="w-4 h-4 text-red-500" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
                        title={t.quickView}
                      >
                        <Eye className="w-4 h-4 text-primary" />
                      </motion.button>
                    </motion.div>
                  </Link>

                  {/* Info */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.name_local}</p>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {product.rating.toFixed(1)} ({product.reviews_count} {t.reviews})
                      </span>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {product.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">{t.currency}</div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-bold"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="hidden sm:inline">{t.addToCart}</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.noResults}</h3>
                <p className="text-gray-600 mb-6">{t.tryDifferent}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  مشاهده همه محصولات
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer language={language} />
      <LiveChat language={language} onOpenRef={handleSetOpenChat} />
    </div>
  )
}
