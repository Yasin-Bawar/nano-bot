import { supabase } from "@/lib/supabase"

export interface HeroSettings {
  tagline_dari: string
  tagline_pashto: string
  subtitle_dari: string
  subtitle_pashto: string
  image_url: string
  scroll_zoom_image_url: string
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

export interface ShowcaseFeature {
  id?: string
  number: string
  title_en: string
  title_dari: string
  title_pashto: string
  subtitle_en: string
  subtitle_dari: string
  subtitle_pashto: string
  order_index: number
}

export interface ModelShowcase {
  id?: string
  name: string
  range: string
  charge: string
  speed: string
  bg_color: string
  image_url: string
  order_index: number
}

export interface ContactSettings {
  title_dari: string
  title_pashto: string
  subtitle_dari: string
  subtitle_pashto: string
  address_dari: string
  address_pashto: string
  address_detail_dari: string
  address_detail_pashto: string
  phone: string
  email: string
  hours_dari: string
  hours_pashto: string
  hours_detail_dari: string
  hours_detail_pashto: string
}

export interface HomeSettings {
  hero: HeroSettings
  features: FeatureItem[]
  showcase_features: ShowcaseFeature[]
  model_showcases: ModelShowcase[]
  featured_product_ids: string[]
  contact: ContactSettings
  products_title_dari: string
  products_title_pashto: string
  products_subtitle_dari: string
  products_subtitle_pashto: string
  show_products_section: boolean
  show_features_section: boolean
  show_contact_section: boolean
  show_showcase_section: boolean
  show_models_showcase_section: boolean
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

    // Get showcase features
    const { data: showcaseData, error: showcaseError } = await supabase
      .from("home_showcase_features")
      .select("*")
      .order("order_index", { ascending: true })

    if (showcaseError && showcaseError.code !== "PGRST116") {
      console.warn("Showcase features table may not exist yet:", showcaseError)
    }

    // Get model showcases
    const { data: modelsData, error: modelsError } = await supabase
      .from("home_models_showcase")
      .select("*")
      .order("order_index", { ascending: true })

    if (modelsError) {
      console.error("Error loading model showcases:", modelsError)
    } else {
      console.log("Loaded model showcases from DB:", modelsData)
    }

    // Get featured products
    const { data: featuredProductsData, error: featuredError } = await supabase
      .from("home_featured_products")
      .select("product_id")
      .order("order_index", { ascending: true })

    const featuredProductIds = featuredProductsData?.map(fp => fp.product_id) || []

    if (featuredError && featuredError.code !== "PGRST116" && featuredError.code !== "42P01") {
      console.warn("Error loading featured products:", featuredError)
    }

    // Get section settings
    const { data: sectionData, error: sectionError } = await supabase
      .from("home_section_settings")
      .select("*")
      .single()

    if (sectionError && sectionError.code !== "PGRST116") {
      throw sectionError
    }

    // Get visibility settings
    const { data: visibilityData, error: visibilityError } = await supabase
      .from("home_visibility")
      .select("*")
      .single()

    if (visibilityError && visibilityError.code !== "PGRST116") {
      console.warn("Visibility table may not exist yet:", visibilityError)
    }

    // Get contact settings
    const { data: contactData, error: contactError } = await supabase
      .from("home_contact_settings")
      .select("*")
      .single()

    if (contactError && contactError.code !== "PGRST116") {
      console.warn("Contact settings table may not exist yet:", contactError)
    }

