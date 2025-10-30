"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Eye, EyeOff, Plus, Trash2 } from "lucide-react"
import { getHomeSettings, updateHomeSettings, uploadImage } from "@/lib/api/home-settings"
import { toast } from "sonner"

interface HeroSettings {
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

interface HomeSettings {
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

export default function HomeSettingsPage() {
  const [settings, setSettings] = useState<HomeSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const data = await getHomeSettings()
      setSettings(data)
    } catch (error) {
      console.error("Error loading settings:", error)
      toast.error("خطا در بارگذاری تنظیمات. لطفاً ابتدا کد SQL را در Supabase اجرا کنید.")
      // Set default settings so page can still render
      setSettings({
        hero: {
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
        features: [],
        products_title_dari: "محصولات ما",
        products_title_pashto: "زموږ محصولات",
        products_subtitle_dari: "موتورسیکلت‌های برقی و قطعات",
        products_subtitle_pashto: "بریښنایی موټرسایکلونه او برخې",
        show_products_section: true,
        show_features_section: true,
        show_contact_section: true
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!settings) return
    
    setSaving(true)
    try {
      await updateHomeSettings(settings)
      toast.success("تنظیمات با موفقیت ذخیره شد!")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("خطا در ذخیره تنظیمات. لطفاً ابتدا کد SQL را در Supabase اجرا کنید.")
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: string) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      setSettings(prev => prev ? {
        ...prev,
        hero: { ...prev.hero, [field]: url }
      } : null)
      toast.success("تصویر با موفقیت آپلود شد!")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("خطا در آپلود تصویر")
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!settings) return null

  return (
    <AdminLayout>
      <div className="space-y-6 w-full pb-20" dir="rtl">
        {/* Setup Notice */}
        {settings.features.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
            <h3 className="font-semibold text-blue-900 mb-2">⚠️ توجه: نصب اولیه مورد نیاز است</h3>
            <p className="text-blue-800 text-sm mb-2">
              لطفاً ابتدا کد SQL را در Supabase اجرا کنید:
            </p>
            <ol className="text-blue-800 text-sm list-decimal list-inside space-y-1">
              <li>فایل <code className="bg-blue-100 px-2 py-1 rounded">SQL_CODE_ONLY.sql</code> را باز کنید</li>
              <li>تمام محتوا را کپی کنید</li>
              <li>در Supabase SQL Editor پیست کنید</li>
              <li>دکمه Run را بزنید</li>
              <li>این صفحه را رفرش کنید</li>
            </ol>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900">تنظیمات صفحه اصلی</h1>
            <p className="text-gray-600 mt-1">محتوای صفحه اصلی وب‌سایت خود را سفارشی کنید</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? <EyeOff className="w-4 h-4 ml-2" /> : <Eye className="w-4 h-4 ml-2" />}
              {previewMode ? "حالت ویرایش" : "پیش‌نمایش"}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 ml-2" />
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="space-y-6" dir="rtl">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hero">بخش اصلی</TabsTrigger>
            <TabsTrigger value="features">ویژگی‌ها</TabsTrigger>
            <TabsTrigger value="products">بخش محصولات</TabsTrigger>
            <TabsTrigger value="visibility">نمایش بخش‌ها</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">بخش اصلی (Hero)</CardTitle>
                <CardDescription className="text-right">بنر اصلی در بالای صفحه اصلی</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hero Image */}
                <div className="space-y-2">
                  <Label className="text-right block">تصویر پس‌زمینه</Label>
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="flex-1 text-right">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "image_url")}
                        disabled={uploading}
                        className="text-right"
                      />
                      <p className="text-sm text-gray-500 mt-1">توصیه می‌شود: 1920x1080 پیکسل</p>
                    </div>
                    {settings.hero.image_url && (
                      <img
                        src={settings.hero.image_url}
                        alt="Hero"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    )}
                  </div>
                </div>

