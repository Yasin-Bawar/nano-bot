"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface RotatingShowcaseSectionProps {
  language: "pashto" | "dari"
}

const bikeImages = [
  "/images/bike-blue-sport.png",
  "/images/bike-white-rounded.png",
  "/images/bike-white-sport.png",
]

const translations = {
  pashto: {
    features: [
      {
        number: "01",
        title: "RAPID",
        title2: "CHARGING",
        subtitle: "Full charge in as fast as 1hr.",
        titleLocal: "چټک چارج",
        subtitleLocal: "په 1 ساعت کې بشپړ چارج",
      },
      {
        number: "02",
        title: "LOW-TO-NO",
        title2: "MAINTENANCE",
        subtitle: "Fluidity without the fluids.",
        titleLocal: "کم څخه هیڅ ساتنه",
        subtitleLocal: "د مایعاتو پرته روانتیا",
      },
      {
        number: "03",
        title: "223MI PEAK",
        title2: "RANGE",
        subtitle: "SR/F city range with Power Tank.",
        titleLocal: "223MI لوړ واټن",
        subtitleLocal: "د پاور ټانک سره SR/F ښار واټن",
      },
      {
        number: "04",
        title: "124MPH TOP",
        title2: "SPEED",
        subtitle: "No clutch. No gears. Just go.",
        titleLocal: "124MPH لوړ سرعت",
        subtitleLocal: "هیڅ کلچ نشته. هیڅ ګیر نشته. یوازې حرکت.",
      },
      {
        number: "05",
        title: "CYPHER",
        title2: "III+",
        subtitle: "Advanced motorcycle performance customization.",
        titleLocal: "CYPHER III+",
        subtitleLocal: "د پرمختللي موټرسایکل فعالیت شخصي کول",
      },
      {
        number: "06",
        title: "INSTANT",
        title2: "TORQUE",
        subtitle: "Up to 169 lb-ft of torque.",
        titleLocal: "فوری ټورک",
        subtitleLocal: "تر 169 lb-ft پورې ټورک",
      },
    ],
  },
  dari: {
    features: [
      {
        number: "01",
        title: "RAPID",
        title2: "CHARGING",
        subtitle: "Full charge in as fast as 1hr.",
        titleLocal: "شارژ سریع",
        subtitleLocal: "شارژ کامل در 1 ساعت",
      },
      {
        number: "02",
        title: "LOW-TO-NO",
        title2: "MAINTENANCE",
        subtitle: "Fluidity without the fluids.",
        titleLocal: "نگهداری کم تا صفر",
        subtitleLocal: "روانی بدون مایعات",
      },
      {
        number: "03",
        title: "223MI PEAK",
        title2: "RANGE",
        subtitle: "SR/F city range with Power Tank.",
        titleLocal: "223MI برد اوج",
        subtitleLocal: "برد شهری SR/F با تانک قدرت",
      },
      {
        number: "04",
        title: "124MPH TOP",
        title2: "SPEED",
        subtitle: "No clutch. No gears. Just go.",
        titleLocal: "124MPH سرعت بالا",
        subtitleLocal: "بدون کلاچ. بدون دنده. فقط برو.",
      },
      {
        number: "05",
        title: "CYPHER",
        title2: "III+",
        subtitle: "Advanced motorcycle performance customization.",
        titleLocal: "CYPHER III+",
        subtitleLocal: "سفارشی‌سازی عملکرد موتورسیکلت پیشرفته",
      },
      {
        number: "06",
        title: "INSTANT",
        title2: "TORQUE",
        subtitle: "Up to 169 lb-ft of torque.",
        titleLocal: "گشتاور فوری",
        subtitleLocal: "تا 169 lb-ft گشتاور",
      },
    ],
  },
}

export function RotatingShowcaseSection({ language }: RotatingShowcaseSectionProps) {
  const t = translations[language]
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Rotate the motorcycle based on scroll
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360])

  // Group features into pairs (2 per screen)
  const featurePairs = []
  for (let i = 0; i < t.features.length; i += 2) {
    featurePairs.push([t.features[i], t.features[i + 1]])
  }

  return (
    <section ref={containerRef} className="relative bg-white">
      {/* Each screen shows 2 features */}
      {featurePairs.map((pair, pairIndex) => (
        <div key={pairIndex} className="relative h-screen flex items-center">
          <div className="container mx-auto px-8 md:px-16 lg:px-24 w-full">
            <div className="flex items-center justify-between">
              {/* Left side - 2 features stacked */}
              <div className="max-w-md space-y-12 text-left">
                {pair[0] && (
                  <div>
                    <span className="text-xs md:text-sm font-medium text-gray-400 tracking-wider block mb-3">
                      {pair[0].number}
                    </span>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
                      {pair[0].titleLocal}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      {pair[0].subtitleLocal}
                    </p>
                  </div>
                )}
              </div>

              {/* Right side - 2 features stacked */}
              <div className="max-w-md space-y-12 text-right">
                {pair[1] && (
                  <div>
                    <span className="text-xs md:text-sm font-medium text-gray-400 tracking-wider block mb-3">
                      {pair[1].number}
                    </span>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
                      {pair[1].titleLocal}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      {pair[1].subtitleLocal}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Fixed motorcycle in center - overlays all sections */}
      <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
        {/* Switch between 3 bike images based on scroll with smooth animations */}
        {bikeImages.map((image, imgIndex) => {
          const start = imgIndex / bikeImages.length
          const end = (imgIndex + 1) / bikeImages.length

          const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0])
          const scale = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0.8, 1, 1, 0.8])
          const y = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [50, 0, 0, -50])

          return (
            <motion.div
              key={imgIndex}
              style={{ opacity, scale, y }}
              className="absolute"
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <img
                src={image}
                alt={`Electric Motorcycle ${imgIndex + 1}`}
                className="w-[250px] md:w-[350px] lg:w-[450px] h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
