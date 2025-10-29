"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, useScroll } from "framer-motion"

interface ModelsShowcaseSectionProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    range: "واټن",
    charge: "چارج",
    speed: "سرعت",
    miles: "مایلونه",
    hours: "ساعتونه",
    mph: "MPH",
    compareModels: "ماډلونه پرتله کړئ",
    sLine: "S لاین",
  },
  dari: {
    range: "برد",
    charge: "شارژ",
    speed: "سرعت",
    miles: "مایل",
    hours: "ساعت",
    mph: "MPH",
    compareModels: "مقایسه مدل‌ها",
    sLine: "S خط",
  },
}

const models = [
  {
    id: "sr-s",
    name: "SR/S",
    range: "171",
    charge: "1.1",
    speed: "124",
    bgColor: "#4A5A6A",
    image: "/images/bike-blue-silver.png",
  },
  {
    id: "sr-f",
    name: "SR/F",
    range: "176",
    charge: "1.1",
    speed: "124",
    bgColor: "#9B9B8E",
    image: "/images/bike-blue-sport.png",
  },
  {
    id: "s",
    name: "S",
    range: "154",
    charge: "1.3",
    speed: "104",
    bgColor: "#5DABA8",
    image: "/images/bike-white-sport.png",
  },
  {
    id: "dsr-x",
    name: "DSR/X",
    range: "180",
    charge: "1.5",
    speed: "112",
    bgColor: "#2D3E50",
    image: "/images/bike-white-rounded.png",
  },
]

export function ModelsShowcaseSection({ language }: ModelsShowcaseSectionProps) {
  const t = translations[language]
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.min(Math.floor(latest * models.length), models.length - 1)
      setActiveIndex(index)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  const activeModel = models[activeIndex]

  return (
    <div ref={containerRef} className="relative" style={{ height: `${models.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Color */}
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ backgroundColor: activeModel.bgColor }}
        />



        {/* Motorcycle Image - Left Side - Fixed Size */}
        <motion.div
          key={activeModel.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute left-16 lg:left-24 top-1/2 -translate-y-1/2 z-10"
        >
          <div className="w-[400px] lg:w-[500px] h-[300px] lg:h-[400px] flex items-center justify-center">
            <img
              src={activeModel.image}
              alt={activeModel.name}
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
            />
          </div>


        </motion.div>

        {/* Right Side - Model Names */}
        <div className="absolute mr-[30%] mt-[5%] lg:right-24 top-1/2 -translate-y-1/2 z-10">
          <div className="space-y-0 text-right">
            {models.map((model) => (
              <div
                key={model.id}
                className={`font-black mt-5 leading-[0.8] tracking-tight uppercase transition-all duration-700 ${model.id === activeModel.id
                  ? "text-white text-[4rem] lg:text-[8rem]"
                  : "text-white/10 text-[2rem] lg:text-[5rem]"
                  }`}

                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  letterSpacing: '-0.04em'
                }}
              >
                {model.name}
              </div>
            ))}
          </div>
        </div>


        {/* Specs Overlaid on Image - Bottom Right of Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute bottom-8 right-8 flex gap-8 mb-[19.5%] mr-[7%]"
        >
          <div className="text-right">
            <div
              className="text-5xl lg:text-6xl font-black text-white leading-none mb-1"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {activeModel.range}
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wide">{t.miles}</div>
            <div className="text-xs text-white/60 uppercase tracking-wide font-semibold">{t.range}</div>
          </div>

          <div className="text-right">
            <div
              className="text-5xl lg:text-6xl font-black text-white leading-none mb-1"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {activeModel.charge}
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wide">{t.hours}</div>
            <div className="text-xs text-white/60 uppercase tracking-wide font-semibold">{t.charge}</div>
          </div>

          <div className="text-right">
            <div
              className="text-5xl lg:text-6xl font-black text-white leading-none mb-1"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {activeModel.speed}
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wide">{t.mph}</div>
            <div className="text-xs text-white/60 uppercase tracking-wide font-semibold">{t.speed}</div>
          </div>
        </motion.div>
        {/* Compare Button - Bottom Right */}

      </div>
    </div>
  )
}
