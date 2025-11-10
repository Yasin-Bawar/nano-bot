"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/x9k2m7p4q8w5n3j6/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Plus, Trash2, ImageIcon, Settings, Eye, Package, Star } from "lucide-react"
import { getHomeSettings, updateHomeSettings, uploadImage } from "@/lib/api/home-settings"
import { toast } from "sonner"

interface HeroSettings {
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

interface FeatureItem {
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

interface ShowcaseFeature {
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

interface ModelShowcase {
  id?: string
  name: string
  range: string
  charge: string
  speed: string
  bg_color: string
  image_url: string
  order_index: number
}

interface ContactSettings {
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

interface HeaderSettings {
  logo_url: string
  logo_dark_url: string
  site_name_dari: string
  site_name_pashto: string
  tagline_dari: string
  tagline_pashto: string
  show_language_selector: boolean
  show_search: boolean
  sticky_header: boolean
}

interface FooterSettings {
  company_name_dari: string
  company_name_pashto: string
  description_dari: string
  description_pashto: string
  logo_url: string
  address_dari: string
  address_pashto: string
  phone: string
  email: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  youtube_url: string
  whatsapp_number: string
  copyright_text_dari: string
  copyright_text_pashto: string
  show_social_links: boolean
  show_newsletter: boolean
}

interface HomeSettings {
  hero: HeroSettings
  header: HeaderSettings
  footer: FooterSettings
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

export default function HomeSettingsPage() {
  const [settings, setSettings] = useState<HomeSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("hero")
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    loadSettings()
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoadingProducts(true)
    try {
      const { getProducts } = await import('@/lib/api/products')
      const products = await getProducts()
      setAllProducts(products)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoadingProducts(false)
    }
  }