                {/* Taglines */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-right block">عنوان اصلی (دری)</Label>
                    <Input
                      value={settings.hero.tagline_dari}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, tagline_dari: e.target.value }
                      })}
                      placeholder="آینده سواری الکتریکی"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block">عنوان اصلی (پشتو)</Label>
                    <Input
                      value={settings.hero.tagline_pashto}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, tagline_pashto: e.target.value }
                      })}
                      placeholder="د بریښنایی سواری راتلونکی"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Subtitles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-right block">زیرعنوان (دری)</Label>
                    <Textarea
                      value={settings.hero.subtitle_dari}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, subtitle_dari: e.target.value }
                      })}
                      placeholder="طراحی شده برای افغانستان"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block">زیرعنوان (پشتو)</Label>
                    <Textarea
                      value={settings.hero.subtitle_pashto}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, subtitle_pashto: e.target.value }
                      })}
                      placeholder="د افغانستان لپاره ډیزاین شوی"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-right block">برد (کیلومتر)</Label>
                    <Input
                      value={settings.hero.range_value}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, range_value: e.target.value }
                      })}
                      placeholder="220"
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block">سرعت (کیلومتر/ساعت)</Label>
                    <Input
                      value={settings.hero.speed_value}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, speed_value: e.target.value }
                      })}
                      placeholder="180"
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block">زمان شارژ (ساعت)</Label>
                    <Input
                      value={settings.hero.charge_value}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, charge_value: e.target.value }
                      })}
                      placeholder="1.5"
                      className="text-right"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-2">
                  <Label className="text-right block">رنگ‌های موجود (کدهای hex با کاما جدا شوند)</Label>
                  <Input
                    value={settings.hero.colors.join(", ")}
                    onChange={(e) => setSettings({
                      ...settings,
                      hero: { ...settings.hero, colors: e.target.value.split(",").map(c => c.trim()) }
                    })}
                    placeholder="#000000, #DC2626, #2563EB"
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-right block">متن دکمه (دری)</Label>
                    <Input
                      value={settings.hero.cta_text_dari}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, cta_text_dari: e.target.value }
                      })}
                      placeholder="مشاهده مدل‌ها"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block">متن دکمه (پشتو)</Label>
                    <Input
                      value={settings.hero.cta_text_pashto}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, cta_text_pashto: e.target.value }
                      })}
                      placeholder="ماډلونه وګورئ"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Section */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <CardTitle>بخش ویژگی‌ها</CardTitle>
                    <CardDescription>ویژگی‌های محصولات خود را نمایش دهید</CardDescription>
                  </div>
                  <Button onClick={addFeature} size="sm">
                    <Plus className="w-4 h-4 ml-2" />
                    افزودن ویژگی
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.features.map((feature, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-right">ویژگی {index + 1}</CardTitle>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-right block">عنوان (انگلیسی)</Label>
                          <Input
                            value={feature.title_en}
                            onChange={(e) => updateFeature(index, "title_en", e.target.value)}
                            placeholder="LONG RANGE"
                            className="text-left"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-right block">عنوان (دری)</Label>
                          <Input
                            value={feature.title_dari}
                            onChange={(e) => updateFeature(index, "title_dari", e.target.value)}
                            placeholder="برد طولانی"
                            className="text-right"
                            dir="rtl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-right block">عنوان (پشتو)</Label>
                          <Input
                            value={feature.title_pashto}
                            onChange={(e) => updateFeature(index, "title_pashto", e.target.value)}
                            placeholder="اوږد واټن"
                            className="text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-right block">توضیحات (دری)</Label>
                          <Textarea
                            value={feature.description_dari}
                            onChange={(e) => updateFeature(index, "description_dari", e.target.value)}
                            placeholder="تا 220 کیلومتر با یک شارژ"
                            className="text-right"
                            dir="rtl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-right block">توضیحات (پشتو)</Label>
                          <Textarea
                            value={feature.description_pashto}
                            onChange={(e) => updateFeature(index, "description_pashto", e.target.value)}
                            placeholder="تر 220 کیلومتره پورې"
                            className="text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-right block">مقدار آمار</Label>
                          <Input
                            value={feature.stat}
                            onChange={(e) => updateFeature(index, "stat", e.target.value)}
                            placeholder="220km"
                            className="text-left"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-right block">آیکون</Label>
                          <select
                            value={feature.icon}
                            onChange={(e) => updateFeature(index, "icon", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-right"
                            dir="rtl"
                          >
                            <option value="Battery">باتری (Battery)</option>
                            <option value="Zap">برق (Zap)</option>
                            <option value="Gauge">سرعت‌سنج (Gauge)</option>
                            <option value="Shield">سپر (Shield)</option>
                            <option value="Wifi">وای‌فای (Wifi)</option>
                            <option value="Leaf">برگ (Leaf)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-right block">ترتیب</Label>
                          <Input
                            type="number"
                            value={feature.order_index}
                            onChange={(e) => updateFeature(index, "order_index", parseInt(e.target.value))}
                            className="text-right"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Section */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">بخش محصولات</CardTitle>
                <CardDescription className="text-right">تنظیمات بخش نمایش محصولات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-right block">عنوان بخش (دری)</Label>
                    <Input
                      value={settings.products_title_dari}
                      onChange={(e) => setSettings({
                        ...settings,
                        products_title_dari: e.target.value
                      })}
                      placeholder="محصولات ما"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block">عنوان بخش (پشتو)</Label>
                    <Input
                      value={settings.products_title_pashto}
                      onChange={(e) => setSettings({
                        ...settings,
                        products_title_pashto: e.target.value
                      })}
                      placeholder="زموږ محصولات"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-right block">زیرعنوان بخش (دری)</Label>
                    <Input
                      value={settings.products_subtitle_dari}
                      onChange={(e) => setSettings({
                        ...settings,
                        products_subtitle_dari: e.target.value
                      })}
                      placeholder="موتورسیکلت‌های برقی و قطعات"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block">زیرعنوان بخش (پشتو)</Label>
                    <Input
                      value={settings.products_subtitle_pashto}
                      onChange={(e) => setSettings({
                        ...settings,
                        products_subtitle_pashto: e.target.value
                      })}
                      placeholder="بریښنایی موټرسایکلونه او برخې"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visibility Settings */}
          <TabsContent value="visibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">نمایش بخش‌ها</CardTitle>
                <CardDescription className="text-right">نمایش یا مخفی کردن بخش‌های صفحه اصلی</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={settings.show_products_section}
                    onChange={(e) => setSettings({
                      ...settings,
                      show_products_section: e.target.checked
                    })}
                    className="w-5 h-5"
                  />
                  <div className="text-right flex-1 mr-4">
                    <h4 className="font-medium">بخش محصولات</h4>
                    <p className="text-sm text-gray-600">نمایش شبکه محصولات ویژه</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={settings.show_features_section}
                    onChange={(e) => setSettings({
                      ...settings,
                      show_features_section: e.target.checked
                    })}
                    className="w-5 h-5"
                  />
                  <div className="text-right flex-1 mr-4">
                    <h4 className="font-medium">بخش ویژگی‌ها</h4>
                    <p className="text-sm text-gray-600">نمایش ویژگی‌های محصولات</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={settings.show_contact_section}
                    onChange={(e) => setSettings({
                      ...settings,
                      show_contact_section: e.target.checked
                    })}
                    className="w-5 h-5"
                  />
                  <div className="text-right flex-1 mr-4">
                    <h4 className="font-medium">بخش تماس</h4>
                    <p className="text-sm text-gray-600">نمایش بخش تماس و نقشه</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
