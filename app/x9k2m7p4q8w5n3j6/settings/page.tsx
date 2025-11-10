"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/x9k2m7p4q8w5n3j6/admin-layout"
import { Save, Bell, Shield, Globe, Mail, Phone, MapPin, Clock, Lock, CheckCircle } from "lucide-react"
import { getSettings, updateSettings } from "@/lib/api/admin"

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getSettings()
      setSettings(data)
    } catch (error) {
      console.error("خطا در بارگذاری تنظیمات:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("خطا در ذخیره تنظیمات:", error)
      alert("خطا در ذخیره تنظیمات")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تنظیمات</h1>
            <p className="text-gray-600 mt-1">پیکربندی تنظیمات سیستم</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 font-bold"
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                ذخیره شد!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">تنظیمات عمومی</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نام سایت</label>
                <input
                  type="text"
                  value={settings?.general?.site_name || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, site_name: e.target.value }
                  })}
                  placeholder="نام فروشگاه خود را وارد کنید"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">توضیحات سایت</label>
                <textarea
                  value={settings?.general?.site_description || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, site_description: e.target.value }
                  })}
                  rows={3}
                  placeholder="توضیحات کوتاه درباره فروشگاه"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-right"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    ایمیل تماس
                  </label>
                  <input
                    type="email"
                    value={settings?.general?.contact_email || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contact_email: e.target.value }
                    })}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    value={settings?.general?.contact_phone || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contact_phone: e.target.value }
                    })}
                    placeholder="+93 123 456 789"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  آدرس
                </label>
                <input
                  type="text"
                  value={settings?.general?.address || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, address: e.target.value }
                  })}
                  placeholder="آدرس کامل فروشگاه"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-right"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">تنظیمات اعلان‌ها</h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                <div>
                  <p className="font-bold text-gray-900 mb-1">اعلان‌های ایمیل</p>
                  <p className="text-sm text-gray-600">دریافت اعلان‌های مهم از طریق ایمیل</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.notifications?.email_notifications || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email_notifications: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                <div>
                  <p className="font-bold text-gray-900 mb-1">اعلان‌های پیامکی</p>
                  <p className="text-sm text-gray-600">دریافت هشدارهای فوری از طریق پیامک</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.notifications?.sms_notifications || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, sms_notifications: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                <div>
                  <p className="font-bold text-gray-900 mb-1">اعلان سفارشات</p>
                  <p className="text-sm text-gray-600">اطلاع از سفارشات جدید</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.notifications?.order_notifications || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, order_notifications: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                <div>
                  <p className="font-bold text-gray-900 mb-1">اعلان مشتریان</p>
                  <p className="text-sm text-gray-600">هشدار برای ثبت‌نام مشتریان جدید</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.notifications?.customer_notifications || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, customer_notifications: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.security?.require_2fa || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, require_2fa: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings?.security?.session_timeout || 30}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, session_timeout: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  value={settings?.security?.max_login_attempts || 5}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, max_login_attempts: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
