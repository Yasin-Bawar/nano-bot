"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, useInView } from "framer-motion"

interface ModelsSectionProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    title: "ماډلونه",
    subtitle: "د خپل بهترین بریښنایی موټرسایکل ومومئ",
    all: "ټول",
    urban: "ښاري",
    adventure: "ساہسک",
    performance: "فعالیت",
    range: "واټن",
    speed: "سرعت",
    battery: "بیټري",
    viewDetails: "تفصیلات وګورئ",
  },
  dari: {
    title: "مدل‌ها",
    subtitle: "موتورسیکلت الکتریکی کامل خود را پیدا کنید",
    all: "همه",
    urban: "شهری",
    adventure: "ماجراجویی",
    performance: "عملکرد",
    range: "برد",
    speed: "سرعت",
    battery: "باتری",
    viewDetails: "مشاهده جزئیات",
  },
}

const models = [
  {
    id: 1,
    name: "X1 Urban",
    category: "urban",
    range: "120",
    speed: "90",
    battery: "5.2",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1200&auto=format&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "R2 Sport",
    category: "performance",
    range: "180",
    speed: "160",
    battery: "8.5",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop&crop=center",
  },
  {
    id: 3,
    name: "A3 Adventure",
    category: "adventure",
    range: "200",
    speed: "120",
    battery: "10.2",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop&crop=center",
  },
  {
    id: 4,
    name: "S4 Elite",
    category: "performance",
    range: "150",
    speed: "180",
    battery: "7.8",
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=1200&auto=format&fit=crop&crop=center",
  },
  {
    id: 5,
    name: "C5 City",
    category: "urban",
    range: "100",
    speed: "80",
    battery: "4.5",
    image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?q=80&w=1200&auto=format&fit=crop&crop=center",
  },
  {
    id: 6,
    name: "T6 Touring",
    category: "adventure",
    range: "220",
    speed: "130",
    battery: "11.5",
    image: "https://images.unsplash.com/photo-1609630875252-9e4b6b7e8f3f?q=80&w=1200&auto=format&fit=crop&crop=center",
  },
]

export function ModelsSection({ language }: ModelsSectionProps) {
  const t = translations[language]
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const filteredModels = activeCategory === "all" ? models : models.filter((model) => model.category === activeCategory)

  return (
    <section id="models" ref={sectionRef} className="py-24 md:py-32 lg:py-40 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-muted/30 to-transparent" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          className="mb-16 lg:mb-24 max-w-4xl"
          initial={{ opacity: 0, x: 100 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tighter">{t.title}</h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light">{t.subtitle}</p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center gap-2 mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {["all", "urban", "adventure", "performance"].map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setActiveCategory(category)}
                variant="ghost"
                className={`text-sm uppercase tracking-wider font-medium transition-colors ${
                  activeCategory === category
                    ? "text-foreground border-b-2 border-primary rounded-none"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t[category as keyof typeof t]}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
          {filteredModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, rotateY: -30, x: 50 }}
              animate={isInView ? { opacity: 1, rotateY: 0, x: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Card className="group overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 bg-card hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-gradient-to-br from-muted/30 to-background">
                    <div className="aspect-[4/3] flex items-center justify-center p-8">
                      <motion.img
                        src={model.image}
                        alt={model.name}
                        className="w-full h-full object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="p-6 space-y-6">
                    <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {model.name}
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: model.range, label: t.range, unit: "km" },
                        { value: model.speed, label: t.speed, unit: "km/h" },
                        { value: model.battery, label: t.battery, unit: "kWh" },
                      ].map((spec, i) => (
                        <div key={i} className="space-y-1">
                          <div className="h-px bg-border w-full" />
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-foreground">{spec.value}</span>
                            <span className="text-xs text-muted-foreground">{spec.unit}</span>
                          </div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">{spec.label}</p>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      className="text-foreground hover:text-primary group/btn px-0 text-sm uppercase tracking-wide font-medium"
                    >
                      <span>{t.viewDetails}</span>
                      <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
