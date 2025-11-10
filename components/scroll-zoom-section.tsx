"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ScrollZoomSectionProps {
  imageUrl?: string
}

export function ScrollZoomSection({ imageUrl = "/images/IMG-20251021-WA0010.jpg" }: ScrollZoomSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.2])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section ref={containerRef} className="relative min-h-screen bg-black flex items-center justify-center">
      <motion.div
        style={{ scale, opacity }}
        className="w-full max-w-4xl px-8"
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={imageUrl}
            alt="Electric Motorcycle in Action"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  )
}