  async function loadSettings() {
    try {
      const data = await getHomeSettings()
      console.log("Loaded settings:", data)
      console.log("Model showcases:", data.model_showcases)
      console.log("Featured product IDs:", data.featured_product_ids)
      setSettings(data)
      setSelectedProductIds(data.featured_product_ids || [])
    } catch (error) {
      console.error("Error loading settings:", error)
      toast.error("خطا در بارگذاری تنظیمات")
      setSettings({
        hero: {
          tagline_dari: "آینده سواری الکتریکی",
          tagline_pashto: "د بریښنایی سواری راتلونکی",
          subtitle_dari: "طراحی شده برای افغانستان",
          subtitle_pashto: "د افغانستان لپاره ډیزاین شوی",
          image_url: "/images/hero.jpg",
          scroll_zoom_image_url: "/images/IMG-20251021-WA0010.jpg",
          range_value: "220",
          speed_value: "180",
          charge_value: "1.5",
          colors: ["#000000", "#DC2626", "#2563EB"],
          cta_text_dari: "مشاهده مدل‌ها",
          cta_text_pashto: "ماډلونه وګورئ"
        },
        header: {
          logo_url: "/images/logo.png",
          logo_dark_url: "",
          site_name_dari: "موتورسیکلت‌های برقی",
          site_name_pashto: "بریښنایی موټرسایکلونه",
          tagline_dari: "آینده سواری الکتریکی",
          tagline_pashto: "د بریښنایی سواری راتلونکی",
          show_language_selector: true,
          show_search: true,
          sticky_header: true
        },
        footer: {
          company_name_dari: "موتورسیکلت‌های برقی افغانستان",
          company_name_pashto: "د افغانستان بریښنایی موټرسایکلونه",
          description_dari: "ما بهترین موتورسیکلت‌های برقی را فراهم می‌کنیم",
          description_pashto: "موږ غوره بریښنایی موټرسایکلونه چمتو کوو",
          hours_pa: "/imagesۍ: 8o.png",
          addrs_detail: "شهر هرات، افغانستان",
          address_pashto: "د هرات ښار، افغانستان",
          phone: "+93 799 123 456",
          email: "info@electricbikes.af",
          facebook_url: "",
          instagram_url: "",
          twitter_url: "",
          youtube_url: "",
          whatsapp_number: "",
          copyright_text_dari: "© 2024 تمامی حقوق محفوظ است",
          copyright_text_pashto: "© 2024 ټول حقونه خوندي دي",
          show_social_links: true,
          show_newsletter: true
        },
        features: [],
        showcase_features: [],
        model_showcases: [],
        featured_product_ids: [],
        contact: {
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
        products_title_dari: "محصولات ما",
        products_title_pashto: "زموږ محصولات",
        products_subtitle_dari: "موتورسیکلت‌های برقی",
        products_subtitle_pashto: "بریښنایی موټرسایکلونه",
        show_products_section: true,
        show_features_section: true,
        show_contact_section: true,
        show_showcase_section: true,
        show_models_showcase_section: true
      })
      setSelectedProductIds([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    try {
      const settingsToSave = {
        ...settings,
        featured_product_ids: selectedProductIds
      }
      console.log("Saving settings:", settingsToSave)
      await updateHomeSettings(settingsToSave)
      toast.success("✅ تنظیمات با موفقیت ذخیره شد!")
      // Reload settings to confirm save
      await loadSettings()
    } catch (error) {
      console.error("Save error:", error)
      toast.error("❌ خطا در ذخیره تنظیمات")
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !settings) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      setSettings({
        ...settings,
        hero: { ...settings.hero, image_url: url }
      })
      toast.success("✅ تصویر آپلود شد! حالا دکمه 'ذخیره تغییرات' را بزنید")
    } catch (error) {
      toast.error("❌ خطا در آپلود تصویر")
    } finally {
      setUploading(false)
    }
  }

  function addFeature() {
    if (!settings) return
    const newFeature: FeatureItem = {
      title_dari: "",
      title_pashto: "",
      title_en: "",
      description_dari: "",
      description_pashto: "",
      stat: "",
      icon: "Battery",
      order_index: settings.features.length
    }
    setSettings({
      ...settings,
      features: [...settings.features, newFeature]
    })
  }

  function removeFeature(index: number) {
    if (!settings) return
    setSettings({
      ...settings,
      features: settings.features.filter((_, i) => i !== index)
    })
  }

  function updateFeature(index: number, field: keyof FeatureItem, value: any) {
    if (!settings) return
    const updatedFeatures = [...settings.features]
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value }
    setSettings({
      ...settings,
      features: updatedFeatures
    })
  }

  function addShowcaseFeature() {
    if (!settings) return
    const currentFeatures = settings.showcase_features || []
    const newFeature: ShowcaseFeature = {
      number: String(currentFeatures.length + 1).padStart(2, '0'),
      title_en: "",
      title_dari: "",
      title_pashto: "",
      subtitle_en: "",
      subtitle_dari: "",
      subtitle_pashto: "",
      order_index: currentFeatures.length
    }
    setSettings({
      ...settings,
      showcase_features: [...currentFeatures, newFeature]
    })
  }

  function removeShowcaseFeature(index: number) {
    if (!settings || !settings.showcase_features) return
    setSettings({
      ...settings,
      showcase_features: settings.showcase_features.filter((_, i) => i !== index)
    })
  }

  function updateShowcaseFeature(index: number, field: keyof ShowcaseFeature, value: any) {
    if (!settings || !settings.showcase_features) return
    const updatedFeatures = [...settings.showcase_features]
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value }
    setSettings({
      ...settings,
      showcase_features: updatedFeatures
    })
  }

  function addModelShowcase() {
    if (!settings) return
    const currentModels = settings.model_showcases || []
    const newModel: ModelShowcase = {
      name: "",
      range: "",
      charge: "",
      speed: "",
      bg_color: "#4A5A6A",
      image_url: "/images/bike-blue-silver.png",
      order_index: currentModels.length
    }
    setSettings({
      ...settings,
      model_showcases: [...currentModels, newModel]
    })
  }

  function removeModelShowcase(index: number) {
    if (!settings || !settings.model_showcases) return
    setSettings({
      ...settings,
      model_showcases: settings.model_showcases.filter((_, i) => i !== index)
    })
  }

  function updateModelShowcase(index: number, field: keyof ModelShowcase, value: any) {
    if (!settings || !settings.model_showcases) return
    const updatedModels = [...settings.model_showcases]
    updatedModels[index] = { ...updatedModels[index], [field]: value }
    setSettings({
      ...settings,
      model_showcases: updatedModels
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-600">در حال بارگذاری تنظیمات...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!settings) return null

  const tabConfig = [
    { id: "header", label: "هدر", icon: Settings },
    { id: "hero", label: "بخش اصلی", icon: Settings },
    { id: "models", label: "مدل‌های موتور", icon: Package },
    { id: "features", label: "ویژگی‌ها", icon: Star },
    { id: "showcase", label: "نمایش چرخشی", icon: Package },
    { id: "products", label: "محصولات", icon: Package },
    { id: "contact", label: "تماس با ما", icon: Package },
    { id: "footer", label: "فوتر", icon: Package },
    { id: "visibility", label: "نمایش", icon: Eye }
  ]

  return (
    <AdminLayout>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-8" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-l from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-right space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                تنظیمات صفحه اصلی
              </h1>
              <p className="text-gray-600 text-base leading-relaxed">
                محتوای صفحه اصلی را ویرایش و مدیریت کنید. تغییرات را ذخیره کنید تا در سایت نمایش داده شوند.
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="gap-3 px-8 py-3 h-auto text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Save className="w-6 h-6" />
              <span>{saving ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg border-0">

              <CardContent className="p-4 space-y-2">
                {tabConfig.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl font-semibold transition-all duration-200 text-right ${activeTab === tab.id
                        ? "bg-primary text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <span className="flex-1 text-right">{tab.label}</span>
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Tab */}
            {activeTab === "hero" && (
              <div className="space-y-8">
                <Card className="shadow-lg border-0">

                  <CardContent className="p-8 space-y-8">
                    {/* Image Upload */}
                    <div className="space-y-4">
                      <Label className="text-right block text-lg font-semibold text-gray-700">
                        تصویر پس‌زمینه
                      </Label>
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary transition-colors">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploading}
                              className="hidden"
                              id="hero-image-upload"
                            />
                            <label
                              htmlFor="hero-image-upload"
                              className="cursor-pointer block space-y-3"
                            >
                              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                              <div>
                                <p className="text-gray-600 font-medium">
                                  {uploading ? "در حال آپلود..." : "کلیک برای آپلود تصویر"}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                  PNG, JPG, WEBM تا 10MB
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="flex-2 space-y-3">
                          {settings.hero.image_url && (
                            <>
                              <div className="relative group">
                                <img
                                  src={settings.hero.image_url}
                                  alt="Hero Preview"
                                  className="w-full max-w-md h-64 object-cover rounded-2xl border-4 border-gray-200 shadow-lg bg-white"
                                  onError={(e) => {
                                    console.error("Image failed to load:", settings.hero.image_url)
                                    e.currentTarget.style.display = 'none'
                                    const errorDiv = e.currentTarget.nextElementSibling as HTMLElement
                                    if (errorDiv) errorDiv.style.display = 'block'
                                  }}
                                  onLoad={(e) => {
                                    console.log("Image loaded:", settings.hero.image_url)
                                    e.currentTarget.style.display = 'block'
                                    const errorDiv = e.currentTarget.nextElementSibling as HTMLElement
                                    if (errorDiv) errorDiv.style.display = 'none'
                                  }}
                                />
                                <div style={{ display: 'none' }} className="w-full max-w-md h-64 bg-red-50 border-4 border-red-200 rounded-2xl flex items-center justify-center">
                                  <div className="text-center text-red-600">
                                    <p className="font-bold">❌ خطا در بارگذاری تصویر</p>
                                    <p className="text-sm mt-2">URL ممکن است اشتباه باشد</p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-600 text-right font-mono break-all">
                                  URL: {settings.hero.image_url}
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Scroll Zoom Image */}
                    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg">
                      <div className="flex items-center justify-between">
                        <Label className="text-right block text-xl font-bold text-gray-800">
                          تصویر بخش سوم (Scroll Zoom)
                        </Label>
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                          بخش ۳
                        </div>
                      </div>

                      {/* Large Preview */}
                      {settings.hero.scroll_zoom_image_url && (
                        <div className="bg-black rounded-2xl p-4 shadow-2xl">
                          <div className="relative aspect-video rounded-xl overflow-hidden">
                            <img
                              src={settings.hero.scroll_zoom_image_url}
                              alt="Scroll Zoom Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const errorDiv = e.currentTarget.nextElementSibling as HTMLElement
                                if (errorDiv) errorDiv.style.display = 'flex'
                              }}
                            />
                            <div style={{ display: 'none' }} className="w-full h-full bg-red-50 flex items-center justify-center">
                              <div className="text-center text-red-600">
                                <p className="font-bold">❌ خطا در بارگذاری تصویر</p>
                              </div>
                            </div>
                          </div>
                          <p className="text-white text-center mt-3 text-sm opacity-75">
                            پیش‌نمایش: این تصویر در بخش سوم صفحه اصلی نمایش داده می‌شود
                          </p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Upload Box */}
                        <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-primary transition-colors bg-white shadow-md">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setUploading(true)
                              try {
                                const url = await uploadImage(file)
                                setSettings({
                                  ...settings,
                                  hero: { ...settings.hero, scroll_zoom_image_url: url }
                                })
                                toast.success("✅ تصویر آپلود شد!")
                              } catch (error) {
                                toast.error("❌ خطا در آپلود تصویر")
                              } finally {
                                setUploading(false)
                              }
                            }}
                            disabled={uploading}
                            className="hidden"
                            id="scroll-zoom-image-upload"
                          />
                          <label
                            htmlFor="scroll-zoom-image-upload"
                            className="cursor-pointer block space-y-3"
                          >
                            <ImageIcon className="w-16 h-16 text-blue-400 mx-auto" />
                            <div>
                              <p className="text-gray-700 font-bold text-lg">
                                {uploading ? "در حال آپلود..." : "آپلود تصویر جدید"}
                              </p>
                              <p className="text-gray-500 text-sm mt-2">
                                PNG, JPG, WEBP تا 10MB
                              </p>
                              <p className="text-blue-600 text-xs mt-2 font-semibold">
                                کلیک کنید یا فایل را بکشید
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* URL Input */}
                        <div className="space-y-3">
                          <Label className="text-right block font-semibold text-gray-700">
                            یا URL تصویر را وارد کنید
                          </Label>
                          <Input
                            value={settings.hero.scroll_zoom_image_url}
                            onChange={(e) => setSettings({
                              ...settings,
                              hero: { ...settings.hero, scroll_zoom_image_url: e.target.value }
                            })}
                            className="text-left text-sm p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors font-mono h-auto"
                            dir="ltr"
                            placeholder="/images/IMG-20251021-WA0010.jpg"
                          />
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600 text-right leading-relaxed">
                              💡 <span className="font-semibold">نکته:</span> این تصویر در بخش سوم صفحه اصلی با افکت زوم نمایش داده می‌شود. بهترین اندازه: 1920x1080 پیکسل
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Taglines */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-right block font-semibold text-gray-700 text-lg">
                          عنوان اصلی (دری)
                        </Label>
                        <Input
                          value={settings.hero.tagline_dari}
                          onChange={(e) => setSettings({
                            ...settings,
                            hero: { ...settings.hero, tagline_dari: e.target.value }
                          })}
                          className="text-right text-lg p-4 h-16 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                          placeholder="عنوان صفحه به زبان دری"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block font-semibold text-gray-700 text-lg">
                          عنوان اصلی (پشتو)
                        </Label>
                        <Input
                          value={settings.hero.tagline_pashto}
                          onChange={(e) => setSettings({
                            ...settings,
                            hero: { ...settings.hero, tagline_pashto: e.target.value }
                          })}
                          className="text-right text-lg p-4 h-16 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                          placeholder="عنوان صفحه به زبان پشتو"
                        />
                      </div>
                    </div>

                    {/* Subtitles */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-right block font-semibold text-gray-700">
                          زیرعنوان (دری)
                        </Label>
                        <Textarea
                          value={settings.hero.subtitle_dari}
                          onChange={(e) => setSettings({
                            ...settings,
                            hero: { ...settings.hero, subtitle_dari: e.target.value }
                          })}
                          className="text-right p-4 min-h-[120px] border-2 border-gray-200 rounded-xl focus:border-primary transition-colors resize-none"
                          dir="rtl"
                          placeholder="توضیحات تکمیلی به زبان دری"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block font-semibold text-gray-700">
                          زیرعنوان (پشتو)
                        </Label>
                        <Textarea
                          value={settings.hero.subtitle_pashto}
                          onChange={(e) => setSettings({
                            ...settings,
                            hero: { ...settings.hero, subtitle_pashto: e.target.value }
                          })}
                          className="text-right p-4 min-h-[120px] border-2 border-gray-200 rounded-xl focus:border-primary transition-colors resize-none"
                          dir="rtl"
                          placeholder="توضیحات تکمیلی به زبان پشتو"
                        />
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gradient-to-l from-blue-50 to-indigo-50 rounded-2xl p-8">
                      <h3 className="text-right text-xl font-bold text-gray-800 mb-6">مشخصات فنی</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        {[
                          { key: "range_value", label: "برد (کیلومتر)", icon: "🚗" },
                          { key: "speed_value", label: "سرعت (کیلومتر/ساعت)", icon: "⚡" },
                          { key: "charge_value", label: "زمان شارژ (ساعت)", icon: "🔋" }
                        ].map((stat) => (
                          <div key={stat.key} className="space-y-3">
                            <Label className="text-right block font-semibold text-gray-700 flex items-center gap-2 justify-end">
                              <span>{stat.icon}</span>
                              {stat.label}
                            </Label>
                            <Input
                              value={settings.hero[stat.key as keyof HeroSettings] as string}
                              onChange={(e) => setSettings({
                                ...settings,
                                hero: { ...settings.hero, [stat.key]: e.target.value }
                              })}
                              className="text-center text-xl font-bold p-4 h-16 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div className="space-y-4 bg-gray-50 p-6 rounded-xl">
                      <Label className="text-right block font-semibold text-gray-900 text-lg">
                        رنگ‌های موجود
                      </Label>
                      <div className="space-y-4">
                        {/* Color Grid */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {settings.hero.colors.map((color, index) => (
                            <div key={index} className="relative group">
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                  const newColors = [...settings.hero.colors]
                                  newColors[index] = e.target.value
                                  setSettings({
                                    ...settings,
                                    hero: { ...settings.hero, colors: newColors }
                                  })
                                }}
                                className="w-full h-16 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-primary transition-colors"
                              />
                              <button
                                onClick={() => {
                                  const newColors = settings.hero.colors.filter((_, i) => i !== index)
                                  setSettings({
                                    ...settings,
                                    hero: { ...settings.hero, colors: newColors }
                                  })
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                              >
                                ×
                              </button>
                              <p className="text-xs text-center mt-1 text-gray-600 font-mono">{color}</p>
                            </div>
                          ))}
                          {/* Add Color Button */}
                          <button
                            onClick={() => {
                              setSettings({
                                ...settings,
                                hero: { ...settings.hero, colors: [...settings.hero.colors, "#000000"] }
                              })
                            }}
                            className="h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-100 transition-all flex items-center justify-center text-gray-500 hover:text-primary"
                          >
                            <Plus className="w-6 h-6" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 text-right">
                          💡 کلیک کنید تا رنگ را تغییر دهید، یا دکمه + را برای افزودن رنگ جدید بزنید
                        </p>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-right block font-semibold text-gray-700">
                          متن دکمه اقدام (دری)
                        </Label>
                        <Input
                          value={settings.hero.cta_text_dari}
                          onChange={(e) => setSettings({
                            ...settings,
                            hero: { ...settings.hero, cta_text_dari: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                          placeholder="مشاهده مدل‌ها"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block font-semibold text-gray-700">
                          متن دکمه اقدام (پشتو)
                        </Label>
                        <Input
                          value={settings.hero.cta_text_pashto}
                          onChange={(e) => setSettings({
                            ...settings,
                            hero: { ...settings.hero, cta_text_pashto: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                          placeholder="ماډلونه وګورئ"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Models Tab */}
            {activeTab === "models" && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-right space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">مدل‌های موتورسیکلت</h2>
                    <p className="text-gray-600">مدل‌های SR/S, SR/F, S, DSR/X را مدیریت کنید</p>
                  </div>
                  <Button onClick={addModelShowcase} className="gap-3 px-6 py-3 h-auto shadow-lg">
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">افزودن مدل جدید</span>
                  </Button>
                </div>

                {!settings.model_showcases || settings.model_showcases.length === 0 ? (
                  <Card className="text-center py-16 border-2 border-dashed border-gray-200">
                    <CardContent className="space-y-4">
                      <Package className="w-16 h-16 text-gray-300 mx-auto" />
                      <h3 className="text-xl font-semibold text-gray-500">هنوز مدلی اضافه نکرده‌اید</h3>
                      <p className="text-gray-400">برای شروع، اولین مدل موتورسیکلت را اضافه کنید</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {settings.model_showcases?.map((model, index) => (
                      <Card key={index} className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">

                        <CardContent className="p-6 space-y-6">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-right text-xl flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <Package className="w-5 h-5 text-primary" />
                              </div>
                              مدل {model.name || `#${index + 1}`}
                            </CardTitle>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeModelShowcase(index)}
                              className="gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                نام مدل (مثال: SR/S)
                              </Label>
                              <Input
                                value={model.name}
                                onChange={(e) => updateModelShowcase(index, "name", e.target.value)}
                                className="text-center border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors font-bold text-2xl"
                                placeholder="SR/S"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                رنگ پس‌زمینه
                              </Label>
                              <div className="flex gap-3 items-center">
                                <input
                                  type="color"
                                  value={model.bg_color}
                                  onChange={(e) => updateModelShowcase(index, "bg_color", e.target.value)}
                                  className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                                />
                                <Input
                                  value={model.bg_color}
                                  onChange={(e) => updateModelShowcase(index, "bg_color", e.target.value)}
                                  className="text-left border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors font-mono"
                                  placeholder="#4A5A6A"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                برد (مایل)
                              </Label>
                              <Input
                                value={model.range}
                                onChange={(e) => updateModelShowcase(index, "range", e.target.value)}
                                className="text-center border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors font-bold text-xl"
                                placeholder="171"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                زمان شارژ (ساعت)
                              </Label>
                              <Input
                                value={model.charge}
                                onChange={(e) => updateModelShowcase(index, "charge", e.target.value)}
                                className="text-center border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors font-bold text-xl"
                                placeholder="1.1"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                سرعت (MPH)
                              </Label>
                              <Input
                                value={model.speed}
                                onChange={(e) => updateModelShowcase(index, "speed", e.target.value)}
                                className="text-center border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors font-bold text-xl"
                                placeholder="124"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-right block font-semibold text-gray-700">
                              تصویر موتورسیکلت
                            </Label>
                            <div className="flex gap-4 items-start">
                              {model.image_url && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={model.image_url}
                                    alt={model.name}
                                    className="w-40 h-40 object-contain rounded-lg border-2 border-gray-200 bg-gray-50 p-2"
                                  />
                                </div>
                              )}
                              <div className="flex-1 space-y-3">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (!file) return
                                      setUploading(true)
                                      try {
                                        const url = await uploadImage(file)
                                        updateModelShowcase(index, "image_url", url)
                                        toast.success("✅ تصویر آپلود شد!")
                                      } catch (error) {
                                        toast.error("❌ خطا در آپلود تصویر")
                                      } finally {
                                        setUploading(false)
                                      }
                                    }}
                                    disabled={uploading}
                                    className="hidden"
                                    id={`model-image-upload-${index}`}
                                  />
                                  <label
                                    htmlFor={`model-image-upload-${index}`}
                                    className="cursor-pointer block space-y-2"
                                  >
                                    <ImageIcon className="w-10 h-10 text-gray-400 mx-auto" />
                                    <div>
                                      <p className="text-gray-600 font-medium text-sm">
                                        {uploading ? "در حال آپلود..." : "کلیک برای آپلود تصویر"}
                                      </p>
                                      <p className="text-gray-500 text-xs mt-1">
                                        PNG, JPG, WEBP تا 10MB
                                      </p>
                                    </div>
                                  </label>
                                </div>
                                <Input
                                  value={model.image_url}
                                  onChange={(e) => updateModelShowcase(index, "image_url", e.target.value)}
                                  className="text-left border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors font-mono"
                                  dir="ltr"
                                  placeholder="/images/bike-blue-silver.png"
                                />
                                <p className="text-xs text-gray-500 text-right">
                                  💡 می‌توانید تصویر آپلود کنید یا URL را مستقیماً وارد کنید
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-right block font-semibold text-gray-700">
                              ترتیب نمایش
                            </Label>
                            <Input
                              type="number"
                              value={model.order_index}
                              onChange={(e) => updateModelShowcase(index, "order_index", parseInt(e.target.value))}
                              className="text-center border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors"
                              min="0"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Features Tab */}
            {activeTab === "features" && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-right space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">مدیریت ویژگی‌ها</h2>
                    <p className="text-gray-600">ویژگی‌ها و مشخصات محصولات را مدیریت کنید</p>
                  </div>
                  <Button onClick={addFeature} className="gap-3 px-6 py-3 h-auto shadow-lg">
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">افزودن ویژگی جدید</span>
                  </Button>
                </div>

                {settings.features.length === 0 ? (
                  <Card className="text-center py-16 border-2 border-dashed border-gray-200">
                    <CardContent className="space-y-4">
                      <Star className="w-16 h-16 text-gray-300 mx-auto" />
                      <h3 className="text-xl font-semibold text-gray-500">هنوز ویژگی‌ای اضافه نکرده‌اید</h3>
                      <p className="text-gray-400">برای شروع، اولین ویژگی را اضافه کنید</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {settings.features.map((feature, index) => (
                      <Card key={index} className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">

                        <CardContent className="p-6 space-y-6">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-right text-xl flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <Star className="w-5 h-5 text-primary" />
                              </div>
                              ویژگی {index + 1}
                            </CardTitle>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFeature(index)}
                              className="gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                عنوان (انگلیسی)
                              </Label>
                              <Input
                                value={feature.title_en}
                                onChange={(e) => updateFeature(index, "title_en", e.target.value)}
                                className="text-left border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors"
                                dir="ltr"
                                placeholder="Feature title in English"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                عنوان (دری)
                              </Label>
                              <Input
                                value={feature.title_dari}
                                onChange={(e) => updateFeature(index, "title_dari", e.target.value)}
                                className="text-right border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors"
                                dir="rtl"
                                placeholder="عنوان به زبان دری"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                عنوان (پشتو)
                              </Label>
                              <Input
                                value={feature.title_pashto}
                                onChange={(e) => updateFeature(index, "title_pashto", e.target.value)}
                                className="text-right border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors"
                                dir="rtl"
                                placeholder="عنوان به زبان پشتو"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                توضیحات (دری)
                              </Label>
                              <Textarea
                                value={feature.description_dari}
                                onChange={(e) => updateFeature(index, "description_dari", e.target.value)}
                                className="text-right border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors resize-none min-h-[100px]"
                                dir="rtl"
                                placeholder="توضیحات کامل به زبان دری"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                توضیحات (پشتو)
                              </Label>
                              <Textarea
                                value={feature.description_pashto}
                                onChange={(e) => updateFeature(index, "description_pashto", e.target.value)}
                                className="text-right border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors resize-none min-h-[100px]"
                                dir="rtl"
                                placeholder="توضیحات کامل به زبان پشتو"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                مقدار عددی
                              </Label>
                              <Input
                                value={feature.stat}
                                onChange={(e) => updateFeature(index, "stat", e.target.value)}
                                className="text-center border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors font-bold"
                                placeholder="220km"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                آیکون
                              </Label>
                              <select
                                value={feature.icon}
                                onChange={(e) => updateFeature(index, "icon", e.target.value)}
                                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-right focus:border-primary transition-colors"
                              >
                                <option value="Battery">🔋 باتری</option>
                                <option value="Zap">⚡ برق</option>
                                <option value="Gauge">📊 سرعت</option>
                                <option value="Shield">🛡️ سپر</option>
                                <option value="Wifi">📶 وای‌فای</option>
                                <option value="Leaf">🍃 برگ</option>
                              </select>
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                ترتیب نمایش
                              </Label>
                              <Input
                                type="number"
                                value={feature.order_index}
                                onChange={(e) => updateFeature(index, "order_index", parseInt(e.target.value))}
                                className="text-center border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors"
                                min="0"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Showcase Tab */}
            {activeTab === "showcase" && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-right space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">نمایش چرخشی محصول</h2>
                    <p className="text-gray-600">ویژگی‌های نمایش چرخشی موتورسیکلت را مدیریت کنید</p>
                  </div>
                  <Button onClick={addShowcaseFeature} className="gap-3 px-6 py-3 h-auto shadow-lg">
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">افزودن ویژگی جدید</span>
                  </Button>
                </div>

                {!settings.showcase_features || settings.showcase_features.length === 0 ? (
                  <Card className="text-center py-16 border-2 border-dashed border-gray-200">
                    <CardContent className="space-y-4">
                      <Package className="w-16 h-16 text-gray-300 mx-auto" />
                      <h3 className="text-xl font-semibold text-gray-500">هنوز ویژگی‌ای اضافه نکرده‌اید</h3>
                      <p className="text-gray-400">برای شروع، اولین ویژگی نمایش چرخشی را اضافه کنید</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {settings.showcase_features?.map((feature, index) => (
                      <Card key={index} className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">

                        <CardContent className="p-6 space-y-6">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-right text-xl flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <Package className="w-5 h-5 text-primary" />
                              </div>
                              ویژگی {feature.number}
                            </CardTitle>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeShowcaseFeature(index)}
                              className="gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                شماره ویژگی
                              </Label>
                              <Input
                                value={feature.number}
                                onChange={(e) => updateShowcaseFeature(index, "number", e.target.value)}
                                className="text-center border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors font-bold text-2xl"
                                placeholder="01"
                                maxLength={2}
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                ترتیب نمایش
                              </Label>
                              <Input
                                type="number"
                                value={feature.order_index}
                                onChange={(e) => updateShowcaseFeature(index, "order_index", parseInt(e.target.value))}
                                className="text-center border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors"
                                min="0"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                عنوان (انگلیسی)
                              </Label>
                              <Input
                                value={feature.title_en}
                                onChange={(e) => updateShowcaseFeature(index, "title_en", e.target.value)}
                                className="text-left border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors"
                                dir="ltr"
                                placeholder="RAPID CHARGING"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                عنوان (دری)
                              </Label>
                              <Input
                                value={feature.title_dari}
                                onChange={(e) => updateShowcaseFeature(index, "title_dari", e.target.value)}
                                className="text-right border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors"
                                dir="rtl"
                                placeholder="شارژ سریع"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                عنوان (پشتو)
                              </Label>
                              <Input
                                value={feature.title_pashto}
                                onChange={(e) => updateShowcaseFeature(index, "title_pashto", e.target.value)}
                                className="text-right border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors"
                                dir="rtl"
                                placeholder="چټک چارج"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                توضیحات (انگلیسی)
                              </Label>
                              <Textarea
                                value={feature.subtitle_en}
                                onChange={(e) => updateShowcaseFeature(index, "subtitle_en", e.target.value)}
                                className="text-left border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors resize-none min-h-[100px]"
                                dir="ltr"
                                placeholder="Full charge in as fast as 1hr."
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                توضیحات (دری)
                              </Label>
                              <Textarea
                                value={feature.subtitle_dari}
                                onChange={(e) => updateShowcaseFeature(index, "subtitle_dari", e.target.value)}
                                className="text-right border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors resize-none min-h-[100px]"
                                dir="rtl"
                                placeholder="شارژ کامل در 1 ساعت"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-right block font-semibold text-gray-700">
                                توضیحات (پشتو)
                              </Label>
                              <Textarea
                                value={feature.subtitle_pashto}
                                onChange={(e) => updateShowcaseFeature(index, "subtitle_pashto", e.target.value)}
                                className="text-right border-2 border-gray-200 rounded-xl p-3 focus:border-primary transition-colors resize-none min-h-[100px]"
                                dir="rtl"
                                placeholder="په 1 ساعت کې بشپړ چارج"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="space-y-8">
                <Card className="shadow-lg border-0">

                  <CardContent className="p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700 text-lg">
                          عنوان بخش (دری)
                        </Label>
                        <Input
                          value={settings.products_title_dari}
                          onChange={(e) => setSettings({
                            ...settings,
                            products_title_dari: e.target.value
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors text-lg"
                          dir="rtl"
                          placeholder="محصولات ما"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700 text-lg">
                          عنوان بخش (پشتو)
                        </Label>
                        <Input
                          value={settings.products_title_pashto}
                          onChange={(e) => setSettings({
                            ...settings,
                            products_title_pashto: e.target.value
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors text-lg"
                          dir="rtl"
                          placeholder="زموږ محصولات"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          زیرعنوان (دری)
                        </Label>
                        <Input
                          value={settings.products_subtitle_dari}
                          onChange={(e) => setSettings({
                            ...settings,
                            products_subtitle_dari: e.target.value
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                          placeholder="موتورسیکلت‌های برقی"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          زیرعنوان (پشتو)
                        </Label>
                        <Input
                          value={settings.products_subtitle_pashto}
                          onChange={(e) => setSettings({
                            ...settings,
                            products_subtitle_pashto: e.target.value
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                          placeholder="بریښنایی موټرسایکلونه"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Selector */}
                <Card className="shadow-lg border-0">

                  <CardContent className="p-8">
                    {loadingProducts ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-600 mt-4">در حال بارگذاری محصولات...</p>
                      </div>
                    ) : allProducts.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">هنوز محصولی اضافه نکرده‌اید</p>
                        <p className="text-gray-500 text-sm mt-2">ابتدا از بخش محصولات، محصول اضافه کنید</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                          <p className="text-right text-gray-700">
                            <span className="font-bold text-primary">{selectedProductIds.length}</span> محصول انتخاب شده
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (selectedProductIds.length === allProducts.length) {
                                setSelectedProductIds([])
                              } else {
                                setSelectedProductIds(allProducts.map(p => p.id))
                              }
                            }}
                            className="gap-2"
                          >
                            {selectedProductIds.length === allProducts.length ? "لغو انتخاب همه" : "انتخاب همه"}
                          </Button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allProducts.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => {
                                setSelectedProductIds(prev =>
                                  prev.includes(product.id)
                                    ? prev.filter(id => id !== product.id)
                                    : [...prev, product.id]
                                )
                              }}
                              className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${selectedProductIds.includes(product.id)
                                ? "border-primary bg-primary/5 shadow-lg"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center ${selectedProductIds.includes(product.id)
                                  ? "bg-primary border-primary"
                                  : "border-gray-300"
                                  }`}>
                                  {selectedProductIds.includes(product.id) && (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 text-right">
                                  {product.images && product.images[0] && (
                                    <img
                                      src={product.images[0]}
                                      alt={product.name_dari}
                                      className="w-full h-32 object-cover rounded-lg mb-3"
                                    />
                                  )}
                                  <h4 className="font-bold text-gray-900 mb-1">{product.name_dari}</h4>
                                  <p className="text-sm text-gray-600">{product.category}</p>
                                  <p className="text-sm font-semibold text-primary mt-2">${product.price}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <Card className="shadow-lg border-0">

                <CardContent className="p-8 space-y-8">
                  {/* Titles */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-right block font-semibold text-gray-700 text-lg">
                        عنوان (دری)
                      </Label>
                      <Input
                        value={settings.contact.title_dari}
                        onChange={(e) => setSettings({
                          ...settings,
                          contact: { ...settings.contact, title_dari: e.target.value }
                        })}
                        className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors text-lg"
                        dir="rtl"
                        placeholder="با ما تماس بگیرید"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-right block font-semibold text-gray-700 text-lg">
                        عنوان (پشتو)
                      </Label>
                      <Input
                        value={settings.contact.title_pashto}
                        onChange={(e) => setSettings({
                          ...settings,
                          contact: { ...settings.contact, title_pashto: e.target.value }
                        })}
                        className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors text-lg"
                        dir="rtl"
                        placeholder="زموږ سره اړیکه ونیسئ"
                      />
                    </div>
                  </div>

                  {/* Subtitles */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-right block font-semibold text-gray-700">
                        زیرعنوان (دری)
                      </Label>
                      <Input
                        value={settings.contact.subtitle_dari}
                        onChange={(e) => setSettings({
                          ...settings,
                          contact: { ...settings.contact, subtitle_dari: e.target.value }
                        })}
                        className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                        dir="rtl"
                        placeholder="ما اینجا هستیم تا به شما خدمت کنیم"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-right block font-semibold text-gray-700">
                        زیرعنوان (پشتو)
                      </Label>
                      <Input
                        value={settings.contact.subtitle_pashto}
                        onChange={(e) => setSettings({
                          ...settings,
                          contact: { ...settings.contact, subtitle_pashto: e.target.value }
                        })}
                        className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                        dir="rtl"
                        placeholder="موږ ستاسو د خدمت لپاره دلته یو"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-blue-50 p-6 rounded-xl space-y-6">
                    <h3 className="text-right text-xl font-bold text-gray-800">📍 آدرس</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          آدرس (دری)
                        </Label>
                        <Input
                          value={settings.contact.address_dari}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, address_dari: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          آدرس (پشتو)
                        </Label>
                        <Input
                          value={settings.contact.address_pashto}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, address_pashto: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          جزئیات آدرس (دری)
                        </Label>
                        <Input
                          value={settings.contact.address_detail_dari}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, address_detail_dari: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          جزئیات آدرس (پشتو)
                        </Label>
                        <Input
                          value={settings.contact.address_detail_pashto}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, address_detail_pashto: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="bg-green-50 p-6 rounded-xl space-y-6">
                    <h3 className="text-right text-xl font-bold text-gray-800">📞 اطلاعات تماس</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          شماره تلفن
                        </Label>
                        <Input
                          value={settings.contact.phone}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, phone: e.target.value }
                          })}
                          className="text-left p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors font-mono"
                          dir="ltr"
                          placeholder="+93 799 123 456"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          ایمیل
                        </Label>
                        <Input
                          value={settings.contact.email}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, email: e.target.value }
                          })}
                          className="text-left p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors font-mono"
                          dir="ltr"
                          type="email"
                          placeholder="info@electricbikes.af"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="bg-purple-50 p-6 rounded-xl space-y-6">
                    <h3 className="text-right text-xl font-bold text-gray-800">🕐 ساعات کاری</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          ساعات کاری (دری)
                        </Label>
                        <Input
                          value={settings.contact.hours_dari}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, hours_dari: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          ساعات کاری (پشتو)
                        </Label>
                        <Input
                          value={settings.contact.hours_pashto}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, hours_pashto: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          جزئیات ساعات (دری)
                        </Label>
                        <Input
                          value={settings.contact.hours_detail_dari}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, hours_detail_dari: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-right block font-semibold text-gray-700">
                          جزئیات ساعات (پشتو)
                        </Label>
                        <Input
                          value={settings.contact.hours_detail_pashto}
                          onChange={(e) => setSettings({
                            ...settings,
                            contact: { ...settings.contact, hours_detail_pashto: e.target.value }
                          })}
                          className="text-right p-4 border-2 border-gray-200 rounded-xl focus:border-primary transition-colors"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Header Tab */}
            {activeTab === "header" && (
              <Card className="shadow-lg border-0 w-full" dir="ltr">

                <CardContent className="p-8 space-y-8">
                  {/* Logo Settings */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">لوگو</h3>
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">لوگو (حالت روشن)</Label>
                        <div className="flex gap-3">
                          <Input
                            value={settings.header?.logo_url || ""}
                            onChange={(e) => setSettings({
                              ...settings,
                              header: { ...settings.header, logo_url: e.target.value }
                            })}
                            placeholder="/images/logo.png"
                            className="text-right h-12 text-base flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={async () => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = async (e: any) => {
                                const file = e.target.files[0]
                                if (file) {
                                  setUploading(true)
                                  try {
                                    const url = await uploadImage(file, 'header-logo')
                                    setSettings({
                                      ...settings,
                                      header: { ...settings.header, logo_url: url }
                                    })
                                    toast.success("✅ لوگو آپلود شد!")
                                  } catch (error) {
                                    toast.error("❌ خطا در آپلود لوگو")
                                  } finally {
                                    setUploading(false)
                                  }
                                }
                              }
                              input.click()
                            }}
                            disabled={uploading}
                            className="gap-2"
                          >
                            <ImageIcon className="w-5 h-5" />
                            آپلود
                          </Button>
                        </div>
                        {settings.header?.logo_url && (
                          <img src={settings.header.logo_url} alt="Logo" className="h-16 object-contain" />
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">لوگو (حالت تاریک)</Label>
                        <div className="flex gap-3">
                          <Input
                            value={settings.header?.logo_dark_url || ""}
                            onChange={(e) => setSettings({
                              ...settings,
                              header: { ...settings.header, logo_dark_url: e.target.value }
                            })}
                            placeholder="/images/logo-dark.png"
                            className="text-right h-12 text-base flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={async () => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = async (e: any) => {
                                const file = e.target.files[0]
                                if (file) {
                                  setUploading(true)
                                  try {
                                    const url = await uploadImage(file, 'header-logo-dark')
                                    setSettings({
                                      ...settings,
                                      header: { ...settings.header, logo_dark_url: url }
                                    })
                                    toast.success("✅ لوگو آپلود شد!")
                                  } catch (error) {
                                    toast.error("❌ خطا در آپلود لوگو")
                                  } finally {
                                    setUploading(false)
                                  }
                                }
                              }
                              input.click()
                            }}
                            disabled={uploading}
                            className="gap-2"
                          >
                            <ImageIcon className="w-5 h-5" />
                            آپلود
                          </Button>
                        </div>
                        {settings.header?.logo_dark_url && (
                          <div className="bg-gray-900 p-4 rounded-lg">
                            <img src={settings.header.logo_dark_url} alt="Dark Logo" className="h-16 object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Site Name */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">نام سایت</h3>
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">نام سایت (دری)</Label>
                        <Input
                          value={settings.header?.site_name_dari || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            header: { ...settings.header, site_name_dari: e.target.value }
                          })}
                          placeholder="موتورسیکلت‌های برقی"
                          className="text-right h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">نام سایت (پشتو)</Label>
                        <Input
                          value={settings.header?.site_name_pashto || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            header: { ...settings.header, site_name_pashto: e.target.value }
                          })}
                          placeholder="بریښنایی موټرسایکلونه"
                          className="text-right h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">شعار</h3>
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">شعار (دری)</Label>
                        <Input
                          value={settings.header?.tagline_dari || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            header: { ...settings.header, tagline_dari: e.target.value }
                          })}
                          placeholder="آینده سواری الکتریکی"
                          className="text-right h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">شعار (پشتو)</Label>
                        <Input
                          value={settings.header?.tagline_pashto || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            header: { ...settings.header, tagline_pashto: e.target.value }
                          })}
                          placeholder="د بریښنایی سواری راتلونکی"
                          className="text-right h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Header Options */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">تنظیمات نمایش</h3>
                    <div className="space-y-4">
                      {[
                        { key: "show_language_selector", label: "نمایش انتخابگر زبان" },
                        { key: "show_search", label: "نمایش جستجو" },
                        { key: "sticky_header", label: "هدر چسبنده" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl">
                          <span className="text-right font-semibold text-gray-800">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.header?.[item.key as keyof HeaderSettings] as boolean || false}
                              onChange={(e) => setSettings({
                                ...settings,
                                header: { ...settings.header, [item.key]: e.target.checked }
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:rtl:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:rtl:-right-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer Tab */}
            {activeTab === "footer" && (
              <Card className="shadow-lg border-0 " dir="ltr">

                <CardContent className="p-8 space-y-8">
                  {/* Logo */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">لوگو فوتر</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Input
                          value={settings.footer?.logo_url || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, logo_url: e.target.value }
                          })}
                          placeholder="/images/logo.png"
                          className="text-right h-12 text-base flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={async () => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*'
                            input.onchange = async (e: any) => {
                              const file = e.target.files[0]
                              if (file) {
                                setUploading(true)
                                try {
                                  const url = await uploadImage(file, 'footer-logo')
                                  setSettings({
                                    ...settings,
                                    footer: { ...settings.footer, logo_url: url }
                                  })
                                  toast.success("✅ لوگو آپلود شد!")
                                } catch (error) {
                                  toast.error("❌ خطا در آپلود لوگو")
                                } finally {
                                  setUploading(false)
                                }
                              }
                            }
                            input.click()
                          }}
                          disabled={uploading}
                          className="gap-2"
                        >
                          <ImageIcon className="w-5 h-5" />
                          آپلود
                        </Button>
                      </div>
                      {settings.footer?.logo_url && (
                        <img src={settings.footer.logo_url} alt="Footer Logo" className="h-16 object-contain" />
                      )}
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">اطلاعات شرکت</h3>
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">نام شرکت (دری)</Label>
                        <Input
                          value={settings.footer?.company_name_dari || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, company_name_dari: e.target.value }
                          })}
                          placeholder="موتورسیکلت‌های برقی افغانستان"
                          className="text-right h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">نام شرکت (پشتو)</Label>
                        <Input
                          value={settings.footer?.company_name_pashto || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, company_name_pashto: e.target.value }
                          })}
                          placeholder="د افغانستان بریښنایی موټرسایکلونه"
                          className="text-right h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">توضیحات (دری)</Label>
                        <Textarea
                          value={settings.footer?.description_dari || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, description_dari: e.target.value }
                          })}
                          placeholder="ما بهترین موتورسیکلت‌های برقی را فراهم می‌کنیم"
                          className="text-right min-h-24 text-base"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">توضیحات (پشتو)</Label>
                        <Textarea
                          value={settings.footer?.description_pashto || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, description_pashto: e.target.value }
                          })}
                          placeholder="موږ غوره بریښنایی موټرسایکلونه چمتو کوو"
                          className="text-right min-h-24 text-base"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">اطلاعات تماس</h3>
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">آدرس (دری)</Label>
                        <Input
                          value={settings.footer?.address_dari || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, address_dari: e.target.value }
                          })}
                          placeholder="شهر هرات، افغانستان"
                          className="text-right h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">آدرس (پشتو)</Label>
                        <Input
                          value={settings.footer?.address_pashto || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, address_pashto: e.target.value }
                          })}
                          placeholder="د هرات ښار، افغانستان"
                          className="text-right h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">تلفن</Label>
                        <Input
                          value={settings.footer?.phone || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, phone: e.target.value }
                          })}
                          placeholder="+93 799 123 456"
                          className="text-right h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">ایمیل</Label>
                        <Input
                          value={settings.footer?.email || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, email: e.target.value }
                          })}
                          placeholder="info@electricbikes.af"
                          className="text-left h-12 text-base"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">شبکه‌های اجتماعی</h3>
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">فیسبوک</Label>
                        <Input
                          value={settings.footer?.facebook_url || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, facebook_url: e.target.value }
                          })}
                          placeholder="https://facebook.com/yourpage"
                          className="text-left h-12 text-base"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">اینستاگرام</Label>
                        <Input
                          value={settings.footer?.instagram_url || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, instagram_url: e.target.value }
                          })}
                          placeholder="https://instagram.com/yourpage"
                          className="text-left h-12 text-base"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">توییتر</Label>
                        <Input
                          value={settings.footer?.twitter_url || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, twitter_url: e.target.value }
                          })}
                          placeholder="https://twitter.com/yourpage"
                          className="text-left h-12 text-base"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">یوتیوب</Label>
                        <Input
                          value={settings.footer?.youtube_url || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, youtube_url: e.target.value }
                          })}
                          placeholder="https://youtube.com/yourchannel"
                          className="text-left h-12 text-base"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">واتساپ</Label>
                        <Input
                          value={settings.footer?.whatsapp_number || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, whatsapp_number: e.target.value }
                          })}
                          placeholder="+93799123456"
                          className="text-left h-12 text-base"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Copyright */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">کپی‌رایت</h3>
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">متن کپی‌رایت (دری)</Label>
                        <Input
                          value={settings.footer?.copyright_text_dari || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, copyright_text_dari: e.target.value }
                          })}
                          placeholder="© 2024 تمامی حقوق محفوظ است"
                          className="text-right h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-right block text-base font-semibold">متن کپی‌رایت (پشتو)</Label>
                        <Input
                          value={settings.footer?.copyright_text_pashto || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            footer: { ...settings.footer, copyright_text_pashto: e.target.value }
                          })}
                          placeholder="© 2024 ټول حقونه خوندي دي"
                          className="text-right h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Options */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 text-right">تنظیمات نمایش</h3>
                    <div className="space-y-4">
                      {[
                        { key: "show_social_links", label: "نمایش لینک‌های اجتماعی" },
                        { key: "show_newsletter", label: "نمایش خبرنامه" }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl">
                          <span className="text-right font-semibold text-gray-800">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.footer?.[item.key as keyof FooterSettings] as boolean || false}
                              onChange={(e) => setSettings({
                                ...settings,
                                footer: { ...settings.footer, [item.key]: e.target.checked }
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:rtl:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:rtl:-right-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Visibility Tab */}
            {activeTab === "visibility" && (
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-l from-gray-50 to-white border-b">
                  <CardTitle className="text-right text-2xl flex items-center gap-3">
                    <Eye className="w-7 h-7 text-primary" />
                    مدیریت نمایش بخش‌ها
                  </CardTitle>
                  <CardDescription className="text-right text-gray-600">
                    فعال یا غیرفعال کردن بخش‌های مختلف صفحه اصلی
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {[
                    { key: "show_models_showcase_section", label: "بخش مدل‌های موتور", description: "نمایش بخش SR/S, SR/F, S, DSR/X" },
                    { key: "show_products_section", label: "بخش محصولات", description: "نمایش بخش محصولات در صفحه اصلی" },
                    { key: "show_features_section", label: "بخش ویژگی‌ها", description: "نمایش بخش ویژگی‌ها و مشخصات فنی" },
                    { key: "show_showcase_section", label: "بخش نمایش چرخشی", description: "نمایش بخش نمایش چرخشی موتورسیکلت" },
                    { key: "show_contact_section", label: "بخش تماس با ما", description: "نمایش فرم تماس در صفحه اصلی" }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl hover:border-primary transition-colors">
                      <div className="text-right flex-1 space-y-2">
                        <h4 className="font-bold text-lg text-gray-800">{item.label}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[item.key as keyof HomeSettings] as boolean}
                          onChange={(e) => setSettings({
                            ...settings,
                            [item.key]: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:rtl:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:rtl:-right-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}