    // Return default values if no data exists
    return {
      hero: heroData || {
        tagline_dari: "آینده سواری الکتریکی",
        tagline_pashto: "د بریښنایی سواری راتلونکی",
        subtitle_dari: "طراحی شده برای افغانستان - پاک، خاموش، قدرتمند",
        subtitle_pashto: "د افغانستان لپاره ډیزاین شوی - پاک، خاموش، ځواکمن",
        image_url: "/images/hero.jpg",
        scroll_zoom_image_url: "/images/IMG-20251021-WA0010.jpg",
        range_value: "220",
        speed_value: "180",
        charge_value: "1.5",
        colors: ["#000000", "#DC2626", "#2563EB", "#FFFFFF", "#9CA3AF", "#1F2937"],
        cta_text_dari: "مشاهده مدل‌ها",
        cta_text_pashto: "ماډلونه وګورئ"
      },
      features: featuresData || [],
      showcase_features: showcaseData || [],
      model_showcases: modelsData || [],
      featured_product_ids: featuredProductIds,
      contact: contactData || {
        title_dari: "با ما تماس بگیرید",
        title_pashto: "زموږ سره اړیکه ونیسئ",
        subtitle_dari: "ما اینجا هستیم تا به شما خدمت کنیم",
        subtitle_pashto: "موږ ستاسو د خدمت لپاره دلته یو",
        address_dari: "شهر هرات، افغانستان",
        address_pashto: "د هرات ښار، افغانستان",
        address_detail_dari: "بازار مرکزی هرات، فروشگاه موتورسیکلت",
        address_detail_pashto: "د هرات مرکزي بازار، د موټرسایکل پلورنځي",
        phone: "+93 799 123 456",
        email: "info@electricbikes.af",
        hours_dari: "هفته: 8:00 - 18:00",
        hours_pashto: "اونۍ: 8:00 - 18:00",
        hours_detail_dari: "شنبه تا پنجشنبه",
        hours_detail_pashto: "شنبه تر پنجشنبه"
      },
      products_title_dari: sectionData?.products_title_dari || "محصولات ما",
      products_title_pashto: sectionData?.products_title_pashto || "زموږ محصولات",
      products_subtitle_dari: sectionData?.products_subtitle_dari || "موتورسیکلت‌های برقی و قطعات",
      products_subtitle_pashto: sectionData?.products_subtitle_pashto || "بریښنایی موټرسایکلونه او برخې",
      show_products_section: sectionData?.show_products_section ?? true,
      show_features_section: sectionData?.show_features_section ?? true,
      show_contact_section: visibilityData?.show_contact_section ?? true,
      show_showcase_section: visibilityData?.show_showcase_section ?? true,
      show_models_showcase_section: visibilityData?.show_models_showcase_section ?? true
    }
  } catch (error) {
    console.error("Error fetching home settings:", error)
    throw error
  }
}

