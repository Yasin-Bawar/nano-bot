"use client"

import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getFeaturedProducts } from "@/lib/api/products"
import { Product } from "@/lib/supabase"

interface ProductsGridSectionProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    title: "زموږ محصولات",
    subtitle: "بریښنایی موټرسایکلونه او برخې",
    addToCart: "کارټ ته اضافه کړئ",
  },
  dari: {
    title: "محصولات ما",
    subtitle: "موتورسیکلت‌های برقی و قطعات",
    addToCart: "افزودن به سبد",
  },
}

export function ProductsGridSection({ language }: ProductsGridSectionProps) {
  const t = translations[language]
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      const data = await getFeaturedProducts()
      setProducts(data)
      setLoading(false)
    }
    loadProducts()
  }, [])

  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4"
            >
              {t.title}
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-4 rounded-full"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600"
            >
              {t.subtitle}
            </motion.p>
          </motion.div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.slice(0, 8).map((product, index) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="group relative cursor-pointer"
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Card */}
                  <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-primary/20">
                    {/* Product Image */}
                    <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full h-full"
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain p-4"
                        />
                      </motion.div>

                      {/* Category badge with animation */}
                      <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg"
                      >
                        {product.category_local}
                      </motion.div>

                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-5 space-y-3 bg-white">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        <h3 className="text-lg font-bold text-black group-hover:text-primary transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">{product.name_local}</p>
                      </motion.div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <motion.span
                          className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                          whileHover={{ scale: 1.1 }}
                        >
                          ${product.price.toLocaleString()}
                        </motion.span>
                        <motion.button
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white p-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
