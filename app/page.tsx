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
import { getHomeSettings, HomeSettings } from "@/lib/api/home-settings"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<"pashto" | "dari">("dari")
  const [openChat, setOpenChat] = useState<(() => void) | null>(null)
  const [homeSettings, setHomeSettings] = useState<HomeSettings | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const settings = await getHomeSettings()
        setHomeSettings(settings)
      } catch (error) {
        console.error("Error loading home settings:", error)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 2500)
      }
    }
    loadData()
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
        <HeroSection language={language} settings={homeSettings?.hero} />
        {homeSettings?.show_models_showcase_section !== false && (
          <ModelsShowcaseSection language={language} models={homeSettings?.model_showcases} />
        )}
        <ScrollZoomSection imageUrl={homeSettings?.hero?.scroll_zoom_image_url} />
        {homeSettings?.show_products_section && (
          <ProductsGridSection 
            language={language} 
            settings={{
              title_dari: homeSettings.products_title_dari,
              title_pashto: homeSettings.products_title_pashto,
              subtitle_dari: homeSettings.products_subtitle_dari,
              subtitle_pashto: homeSettings.products_subtitle_pashto
            }}
          />
        )}
        {homeSettings?.show_features_section && (
          <FeaturesShowcaseSection language={language} features={homeSettings.features} />
        )}
        {homeSettings?.show_contact_section && (
          <ContactMapSection language={language} settings={homeSettings?.contact} />
        )}
      </main>
      <Footer language={language} />
      <LiveChat language={language} onOpenRef={handleSetOpenChat} />
    </div>
  )
}
