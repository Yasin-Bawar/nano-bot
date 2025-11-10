"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/x9k2m7p4q8w5n3j6/admin-layout"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, BarChart3, PieChart, Activity } from "lucide-react"
import { getAnalytics } from "@/lib/api/admin"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getAnalytics(timeRange)
      setAnalytics(data)
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error)
    } finally {
      setLoading(false)
    }
  }

  const timeRanges = [
    { value: "7d", label: "۷ روز گذشته" },
    { value: "30d", label: "۳۰ روز گذشته" },
    { value: "90d", label: "۹۰ روز گذشته" },
    { value: "1y", label: "یک سال گذشته" }
  ]

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">آمار و تحلیل</h1>
            <p className="text-gray-600 mt-1">نمای کلی از عملکرد کسب و کار شما</p>
          </div>
          <div className="flex gap-2">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  timeRange === range.value
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${
                analytics.revenue.trend === 'up' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {analytics.revenue.trend === 'up' ? <TrendingUp className="w-4 h-4 ml-1" /> : <TrendingDown className="w-4 h-4 ml-1" />}
                {Math.abs(analytics.revenue.change)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">کل درآمد</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.revenue.total.toLocaleString('fa-IR')}
            </p>
            <p className="text-sm text-gray-500">افغانی</p>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${
                analytics.orders.trend === 'up' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {analytics.orders.trend === 'up' ? <TrendingUp className="w-4 h-4 ml-1" /> : <TrendingDown className="w-4 h-4 ml-1" />}
                {Math.abs(analytics.orders.change)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">تعداد سفارشات</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.orders.total.toLocaleString('fa-IR')}
            </p>
            <p className="text-sm text-gray-500">سفارش</p>
          </div>

          {/* Customers Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${
                analytics.customers.trend === 'up' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {analytics.customers.trend === 'up' ? <TrendingUp className="w-4 h-4 ml-1" /> : <TrendingDown className="w-4 h-4 ml-1" />}
                {Math.abs(analytics.customers.change)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">مشتریان جدید</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.customers.total.toLocaleString('fa-IR')}
            </p>
            <p className="text-sm text-gray-500">مشتری</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">محصولات برتر</h2>
            </div>
            <div className="space-y-3">
              {analytics.topProducts && analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((product: any, index: number) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          {product.sales.toLocaleString('fa-IR')} فروش
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">
                      {product.revenue.toLocaleString('fa-IR')} ؋
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>هنوز فروشی ثبت نشده است</p>
                </div>
              )}
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">فروش بر اساس دسته‌بندی</h2>
            </div>
            <div className="space-y-5">
              {analytics.salesByCategory.map((cat: any, index: number) => {
                const colors = [
                  { bg: 'from-primary to-accent', light: 'bg-blue-50', text: 'text-primary' },
                  { bg: 'from-purple-500 to-pink-500', light: 'bg-purple-50', text: 'text-purple-700' },
                  { bg: 'from-orange-500 to-red-500', light: 'bg-orange-50', text: 'text-orange-700' }
                ]
                const color = colors[index % colors.length]
                
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-800 font-bold">{cat.category_local}</span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${color.light} ${color.text}`}>
                        {cat.sales.toLocaleString('fa-IR')} فروش ({cat.percentage.toLocaleString('fa-IR')}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color.bg} rounded-full transition-all duration-500`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">فعالیت‌های اخیر</h2>
          </div>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-blue-100' :
                  activity.type === 'customer' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'order' ? <ShoppingBag className="w-5 h-5 text-blue-600" /> :
                   activity.type === 'customer' ? <Users className="w-5 h-5 text-green-600" /> :
                   <Package className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
