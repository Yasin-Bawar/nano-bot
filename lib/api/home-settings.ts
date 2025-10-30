import { supabase } from "@/lib/supabase"

export interface HeroSettings {
  tagline_dari: string
  tagline_pashto: string
  subtitle_dari: string
  subtitle_pashto: string
  image_url: string
  range_value: string
  speed_value: string
  charge_value: string
  colors: string[]
  cta_text_dari: string
  cta_text_pashto: string
}

export interface FeatureItem {
  id?: string
  title_dari: string
  title_pashto: string
  title_en: string
  description_dari: string
  description_pashto: string
  stat: string
  icon: string
  order_index: number
}

export interface HomeSettings {
  hero: HeroSettings
  features: FeatureItem[]
  products_title_dari: string
  products_title_pashto: string
  products_subtitle_dari: string
  products_subtitle_pashto: string
  show_products_section: boolean
  show_features_section: boolean
  show_contact_section: boolean
}

// Get home page settings
export async function getHomeSettings(): Promise<HomeSettings> {
  try {
    // Get hero settings
    const { data: heroData, error: heroError } = await supabase
      .from("home_hero_settings")
      .select("*")
      .single()

    if (heroError && heroError.code !== "PGRST116") {
      throw heroError
    }

    // Get features
    const { data: featuresData, error: featuresError } = await supabase
      .from("home_features")
      .select("*")
      .order("order_index", { ascending: true })

    if (featuresError) throw featuresError

    // Get section settings
    const { data: sectionData, error: sectionError } = await supabase
      .from("home_section_settings")
      .select("*")
      .single()

    if (sectionError && sectionError.code !== "PGRST116") {
      throw sectionError
    }

    // Return default values if no data exists
    return {
      hero: heroData || {
        tagline_dari: "آینده سواری الکتریکی",
        tagline_pashto: "د بریښنایی سواری راتلونکی",
        subtitle_dari: "طراحی شده برای افغانستان - پاک، خاموش، قدرتمند",
        subtitle_pashto: "د افغانستان لپاره ډیزاین شوی - پاک، خاموش، ځواکمن",
        image_url: "/images/hero.jpg",
        range_value: "220",
        speed_value: "180",
        charge_value: "1.5",
        colors: ["#000000", "#DC2626", "#2563EB", "#FFFFFF", "#9CA3AF", "#1F2937"],
        cta_text_dari: "مشاهده مدل‌ها",
        cta_text_pashto: "ماډلونه وګورئ"
      },
      features: featuresData || [],
      products_title_dari: sectionData?.products_title_dari || "محصولات ما",
      products_title_pashto: sectionData?.products_title_pashto || "زموږ محصولات",
      products_subtitle_dari: sectionData?.products_subtitle_dari || "موتورسیکلت‌های برقی و قطعات",
      products_subtitle_pashto: sectionData?.products_subtitle_pashto || "بریښنایی موټرسایکلونه او برخې",
      show_products_section: sectionData?.show_products_section ?? true,
      show_features_section: sectionData?.show_features_section ?? true,
      show_contact_section: sectionData?.show_contact_section ?? true
    }
  } catch (error) {
    console.error("Error fetching home settings:", error)
    throw error
  }
}

// Update home page settings
export async function updateHomeSettings(settings: HomeSettings): Promise<void> {
  try {
    // Update hero settings
    const { error: heroError } = await supabase
      .from("home_hero_settings")
      .upsert({
        id: 1,
        ...settings.hero,
        updated_at: new Date().toISOString()
      })

    if (heroError) throw heroError

    // Delete existing features and insert new ones
    const { error: deleteError } = await supabase
      .from("home_features")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

    if (deleteError) throw deleteError

    // Insert features
    if (settings.features.length > 0) {
      const { error: featuresError } = await supabase
        .from("home_features")
        .insert(settings.features.map(f => ({
          ...f,
          id: undefined // Let database generate ID
        })))

      if (featuresError) throw featuresError
    }

    // Update section settings
    const { error: sectionError } = await supabase
      .from("home_section_settings")
      .upsert({
        id: 1,
        products_title_dari: settings.products_title_dari,
        products_title_pashto: settings.products_title_pashto,
        products_subtitle_dari: settings.products_subtitle_dari,
        products_subtitle_pashto: settings.products_subtitle_pashto,
        show_products_section: settings.show_products_section,
        show_features_section: settings.show_features_section,
        show_contact_section: settings.show_contact_section,
        updated_at: new Date().toISOString()
      })

    if (sectionError) throw sectionError
  } catch (error) {
    console.error("Error updating home settings:", error)
    throw error
  }
}

// Upload image to Supabase storage
export async function uploadImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `home/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}
