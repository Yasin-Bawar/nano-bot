"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { ModelsShowcaseSection } from "@/components/models-showcase-section"
import { RotatingShowcaseSection } from "@/components/rotating-showcase-section"
import { AccessoriesSection } from "@/components/accessories-section"
import { ScrollZoomSection } from "@/components/scroll-zoom-section"
import { ProductsGridSection } from "@/components/products-grid-section"
import { FeaturesShowcaseSection } from "@/components/features-showcase-section"
import { ContactMapSection } from "@/components/contact-map-section"
import { LiveChat } from "@/components/live-chat"
import { TechnologySection } from "@/components/technology-section"
import { SustainabilitySection } from "@/components/sustainability-section"
import { DealershipSection } from "@/components/dealership-section"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { LoadingScreen } from "@/components/loading-screen"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<"pashto" | "dari">("dari")
  const [openChat, setOpenChat] = useState<(() => void) | null>(null)

  useEffect(() => {
    // Simulate loading screen
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  // Prevent auto-opening by ensuring openChat is only set once
  const handleSetOpenChat = (fn: () => void) => {
    if (!openChat) {
      setOpenChat(() => fn)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className={language === "pashto" || language === "dari" ? "rtl" : "ltr"}>
      <Navigation 
        language={language} 
        setLanguage={setLanguage}
        onOpenChat={() => openChat && openChat()}
      />
      <main>
        <HeroSection language={language} />
        <ModelsShowcaseSection language={language} />
        <ScrollZoomSection />
        <ProductsGridSection language={language} />
        <FeaturesShowcaseSection language={language} />
        <ContactMapSection language={language} />
        {/* <RotatingShowcaseSection language={language} />
        <AccessoriesSection language={language} />
        <TechnologySection language={language} />
        <SustainabilitySection language={language} />
        <DealershipSection language={language} /> */}
      </main>
      <Footer language={language} />
      <LiveChat language={language} onOpenRef={handleSetOpenChat} />
    </div>
  )
}
