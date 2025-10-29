"use client"

import { useEffect, useRef, useState } from "react"
import { Leaf, Recycle, Factory, TrendingDown } from "lucide-react"
import { motion, useInView } from "framer-motion"

interface SustainabilitySectionProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    title: "پایښت",
    subtitle: "د سبز راتلونکي لپاره ژمنه",
    zeroEmissions: "صفر اخراج",
    recyclable: "د بیا کارولو وړ",
    sustainable: "پایښت تولید",
    reduced: "کاربن کم شوی",
    impact: "زموږ اغیز",
    co2Saved: "CO2 خوندي شوی",
    treesSaved: "ونې خوندي شوې",
    cleanMiles: "پاک مایلونه",
  },
  dari: {
    title: "پایداری",
    subtitle: "تعهد به آینده سبز",
    zeroEmissions: "صفر انتشار",
    recyclable: "قابل بازیافت",
    sustainable: "تولید پایدار",
    reduced: "کربن کاهش یافته",
    impact: "تأثیر ما",
    co2Saved: "CO2 ذخیره شده",
    treesSaved: "درختان ذخیره شده",
    cleanMiles: "مایل‌های پاک",
  },
}

export function SustainabilitySection({ language }: SustainabilitySectionProps) {
  const t = translations[language]
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  const [co2Count, setCo2Count] = useState(0)
  const [treesCount, setTreesCount] = useState(0)
  const [milesCount, setMilesCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      const co2Target = 2500
      const treesTarget = 1200
      const milesTarget = 5000000
      const duration = 2000
      const steps = 60

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        setCo2Count(Math.min(Math.floor((co2Target / steps) * currentStep), co2Target))
        setTreesCount(Math.min(Math.floor((treesTarget / steps) * currentStep), treesTarget))
        setMilesCount(Math.min(Math.floor((milesTarget / steps) * currentStep), milesTarget))
        if (currentStep >= steps) clearInterval(interval)
      }, duration / steps)

      return () => clearInterval(interval)
    }
  }, [isInView])

  const features = [
    { icon: Leaf, title: t.zeroEmissions },
    { icon: Recycle, title: t.recyclable },
    { icon: Factory, title: t.sustainable },
    { icon: TrendingDown, title: t.reduced },
  ]

  return (
    <section id="sustainability" ref={sectionRef} className="py-24 md:py-32 lg:py-40 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          className="mb-16 lg:mb-24 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tighter">{t.title}</h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light">{t.subtitle}</p>
        </motion.div>

        <div className="flex flex-wrap gap-12 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div 
                key={index} 
                className="flex items-center gap-4 group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.1, x: 10 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-8 h-8 text-primary" />
                </motion.div>
                <span className="text-lg font-medium group-hover:text-primary transition-colors">{feature.title}</span>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-4xl font-bold mb-12">{t.impact}</h3>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl">
            {[
              { value: co2Count.toLocaleString(), unit: "tons", label: t.co2Saved },
              { value: treesCount.toLocaleString(), unit: "", label: t.treesSaved },
              { value: (milesCount / 1000000).toFixed(1), unit: "M", label: t.cleanMiles },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="relative group space-y-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1, type: "spring" }}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="h-px bg-border w-full"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                />
                <div className="flex items-baseline gap-2">
                  <motion.span 
                    className="text-5xl md:text-6xl font-bold text-foreground group-hover:text-primary transition-colors"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.span>
                  {stat.unit && <span className="text-xl text-muted-foreground uppercase">{stat.unit}</span>}
                </div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <motion.div
                  className="absolute -left-4 top-0 w-1 h-0 bg-primary"
                  whileHover={{ height: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
