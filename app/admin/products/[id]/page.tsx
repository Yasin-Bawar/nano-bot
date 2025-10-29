"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import { ArrowRight, Edit, Trash2, Package, Star, Box, Tag, Image as ImageIcon, DollarSign } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function ViewProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id as string

    const [product, setProduct] = useState<any>(null)
    const [specs, setSpecs] = useState<any[]>([])
    const [features, setFeatures] = useState<any[]>([])
    const [colors, setColors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        loadProduct()
    }, [productId])

    const loadProduct = async () => {
        try {
            // Load product
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single()

            if (productError) throw productError
            setProduct(productData)

            // Load specs
            const { data: specsData } = await supabase
                .from('product_specs')
                .select('*')
                .eq('product_id', productId)
            setSpecs(specsData || [])

            // Load features
            const { data: featuresData } = await supabase
                .from('product_features')
                .select('*')
                .eq('product_id', productId)
            setFeatures(featuresData || [])

            // Load colors
            const { data: colorsData } = await supabase
                .from('product_colors')
                .select('*')
                .eq('product_id', productId)
            setColors(colorsData || [])

        } catch (error) {
            console.error("Error loading product:", error)
            alert("خطا در بارگذاری محصول")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟")) {
            return
        }

        setDeleting(true)
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)

            if (error) throw error

            alert("محصول با موفقیت حذف شد")
            router.push("/admin/products")
        } catch (error) {
            console.error("Error deleting product:", error)
            alert("خطا در حذف محصول")
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        )
    }

    if (!product) {
        return (
            <AdminLayout>
                <div className="text-center py-20">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">محصول یافت نشد</h2>
                    <button
                        onClick={() => router.push("/admin/products")}
                        className="text-primary hover:underline"
                    >
                        بازگشت به لیست محصولات
                    </button>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                        >
                            <ArrowRight className="w-5 h-5" />
                            <span>بازگشت</span>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">مشاهده محصول</h1>
                        <p className="text-gray-600 mt-2">{product.name}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/admin/products/${productId}/edit`}>
                            <button className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-bold flex items-center gap-2">
                                <Edit className="w-5 h-5" />
                                ویرایش
                            </button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold flex items-center gap-2 disabled:opacity-50"
                        >
                            {deleting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                    در حال حذف...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    حذف
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">تصویر محصول</h2>
                            </div>
                            {product.image_url ? (
                                <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-8"
                                    />
                                </div>
                            ) : (
                                <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <ImageIcon className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                        </motion.div>

                        {/* Basic Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">اطلاعات اصلی</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-600">نام محصول (انگلیسی)</label>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">{product.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-600">نام محصول (محلی)</label>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">{product.name_local}</p>
                                </div>
                                {product.description && (
                                    <div>
                                        <label className="text-sm font-bold text-gray-600">توضیحات</label>
                                        <p className="text-gray-700 mt-1 leading-relaxed">{product.description}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-gray-600">دسته‌بندی</label>
                                        <p className="text-gray-900 mt-1">{product.category}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-600">دسته‌بندی محلی</label>
                                        <p className="text-gray-900 mt-1">{product.category_local}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Specifications */}
                        {specs.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                        <Tag className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">مشخصات فنی</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {specs.map((spec) => (
                                        <div key={spec.id} className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-sm font-bold text-gray-600">{spec.label}</p>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">{spec.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Features */}
                        {features.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                        <Star className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">ویژگی‌ها</h2>
                                </div>
                                <ul className="space-y-3">
                                    {features.map((feature) => (
                                        <li key={feature.id} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                            <p className="text-gray-700 flex-1">{feature.feature}</p>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Colors */}
                        {colors.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                                        <Box className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">رنگ‌های موجود</h2>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {colors.map((color) => (
                                        <div key={color.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                                            <div
                                                className="w-8 h-8 rounded-full border-2 border-gray-300"
                                                style={{ backgroundColor: color.code }}
                                            ></div>
                                            <span className="font-medium text-gray-900">{color.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Pricing */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">قیمت</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-600">قیمت فعلی</label>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-1">
                                        {product.price.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600">افغانی</p>
                                </div>
                                {product.old_price && (
                                    <div>
                                        <label className="text-sm font-bold text-gray-600">قیمت قبلی</label>
                                        <p className="text-xl font-semibold text-gray-400 line-through mt-1">
                                            {product.old_price.toLocaleString()} افغانی
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Stock & Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6">وضعیت</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">موجودی انبار</span>
                                    <span className="text-2xl font-bold text-gray-900">{product.stock_quantity}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">وضعیت</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${product.in_stock
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}>
                                        {product.in_stock ? "موجود" : "ناموجود"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">محصول ویژه</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${product.featured
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                                        }`}>
                                        {product.featured ? "بله" : "خیر"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Rating */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6">امتیاز</h2>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
                                <div className="flex justify-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 ${i < Math.floor(product.rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600">{product.reviews_count} نظر</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
