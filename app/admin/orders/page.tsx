"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Search, ChevronLeft, ChevronRight, Package, User, Phone, MapPin, Calendar, DollarSign, ShoppingBag } from "lucide-react"
import { getOrders, updateOrderStatus } from "@/lib/api/admin"

// Helper function to format date in Farsi
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadOrders()
  }, [page, statusFilter])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await getOrders(page, 10, statusFilter)
      setOrders(data.orders)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      loadOrders()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("خطا در به‌روزرسانی وضعیت")
    }
  }

  const statusOptions = [
    { value: "all", label: "همه سفارشات" },
    { value: "pending", label: "در انتظار" },
    { value: "confirmed", label: "تایید شده" },
    { value: "processing", label: "در حال پردازش" },
    { value: "shipped", label: "ارسال شده" },
    { value: "delivered", label: "تحویل داده شده" },
    { value: "cancelled", label: "لغو شده" }
  ]

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      processing: "bg-purple-100 text-purple-700 border-purple-200",
      shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200"
    }
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const filteredOrders = orders.filter(order =>
    order.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">سفارشات</h1>
            <p className="text-gray-600 mt-1">پیگیری و مدیریت تمام سفارشات</p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl shadow-lg">
            <ShoppingBag className="w-6 h-6" />
            <div className="text-right">
              <p className="text-sm opacity-90">مجموع سفارشات</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو سفارشات بر اساس نام محصول یا مشتری..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-right"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === option.value
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Package className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">سفارشی یافت نشد</p>
              <p className="text-sm mt-2">هنوز سفارشی ثبت نشده است</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">شماره سفارش</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">مشتری</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">محصول</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">مبلغ</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">وضعیت</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">تاریخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-mono text-sm text-gray-600 font-medium">
                              #{order.id.slice(0, 8)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-gray-900">{order.customer?.name || 'مشتری'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{order.customer?.phone || 'نامشخص'}</span>
                            </div>
                            {order.customer?.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{order.customer.location}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{order.product_name}</p>
                          <p className="text-sm text-gray-600">تعداد: {order.quantity}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="font-bold text-gray-900">{order.total_price.toLocaleString()} افغانی</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border cursor-pointer outline-none transition-all hover:shadow-md ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">در انتظار</option>
                            <option value="confirmed">تایید شده</option>
                            <option value="processing">در حال پردازش</option>
                            <option value="shipped">ارسال شده</option>
                            <option value="delivered">تحویل داده شده</option>
                            <option value="cancelled">لغو شده</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm">{formatDate(order.created_at)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-mono text-sm text-gray-600 font-medium">
                          #{order.id.slice(0, 8)}
                        </span>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border cursor-pointer outline-none ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">در انتظار</option>
                        <option value="confirmed">تایید شده</option>
                        <option value="processing">در حال پردازش</option>
                        <option value="shipped">ارسال شده</option>
                        <option value="delivered">تحویل داده شده</option>
                        <option value="cancelled">لغو شده</option>
                      </select>
                    </div>

                    {/* Product Info */}
                    <div className="mb-3">
                      <p className="font-semibold text-gray-900 mb-1">{order.product_name}</p>
                      <p className="text-sm text-gray-600">تعداد: {order.quantity}</p>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium">{order.customer?.name || 'مشتری'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{order.customer?.phone || 'نامشخص'}</span>
                      </div>
                      {order.customer?.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{order.customer.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Date */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-bold text-gray-900">{order.total_price.toLocaleString()} افغانی</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <p className="text-sm text-gray-600">
                  نمایش {((page - 1) * 10) + 1} تا {Math.min(page * 10, total)} از {total} سفارش
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                  >
                    <span>بعدی</span>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                  >
                    <ChevronRight className="w-5 h-5" />
                    <span>قبلی</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
