"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface AboutSectionProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    title: "زموږ په اړه",
    description:
      "NANO BOT د بریښنایی موټرسایکل صنعت کې مخکښ دی، چې د نوښت، فعالیت او پایښت سره د راتلونکي ټکنالوژۍ په جوړولو کې بوخت دی.",
    innovation: "نوښت",
    innovationDesc: "د پرمختللي ټکنالوژۍ سره د راتلونکي جوړول",
    performance: "فعالیت",
    performanceDesc: "د لوړ سرعت او اوږد واټن سره بې ساری تجربه",
    sustainability: "پایښت",
    sustainabilityDesc: "د صفر اخراج او سبز راتلونکي لپاره ژمنه",
  },
  dari: {
    title: "درباره ما",
    description:
      "NANO BOT در صنعت موتورسیکلت‌های الکتریکی پیشرو است و با نوآوری، عملکرد و پایداری، آینده تکنولوژی را می‌سازد.",
    innovation: "نوآوری",
    innovationDesc: "ساخت آینده با تکنولوژی پیشرفته",
    performance: "عملکرد",
    performanceDesc: "تجربه بی‌نظیر با سرعت بالا و برد طولانی",
    sustainability: "پایداری",
    sustainabilityDesc: "تعهد به صفر انتشار و آینده سبز",
  },
}

export function AboutSection({ language }: AboutSectionProps) {
  const t = translations[language]
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <section ref={sectionRef} className="py-24 md:py-32 lg:py-40 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-border/50 shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
                animate={{ 
                  opacity: [0.4, 0.6, 0.4],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img
                  src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop"
                  alt="NANO BOT Detail"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-12 lg:space-y-16 order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-6 lg:space-y-8">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">{t.title}</h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light leading-relaxed">{t.description}</p>
            </div>

            <div className="space-y-8">
              {[
                { title: t.innovation, desc: t.innovationDesc },
                { title: t.performance, desc: t.performanceDesc },
                { title: t.sustainability, desc: t.sustainabilityDesc },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative group space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className="h-px bg-border w-24"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  />
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg">{feature.desc}</p>
                  <motion.div
                    className="absolute -right-4 top-0 w-1 h-0 bg-primary"
                    whileHover={{ height: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
