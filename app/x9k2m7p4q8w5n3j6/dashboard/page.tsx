"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/x9k2m7p4q8w5n3j6/admin-layout"
import { 
  Users, ShoppingBag, MessageCircle, DollarSign, TrendingUp, TrendingDown, 
  Package, Calendar, Eye, Activity, BarChart3, PieChart, ArrowUpRight, 
  ArrowDownRight, Clock, CheckCircle, XCircle, AlertCircle, Truck, Star
} from "lucide-react"
import { getAdminStats, getAnalytics } from "@/lib/api/admin"

// Helper function to get time ago in Farsi
function getTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'همین الان'
  if (diffMins < 60) return `${diffMins} دقیقه پیش`
  if (diffHours < 24) return `${diffHours} ساعت پیش`
  return `${diffDays} روز پیش`
}

// Helper function to translate status to Farsi
function getStatusLabel(status: string) {
  const statusMap: { [key: string]: string } = {
    'pending': 'در انتظار',
    'confirmed': 'تایید شده',
    'processing': 'در حال پردازش',
    'shipped': 'ارسال شده',
    'delivered': 'تحویل داده شده',
    'cancelled': 'لغو شده'
  }
  return statusMap[status] || status
}

// Helper function to format numbers in Farsi
function formatNumber(num: number): string {
  return num.toLocaleString('fa-IR')
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    loadData()
  }, [timeRange])

  const loadData = async () => {
    try {
      const [statsData, analyticsData] = await Promise.all([
        getAdminStats(),
        getAnalytics(timeRange)
      ])
      setStats(statsData)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("خطا در بارگذاری داده‌ها:", error)
    } finally {
      setLoading(false)
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

  const statCards = [
    {
      title: "مجموع مشتریان",
      value: stats?.customers || 0,
      icon: Users,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+۱۲٪",
      trend: "up"
    },
    {
      title: "مجموع سفارشات",
      value: stats?.orders || 0,
      icon: ShoppingBag,
      bgColor: "bg-green-50",
      textColor: "text-primary",
      change: "+۸٪",
      trend: "up"
    },
    {
      title: "پیام‌ها",
      value: stats?.messages || 0,
      icon: MessageCircle,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: "+۲۳٪",
      trend: "up"
    },
    {
      title: "درآمد کل",
      value: `${(stats?.totalRevenue || 0).toLocaleString()} افغانی`,
      icon: DollarSign,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      change: "+۱۵٪",
      trend: "up"
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.bgColor} p-3 rounded-xl`}>
                  <card.icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <span className={`flex items-center text-sm font-semibold ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {card.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">سفارشات اخیر</h2>
              <button className="text-sm text-primary hover:text-accent font-medium transition-colors">مشاهده همه</button>
            </div>
            <div className="space-y-3">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.product_name}</p>
                        <p className="text-sm text-gray-600">{order.customer?.name || 'مشتری'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{order.total_price.toLocaleString()} افغانی</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">سفارشی وجود ندارد</p>
              )}
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">وضعیت سفارشات</h2>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {Object.entries(stats?.ordersByStatus || {}).length > 0 ? (
                Object.entries(stats.ordersByStatus).map(([status, count]: [string, any]) => (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{getStatusLabel(status)}</span>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{ width: `${stats.orders > 0 ? (count / stats.orders) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">داده‌ای وجود ندارد</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">محصولات برتر</h2>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats?.topProducts?.length > 0 ? (
                stats.topProducts.map((product: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sales} فروش</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{product.revenue.toLocaleString()} افغانی</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">هنوز سفارشی ثبت نشده است</p>
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">پیام‌های اخیر</h2>
              <MessageCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats?.recentMessages?.length > 0 ? (
                stats.recentMessages.map((msg: any, index: number) => {
                  const timeAgo = getTimeAgo(msg.created_at)
                  const customerName = msg.customer?.name || 'مشتری'
                  const messageText = msg.message.startsWith('PRODUCT_CARD:')
                    ? 'سوال درباره محصول'
                    : msg.message.substring(0, 50)

                  return (
                    <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {customerName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 text-sm">{customerName}</p>
                          {!msg.is_read && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{messageText}</p>
                        <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500 text-center py-4">پیامی وجود ندارد</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">دسترسی سریع</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">ایجاد سفارش جدید</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                <Users className="w-5 h-5" />
                <span className="font-medium">افزودن مشتری</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                <Package className="w-5 h-5" />
                <span className="font-medium">افزودن محصول</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">ارسال پیام</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
