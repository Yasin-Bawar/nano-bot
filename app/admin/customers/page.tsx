"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Search, MapPin, Phone, Calendar, ChevronLeft, ChevronRight, Users, Mail, ShoppingBag, MessageCircle } from "lucide-react"
import { getCustomers } from "@/lib/api/admin"

// Helper function to format date in Farsi
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadCustomers()
  }, [page])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const data = await getCustomers(page, 10)
      setCustomers(data.customers)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (error) {
      console.error("Error loading customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مشتریان</h1>
            <p className="text-gray-600 mt-1">مدیریت پایگاه داده مشتریان</p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl shadow-lg">
            <Users className="w-6 h-6" />
            <div className="text-right">
              <p className="text-sm opacity-90">مجموع مشتریان</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو بر اساس نام، شماره تلفن یا موقعیت..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-right"
            />
          </div>
        </div>

        {/* Customers Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Users className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">مشتری یافت نشد</p>
              <p className="text-sm mt-2">هنوز مشتری ثبت نشده است</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">مشتری</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">شماره تماس</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">موقعیت</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">تاریخ عضویت</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">آمار</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-lg">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{customer.name}</p>
                              <p className="text-sm text-gray-500">شناسه: {customer.id.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-primary" />
                            <span className="font-medium">{customer.country_code} {customer.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{customer.location || 'نامشخص'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{formatDate(customer.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg">
                              <ShoppingBag className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">0</span>
                            </div>
                            <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-lg">
                              <MessageCircle className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-700">0</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">شناسه: {customer.id.substring(0, 8)}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{customer.country_code} {customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{customer.location || 'نامشخص'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(customer.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">0 سفارش</span>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-lg">
                        <MessageCircle className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">0 پیام</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <p className="text-sm text-gray-600">
                  نمایش {((page - 1) * 10) + 1} تا {Math.min(page * 10, total)} از {total} مشتری
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
