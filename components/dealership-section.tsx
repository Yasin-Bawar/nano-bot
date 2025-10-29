"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react"
import { motion, useInView } from "framer-motion"

interface DealershipSectionProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    title: "مخکینۍ امر",
    subtitle: "خپل NANO BOT مخکینۍ امر ورکړئ",
    name: "نوم",
    email: "بریښنالیک",
    phone: "تلیفون",
    model: "ماډل غوره کړئ",
    submit: "مخکینۍ امر وسپارئ",
    dealerLocations: "د ډیلرشپ موقعیتونه",
    kabul: "کابل، افغانستان",
    herat: "هرات، افغانستان",
    mazar: "مزار شریف، افغانستان",
  },
  dari: {
    title: "پیش‌سفارش",
    subtitle: "NANO BOT خود را پیش‌سفارش دهید",
    name: "نام",
    email: "ایمیل",
    phone: "تلفن",
    model: "مدل را انتخاب کنید",
    submit: "ارسال پیش‌سفارش",
    dealerLocations: "موقعیت‌های نمایندگی",
    kabul: "کابل، افغانستان",
    herat: "هرات، افغانستان",
    mazar: "مزار شریف، افغانستان",
  },
}

export function DealershipSection({ language }: DealershipSectionProps) {
  const t = translations[language]
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  const dealerships = [
    { city: t.kabul, address: "Wazir Akbar Khan", phone: "+93 700 123 456", email: "kabul@nanobot.af" },
    { city: t.herat, address: "City Center", phone: "+93 700 234 567", email: "herat@nanobot.af" },
    { city: t.mazar, address: "Downtown", phone: "+93 700 345 678", email: "mazar@nanobot.af" },
  ]

  return (
    <section id="dealership" ref={sectionRef} className="py-24 md:py-32 lg:py-40 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 max-w-6xl mx-auto">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6 lg:space-y-8">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">{t.title}</h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light">{t.subtitle}</p>
            </div>

            <form className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Input placeholder={t.name} className="h-14 bg-background border-border text-lg focus:border-primary transition-colors" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Input type="email" placeholder={t.email} className="h-14 bg-background border-border text-lg focus:border-primary transition-colors" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Input type="tel" placeholder={t.phone} className="h-14 bg-background border-border text-lg focus:border-primary transition-colors" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <select className="w-full h-14 px-4 rounded-lg bg-background border border-border text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                  <option>{t.model}</option>
                  <option>X1 Urban</option>
                  <option>R2 Sport</option>
                  <option>A3 Adventure</option>
                  <option>S4 Elite</option>
                  <option>C5 City</option>
                  <option>T6 Touring</option>
                </select>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-medium group relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    {t.submit}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </form>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">{t.dealerLocations}</h3>
            <div className="space-y-6">
              {dealerships.map((dealer, index) => (
                <motion.div 
                  key={index} 
                  className="relative group space-y-3 pb-6 border-b border-border last:border-0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    </motion.div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{dealer.city}</h4>
                      <p className="text-muted-foreground">{dealer.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground ml-8">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{dealer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{dealer.email}</span>
                    </div>
                  </div>
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
