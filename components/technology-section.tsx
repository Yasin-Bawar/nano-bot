"use client"

import { useRef } from "react"
import { Cpu, Battery, Wifi, Shield } from "lucide-react"
import { motion, useInView } from "framer-motion"

interface TechnologySectionProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    title: "ټکنالوژي",
    subtitle: "د پرمختللي نوښت سره د راتلونکي جوړول",
    smartBattery: "هوښیار بیټري",
    smartBatteryDesc: "د AI سره ځواکمن شوی د بیټرۍ مدیریت",
    aiSensors: "AI سینسرونه",
    aiSensorsDesc: "د ریښتیني وخت څارنه او وړاندوینه",
    connectivity: "سمارټ اتصال",
    connectivityDesc: "د موبایل اپلیکیشن سره مدغم",
    security: "پرمختللی امنیت",
    securityDesc: "بایومتریک او GPS تعقیب",
  },
  dari: {
    title: "تکنولوژی",
    subtitle: "ساخت آینده با نوآوری پیشرفته",
    smartBattery: "باتری هوشمند",
    smartBatteryDesc: "مدیریت باتری با قدرت هوش مصنوعی",
    aiSensors: "سنسورهای هوش مصنوعی",
    aiSensorsDesc: "نظارت و پیش‌بینی زمان واقعی",
    connectivity: "اتصال هوشمند",
    connectivityDesc: "یکپارچه با اپلیکیشن موبایل",
    security: "امنیت پیشرفته",
    securityDesc: "بیومتریک و ردیابی GPS",
  },
}

export function TechnologySection({ language }: TechnologySectionProps) {
  const t = translations[language]
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  const technologies = [
    { icon: Battery, title: t.smartBattery, description: t.smartBatteryDesc },
    { icon: Cpu, title: t.aiSensors, description: t.aiSensorsDesc },
    { icon: Wifi, title: t.connectivity, description: t.connectivityDesc },
    { icon: Shield, title: t.security, description: t.securityDesc },
  ]

  return (
    <section id="technology" ref={sectionRef} className="py-24 md:py-32 lg:py-40 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
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

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 max-w-6xl">
          {technologies.map((tech, index) => {
            const Icon = tech.icon
            return (
              <motion.div
                key={index}
                className="relative group space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ x: -10 }}
              >
                <motion.div 
                  className="h-px bg-border w-full"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-10 h-10 text-primary" />
                </motion.div>
                <h3 className="text-3xl font-bold group-hover:text-primary transition-colors">{tech.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{tech.description}</p>
                <motion.div
                  className="absolute -left-4 top-0 w-1 h-0 bg-primary"
                  whileHover={{ height: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="mt-20 lg:mt-32 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div 
            className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-muted/50 to-background border-2 border-border/50 shadow-2xl"
            whileHover={{ scale: 1.02, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <img
                src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=2070&auto=format&fit=crop"
                alt="NANO BOT Technology"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
