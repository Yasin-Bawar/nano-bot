"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/x9k2m7p4q8w5n3j6/admin-layout"
import { Search, Package, Star, Eye, Edit, Trash2 } from "lucide-react"
import { getProducts } from "@/lib/api/products"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadProducts()
  }, [categoryFilter])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts(categoryFilter === "all" ? undefined : categoryFilter)
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟")) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      alert("محصول با موفقیت حذف شد")
      loadProducts() // Reload the list
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("خطا در حذف محصول")
    }
  }

  const categories = [
    { value: "all", label: "همه محصولات" },
    { value: "motorcycle", label: "موتورسیکلت‌ها" },
    { value: "part", label: "قطعات یدکی" },
    { value: "accessory", label: "لوازم جانبی" }
  ]

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name_local.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت محصولات</h1>
            <p className="text-gray-600">مشاهده و ویرایش محصولات فروشگاه</p>
          </div>
          <Link href="/x9k2m7p4q8w5n3j6/products/new">
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all font-bold flex items-center gap-2">
              <Package className="w-5 h-5" />
              افزودن محصول جدید
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl">
          <div className="p-6 border-b border-gray-200 space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی محصولات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all text-right"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    categoryFilter === cat.value
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              تعداد محصولات: <span className="font-bold text-primary">{filteredProducts.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-2 border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      <div className="h-10 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300 bg-white">
                  <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                      />
                    )}
                    {product.featured && (
                      <span className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        ویژه
                      </span>
                    )}
                    <span className={`absolute top-3 left-3 px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                      product.in_stock
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}>
                      {product.in_stock ? "موجود" : "ناموجود"}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.name_local}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-600">({product.reviews_count} نظر)</span>
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {product.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">افغانی</p>
                        {product.old_price && (
                          <p className="text-sm text-gray-400 line-through">{product.old_price.toLocaleString()} افغانی</p>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Package className="w-5 h-5" />
                          <span className="text-xl font-bold">{product.stock_quantity}</span>
                        </div>
                        <p className="text-xs text-gray-500">موجودی</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/x9k2m7p4q8w5n3j6/products/${product.id}`} className="flex-1">
                        <button className="w-full px-3 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2 font-bold">
                          <Eye className="w-4 h-4" />
                          مشاهده
                        </button>
                      </Link>
                      <Link href={`/x9k2m7p4q8w5n3j6/products/${product.id}/edit`} className="flex-1">
                        <button className="w-full px-3 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 font-bold">
                          <Edit className="w-4 h-4" />
                          ویرایش
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
