"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight, Zap, Battery, Gauge } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

interface HeroSectionProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    tagline: "د بریښنایی سواری راتلونکی",
    subtitle: "د افغانستان لپاره ډیزاین شوی - پاک، خاموش، ځواکمن",
    range: "220",
    rangeUnit: "کیلومتره",
    rangeLabel: "واټن",
    speed: "180",
    speedUnit: "کیلومتره/ساعت",
    speedLabel: "سرعت",
    charge: "1.5",
    chargeUnit: "ساعته",
    chargeLabel: "چارج وخت",
    exploreModels: "ماډلونه وګورئ",
    colorsAvailable: "رنګونه شته",
  },
  dari: {
    tagline: "آینده سواری الکتریکی",
    subtitle: "طراحی شده برای افغانستان - پاک، خاموش، قدرتمند",
    range: "220",
    rangeUnit: "کیلومتر",
    rangeLabel: "برد",
    speed: "180",
    speedUnit: "کیلومتر/ساعت",
    speedLabel: "سرعت",
    charge: "1.5",
    chargeUnit: "ساعت",
    chargeLabel: "زمان شارژ",
    exploreModels: "مشاهده مدل‌ها",
    colorsAvailable: "رنگ‌های موجود",
  },
}

export function HeroSection({ language }: HeroSectionProps) {
  const t = translations[language]
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const scrollToModels = () => {
    document.getElementById("models")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-background">
      {/* Hero Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent z-10" />
        <img
          src="/images/hero.jpg"
          alt="Electric Motorcycle"
          className="w-full h-full object-cover object-top"
          style={{ objectPosition: 'center top' }}
        />
      </motion.div>

      {/* Subtle accent glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] z-10" />

      {/* Content - Repositioned to right with better spacing */}
      <div className="container mx-auto px-6 lg:px-16 xl:px-20 relative z-20">
        <motion.div
          style={{ opacity }}
          className="min-h-screen flex items-center justify-end py-20"
        >
          <div className="max-w-xl lg:max-w-2xl space-y-10 text-right">
            {/* Main Heading - Even smaller */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-3"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {t.tagline}
              </h1>
              <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed">
                {t.subtitle}
              </p>
            </motion.div>

            {/* Performance Stats - Smaller, tighter */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { value: t.range, unit: t.rangeUnit, label: t.rangeLabel, icon: Battery },
                { value: t.charge, unit: t.chargeUnit, label: t.chargeLabel, icon: Zap },
                { value: t.speed, unit: t.speedUnit, label: t.speedLabel, icon: Gauge },
              ].map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <spec.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{spec.unit}</span>
                        <span className="text-2xl md:text-3xl font-semibold text-white">{spec.value}</span>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{spec.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Color Options - Better visibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-end gap-3"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                {["#000000", "#DC2626", "#2563EB", "#FFFFFF", "#9CA3AF", "#1F2937"].map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + i * 0.04 }}
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-6 h-6 rounded-full border-2 border-white/30 cursor-pointer hover:border-white shadow-lg transition-all"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {t.colorsAvailable}
              </span>
            </motion.div>

            {/* CTA Button - Smaller, cleaner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex justify-end"
            >
              <Button
                onClick={scrollToModels}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-5 rounded-lg text-sm font-medium group"
              >
                <span className="flex items-center gap-2">
                  {t.exploreModels}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToModels}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-gray-400 hover:text-white transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </motion.button>
    </section>
  )
}