// Update home page settings
export async function updateHomeSettings(settings: HomeSettings): Promise<void> {
  try {
    console.log("Step 1: Updating hero settings...")
    // Update hero settings
    const { error: heroError } = await supabase
      .from("home_hero_settings")
      .upsert({
        id: 1,
        ...settings.hero,
        updated_at: new Date().toISOString()
      })

    if (heroError) {
      console.error("Hero settings error:", heroError)
      throw heroError
    }
    console.log("✅ Hero settings updated")

    console.log("Step 2: Deleting old features...")
    // Delete existing features and insert new ones
    const { error: deleteError } = await supabase
      .from("home_features")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

    if (deleteError) {
      console.error("Delete features error:", deleteError)
      throw deleteError
    }
    console.log("✅ Old features deleted")

    console.log("Step 3: Inserting new features...")
    // Insert features
    if (settings.features.length > 0) {
      const featuresToInsert = settings.features.map(f => {
        const { id, ...featureWithoutId } = f
        return featureWithoutId
      })

      const { error: featuresError } = await supabase
        .from("home_features")
        .insert(featuresToInsert)

      if (featuresError) {
        console.error("Insert features error:", featuresError)
        throw featuresError
      }
      console.log("✅ Features inserted")
    }

    // Delete existing showcase features and insert new ones
    const { error: deleteShowcaseError } = await supabase
      .from("home_showcase_features")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

    if (deleteShowcaseError && deleteShowcaseError.code !== "42P01") {
      // Ignore if table doesn't exist
      console.warn("Could not delete showcase features:", deleteShowcaseError)
    }

    console.log("Step 4: Inserting showcase features...")
    // Insert showcase features
    if (settings.showcase_features.length > 0) {
      const showcaseToInsert = settings.showcase_features.map(f => {
        const { id, ...featureWithoutId } = f
        return featureWithoutId
      })

      const { error: showcaseError } = await supabase
        .from("home_showcase_features")
        .insert(showcaseToInsert)

      if (showcaseError && showcaseError.code !== "42P01") {
        console.error("Insert showcase features error:", showcaseError)
        // Don't throw, just warn
        console.warn("Could not insert showcase features:", showcaseError)
      } else {
        console.log("✅ Showcase features inserted")
      }
    }

    // Delete existing model showcases and insert new ones
    const { error: deleteModelsError } = await supabase
      .from("home_models_showcase")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

    if (deleteModelsError && deleteModelsError.code !== "42P01") {
      console.warn("Could not delete model showcases:", deleteModelsError)
      if (deleteModelsError.code === "42P01") {
        console.error("❌ Table 'home_models_showcase' does not exist! Please run add-models-showcase.sql")
      }
    }

    console.log("Step 5: Inserting model showcases...")
    // Insert model showcases
    if (settings.model_showcases && settings.model_showcases.length > 0) {
      const dataToInsert = settings.model_showcases.map(m => {
        const { id, ...modelWithoutId } = m
        return {
          name: modelWithoutId.name,
          range: modelWithoutId.range,
          charge: modelWithoutId.charge,
          speed: modelWithoutId.speed,
          bg_color: modelWithoutId.bg_color,
          image_url: modelWithoutId.image_url,
          order_index: modelWithoutId.order_index
        }
      })

      console.log("Inserting model showcases:", dataToInsert)

      const { data: insertedData, error: modelsError } = await supabase
        .from("home_models_showcase")
        .insert(dataToInsert)
        .select()

      if (modelsError) {
        console.error("Error inserting model showcases:", modelsError)
        console.error("Error details:", {
          message: modelsError.message,
          details: modelsError.details,
          hint: modelsError.hint,
          code: modelsError.code
        })
        if (modelsError.code === "42P01") {
          throw new Error("Table 'home_models_showcase' does not exist! Please run add-models-showcase.sql in Supabase SQL Editor")
        }
        // Don't throw on other errors, just log them
        console.warn("Could not insert model showcases, but continuing...")
      } else {
        console.log("✅ Model showcases saved successfully:", insertedData)
      }
    }

    console.log("Step 6: Updating section settings...")
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
        updated_at: new Date().toISOString()
      })

    if (sectionError) throw sectionError
    console.log("✅ Section settings updated")

    console.log("Step 7: Updating contact settings...")
    // Update contact settings
    const { error: contactError } = await supabase
      .from("home_contact_settings")
      .upsert({
        id: 1,
        ...settings.contact,
        updated_at: new Date().toISOString()
      })

    if (contactError && contactError.code !== "42P01") {
      console.warn("Could not update contact settings:", contactError)
    } else {
      console.log("✅ Contact settings updated")
    }

    // Update visibility settings
    const { error: visibilityError } = await supabase
      .from("home_visibility")
      .upsert({
        id: 1,
        show_contact_section: settings.show_contact_section,
        show_showcase_section: settings.show_showcase_section,
        show_models_showcase_section: settings.show_models_showcase_section,
        updated_at: new Date().toISOString()
      })

    if (visibilityError && visibilityError.code !== "42P01") {
      // Ignore if table doesn't exist
      console.warn("Could not update visibility settings:", visibilityError)
    }

    // Update featured products
    // First, delete all existing featured products
    const { error: deleteFeaturedError } = await supabase
      .from("home_featured_products")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteFeaturedError && deleteFeaturedError.code !== "42P01") {
      console.warn("Could not delete featured products:", deleteFeaturedError)
    }

    // Then insert new featured products
    if (settings.featured_product_ids && settings.featured_product_ids.length > 0) {
      const featuredProductsToInsert = settings.featured_product_ids.map((productId, index) => ({
        product_id: productId,
        order_index: index
      }))

      const { error: insertFeaturedError } = await supabase
        .from("home_featured_products")
        .insert(featuredProductsToInsert)

      if (insertFeaturedError && insertFeaturedError.code !== "42P01") {
        console.warn("Could not insert featured products:", insertFeaturedError)
      } else {
        console.log("✅ Featured products saved successfully")
      }
    }
  } catch (error: any) {
    console.error("Error updating home settings:", error)
    console.error("Error details:", {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      fullError: JSON.stringify(error, null, 2)
    })

    // Check if it's a specific table error
    if (error?.message?.includes('home_models_showcase')) {
      throw new Error("Table 'home_models_showcase' error. Please run RUN_ALL_MIGRATIONS.sql")
    }
    if (error?.message?.includes('home_featured_products')) {
      throw new Error("Table 'home_featured_products' error. Please run RUN_ALL_MIGRATIONS.sql")
    }
    if (error?.message?.includes('home_showcase_features')) {
      throw new Error("Table 'home_showcase_features' error. Please run RUN_ALL_MIGRATIONS.sql")
    }

    throw new Error(error?.message || "Failed to save settings. Please check database permissions and run RUN_ALL_MIGRATIONS.sql")
  }
}

// Upload image to Supabase storage
export async function uploadImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `home/${fileName}`

    // Try to upload to 'images' bucket first, if it fails, try 'home-images'
    let uploadError: any = null
    let bucketName = "images"

    const { error: err1 } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file)

    if (err1) {
      // Try alternative bucket name
      bucketName = "home-images"
      const { error: err2 } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file)

      if (err2) {
        uploadError = err2
      }
    }

    if (uploadError) {
      console.error("Upload error:", uploadError)
      throw new Error("Failed to upload image. Please ensure the storage bucket exists in Supabase.")
    }

    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}
