"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 25)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />

      <div className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter">
            <span className="text-foreground">NANO</span>
            <span className="text-primary">BOT</span>
          </h1>
        </motion.div>

        <div className="w-64 mx-auto space-y-3">
          <div className="h-px bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Loading</p>
        </div>
      </div>
    </div>
  )
}
