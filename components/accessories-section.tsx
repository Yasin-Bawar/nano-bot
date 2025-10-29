"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface AccessoriesSectionProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    number: "01",
    title: "COMFORT",
    categories: [
      { name: "DESIGN", nameLocal: "ډیزاین", image: "/bike-blue-front.png" },
      { name: "POWER", nameLocal: "ځواک", image: "/blue-blue-testing.png" },
      { name: "APPAREL", nameLocal: "جامې", image: "/blue-blue-sharp-no.png" },
      { name: "STORAGE", nameLocal: "ذخیره", image: "/bike-blue-front.png" },
      { name: "PERFORMANCE", nameLocal: "فعالیت", image: "/blue-blue-testing.png" },
      { name: "GARAGE", nameLocal: "ګاراژ", image: "/blue-blue-sharp-no.png" },
      { name: "BUNDLES", nameLocal: "بنډلونه", image: "/bike-blue-front.png" },
    ],
    viewLink: "د آرامۍ لوازمات وګورئ",
  },
  dari: {
    number: "01",
    title: "COMFORT",
    categories: [
      { name: "DESIGN", nameLocal: "طراحی", image: "/bike-blue-front.png" },
      { name: "POWER", nameLocal: "قدرت", image: "/blue-blue-testing.png" },
      { name: "APPAREL", nameLocal: "پوشاک", image: "/blue-blue-sharp-no.png" },
      { name: "STORAGE", nameLocal: "ذخیره‌سازی", image: "/bike-blue-front.png" },
      { name: "PERFORMANCE", nameLocal: "عملکرد", image: "/blue-blue-testing.png" },
      { name: "GARAGE", nameLocal: "گاراژ", image: "/blue-blue-sharp-no.png" },
      { name: "BUNDLES", nameLocal: "بسته‌ها", image: "/bike-blue-front.png" },
    ],
    viewLink: "مشاهده لوازم جانبی راحتی",
  },
}

export function AccessoriesSection({ language }: AccessoriesSectionProps) {
  const t = translations[language]
  const [activeImage, setActiveImage] = useState(t.categories[0].image)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative bg-white min-h-screen flex items-center py-20">
      <div className="container mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Categories */}
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-xs md:text-sm font-medium text-gray-400 tracking-wider block">
                {t.number}
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black uppercase">
                {t.title}
              </h2>
            </div>

            {/* Category list */}
            <div className="space-y-1">
              {t.categories.map((category, index) => (
                <motion.div
                  key={index}
                  onMouseEnter={() => {
                    setActiveImage(category.image)
                    setHoveredIndex(index)
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer py-3 border-b border-gray-200 transition-all"
                  whileHover={{ x: 10 }}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-3xl md:text-4xl lg:text-5xl font-bold uppercase transition-all duration-300 ${
                        hoveredIndex === index
                          ? "text-black"
                          : "text-gray-300"
                      }`}
                      style={{
                        WebkitTextStroke: hoveredIndex === index ? "0px" : "1px black",
                      }}
                    >
                      {category.name}
                    </h3>
                    <span
                      className={`text-lg md:text-xl text-gray-600 transition-opacity duration-300 ${
                        hoveredIndex === index ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      {category.nameLocal}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View link */}
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-primary transition-colors group"
              whileHover={{ x: 5 }}
            >
              {t.viewLink}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          {/* Right side - Image */}
          <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt="Accessory"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
