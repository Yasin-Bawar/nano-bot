"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Battery, Zap, Gauge, Shield, Wifi, Leaf } from "lucide-react"

interface FeatureItem {
  title_dari: string
  title_pashto: string
  title_en: string
  description_dari: string
  description_pashto: string
  stat: string
  icon: string
  order_index: number
}

interface FeaturesShowcaseSectionProps {
  language: "pashto" | "dari"
  features?: FeatureItem[]
}

const iconMap: Record<string, any> = {
  Battery,
  Zap,
  Gauge,
  Shield,
  Wifi,
  Leaf
}

const defaultFeatures = {
  pashto: [
    {
      icon: "Battery",
      title: "اوږد واټن",
      titleEn: "LONG RANGE",
      description: "تر 220 کیلومتره پورې د یو چارج سره",
      stat: "220km",
    },
    {
      icon: "Zap",
      title: "چټک چارج",
      titleEn: "FAST CHARGING",
      description: "په 1 ساعت کې بشپړ چارج",
      stat: "1hr",
    },
    {
      icon: "Gauge",
      title: "لوړ سرعت",
      titleEn: "HIGH SPEED",
      description: "تر 180 کیلومتره/ساعت پورې",
      stat: "180km/h",
    },
    {
      icon: "Shield",
      title: "خوندیتوب",
      titleEn: "SAFETY",
      description: "پرمختللي ABS او ټریکشن کنټرول",
      stat: "ABS",
    },
    {
      icon: "Wifi",
      title: "سمارټ",
      titleEn: "SMART TECH",
      description: "د موبایل اپلیکیشن سره وصل",
      stat: "IoT",
    },
    {
      icon: "Leaf",
      title: "پاک",
      titleEn: "ECO FRIENDLY",
      description: "صفر اخراج، پاک چاپیریال",
      stat: "0%",
    },
  ],
  dari: [
    {
      icon: "Battery",
      title: "برد طولانی",
      titleEn: "LONG RANGE",
      description: "تا 220 کیلومتر با یک شارژ",
      stat: "220km",
    },
    {
      icon: "Zap",
      title: "شارژ سریع",
      titleEn: "FAST CHARGING",
      description: "شارژ کامل در 1 ساعت",
      stat: "1hr",
    },
    {
      icon: "Gauge",
      title: "سرعت بالا",
      titleEn: "HIGH SPEED",
      description: "تا 180 کیلومتر در ساعت",
      stat: "180km/h",
    },
    {
      icon: "Shield",
      title: "ایمنی",
      titleEn: "SAFETY",
      description: "ABS پیشرفته و کنترل کشش",
      stat: "ABS",
    },
    {
      icon: "Wifi",
      title: "فناوری هوشمند",
      titleEn: "SMART TECH",
      description: "متصل به اپلیکیشن موبایل",
      stat: "IoT",
    },
    {
      icon: "Leaf",
      title: "سازگار با محیط زیست",
      titleEn: "ECO FRIENDLY",
      description: "صفر انتشار، محیط زیست پاک",
      stat: "0%",
    },
  ],
}

export function FeaturesShowcaseSection({ language, features }: FeaturesShowcaseSectionProps) {
  const displayFeatures = features && features.length > 0 
    ? features.map(f => ({
        icon: iconMap[f.icon] || Battery,
        title: language === "dari" ? f.title_dari : f.title_pashto,
        titleEn: f.title_en,
        description: language === "dari" ? f.description_dari : f.description_pashto,
        stat: f.stat
      }))
    : defaultFeatures[language].map(f => ({
        ...f,
        icon: iconMap[f.icon] || Battery
      }))
  
  const t = {
    title: language === "pashto" ? "ځانګړتیاوې" : "ویژگی‌ها",
    subtitle: language === "pashto" ? "د راتلونکي لپاره ډیزاین شوی" : "طراحی شده برای آینده",
    features: displayFeatures
  }
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="relative bg-white py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          style={{ opacity }}
          className="text-center mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-4"
          >
            {t.title}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-gradient-to-r from-primary to-accent mx-auto mb-6 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600"
          >
            {t.subtitle}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group relative"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-primary rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Card */}
                <div className="relative h-full bg-white border border-gray-200 rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:border-primary/30 shadow-lg hover:shadow-2xl">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <motion.div
                      className="relative w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="relative space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {feature.titleEn}
                      </h3>
                      <h4 className="text-2xl md:text-3xl font-bold text-black mb-2 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Stat */}
                    <motion.div
                      className="pt-4 border-t border-gray-200"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.span
                        className="text-4xl font-bold text-primary"
                        whileHover={{ scale: 1.1 }}
                      >
                        {feature.stat}
                      </motion.span>
                    </motion.div>
                  </div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
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
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(82, 183, 136, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg transition-all duration-300"
          >
            {language === "pashto" ? "نور معلومات" : "اطلاعات بیشتر"}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
