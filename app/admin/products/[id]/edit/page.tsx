"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import { ArrowRight, Upload, X, Plus, Save, Package, Image as ImageIcon, DollarSign, Tag, Star, Box } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id as string

    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [uploadingImage, setUploadingImage] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        name_local: "",
        description: "",
        price: "",
        old_price: "",
        category: "motorcycle",
        category_local: "",
        image_url: "",
        rating: "0",
        reviews_count: "0",
        in_stock: true,
        stock_quantity: "0",
        featured: false,
    })

    const [specs, setSpecs] = useState<{ label: string; value: string }[]>([])
    const [features, setFeatures] = useState<string[]>([])
    const [colors, setColors] = useState<{ name: string; code: string }[]>([])
    const [images, setImages] = useState<string[]>([])

    const categories = [
        { value: "motorcycle", label: "موتورسیکلت", local: "موتورسیکلت" },
        { value: "part", label: "قطعه یدکی", local: "قطعات" },
        { value: "accessory", label: "لوازم جانبی", local: "لوازم جانبی" }
    ]

    // Load existing product data
    useEffect(() => {
        if (productId) {
            console.log('useEffect triggered with productId:', productId)
            loadProduct()
        }
    }, [productId])

    // eslint-disable-next-line react-hooks/exhaustive-deps

    const loadProduct = async () => {
        setLoadingData(true)
        try {
            console.log('Loading product with ID:', productId)

            // Load product
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single()

            if (productError) {
                console.error('Product error:', productError)
                throw productError
            }

            console.log('Product data loaded:', productData)

            // Set form data
            setFormData({
                name: productData.name || "",
                name_local: productData.name_local || "",
                description: productData.description || "",
                price: productData.price?.toString() || "",
                old_price: productData.old_price?.toString() || "",
                category: productData.category || "motorcycle",
                category_local: productData.category_local || "",
                image_url: productData.image_url || "",
                rating: productData.rating?.toString() || "0",
                reviews_count: productData.reviews_count?.toString() || "0",
                in_stock: productData.in_stock ?? true,
                stock_quantity: productData.stock_quantity?.toString() || "0",
                featured: productData.featured ?? false,
            })

            console.log('Images from product:', productData.images)
            setImages(productData.images || [])

            // Load specs
            const { data: specsData, error: specsError } = await supabase
                .from('product_specs')
                .select('*')
                .eq('product_id', productId)

            if (specsError) console.error('Specs error:', specsError)
            console.log('Specs loaded:', specsData)
            setSpecs(specsData?.map(s => ({ label: s.label, value: s.value })) || [])

            // Load features
            const { data: featuresData, error: featuresError } = await supabase
                .from('product_features')
                .select('*')
                .eq('product_id', productId)

            if (featuresError) console.error('Features error:', featuresError)
            console.log('Features loaded:', featuresData)
            setFeatures(featuresData?.map(f => f.feature) || [])

            // Load colors
            const { data: colorsData, error: colorsError } = await supabase
                .from('product_colors')
                .select('*')
                .eq('product_id', productId)

            if (colorsError) console.error('Colors error:', colorsError)
            console.log('Colors loaded:', colorsData)
            setColors(colorsData?.map(c => ({ name: c.name, code: c.code })) || [])

            console.log('All data loaded successfully')

        } catch (error) {
            console.error("Error loading product:", error)
            alert("خطا در بارگذاری محصول: " + (error as any).message)
        } finally {
            setLoadingData(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))

            // Auto-fill category_local when category changes
            if (name === "category") {
                const cat = categories.find(c => c.value === value)
                if (cat) {
                    setFormData(prev => ({ ...prev, category_local: cat.local }))
                }
            }
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploadingImage(true)
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`فایل ${file.name} بیشتر از 5 مگابایت است`)
                }

                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `products/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('uploads')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('uploads')
                    .getPublicUrl(filePath)

                return publicUrl
            })

            const uploadedUrls = await Promise.all(uploadPromises)

            // Set first image as main image if not set
            if (!formData.image_url && uploadedUrls.length > 0) {
                setFormData(prev => ({ ...prev, image_url: uploadedUrls[0] }))
            }

            // Add all images to the images array
            setImages(prev => [...prev, ...uploadedUrls])

            alert(`${uploadedUrls.length} تصویر با موفقیت آپلود شد`)
        } catch (error: any) {
            console.error("Error uploading images:", error)
            alert(error.message || "خطا در آپلود تصاویر")
        } finally {
            setUploadingImage(false)
            // Reset file input
            if (e.target) {
                e.target.value = ''
            }
        }
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        setImages(newImages)

        // If removed image was the main image, set first remaining image as main
        if (formData.image_url === images[index]) {
            setFormData(prev => ({ ...prev, image_url: newImages[0] || "" }))
        }
    }

    const setMainImage = (url: string) => {
        setFormData(prev => ({ ...prev, image_url: url }))
    }

    const addSpec = () => {
        setSpecs([...specs, { label: "", value: "" }])
    }

    const updateSpec = (index: number, field: "label" | "value", value: string) => {
        const newSpecs = [...specs]
        newSpecs[index][field] = value
        setSpecs(newSpecs)
    }

    const removeSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index))
    }

    const addFeature = () => {
        setFeatures([...features, ""])
    }

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features]
        newFeatures[index] = value
        setFeatures(newFeatures)
    }

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index))
    }

    const addColor = () => {
        setColors([...colors, { name: "", code: "#000000" }])
    }

    const updateColor = (index: number, field: "name" | "code", value: string) => {
        const newColors = [...colors]
        newColors[index][field] = value
        setColors(newColors)
    }

    const removeColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.name_local || !formData.price) {
            alert("لطفاً فیلدهای ضروری را پر کنید")
            return
        }

        setLoading(true)
        try {
            // Update product
            const { error: productError } = await supabase
                .from('products')
                .update({
                    name: formData.name,
                    name_local: formData.name_local,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    old_price: formData.old_price ? parseFloat(formData.old_price) : null,
                    category: formData.category,
                    category_local: formData.category_local,
                    image_url: formData.image_url,
                    images: images,
                    rating: parseFloat(formData.rating),
                    reviews_count: parseInt(formData.reviews_count),
                    in_stock: formData.in_stock,
                    stock_quantity: parseInt(formData.stock_quantity),
                    featured: formData.featured,
                })
                .eq('id', productId)

            if (productError) throw productError

            // Delete old specs and insert new ones
            await supabase.from('product_specs').delete().eq('product_id', productId)
            if (specs.length > 0) {
                const specsData = specs
                    .filter(s => s.label && s.value)
                    .map(s => ({
                        product_id: productId,
                        label: s.label,
                        value: s.value
                    }))

                if (specsData.length > 0) {
                    await supabase.from('product_specs').insert(specsData)
                }
            }

            // Delete old features and insert new ones
            await supabase.from('product_features').delete().eq('product_id', productId)
            if (features.length > 0) {
                const featuresData = features
                    .filter(f => f.trim())
                    .map(f => ({
                        product_id: productId,
                        feature: f
                    }))

                if (featuresData.length > 0) {
                    await supabase.from('product_features').insert(featuresData)
                }
            }

            // Delete old colors and insert new ones
            await supabase.from('product_colors').delete().eq('product_id', productId)
            if (colors.length > 0) {
                const colorsData = colors
                    .filter(c => c.name && c.code)
                    .map(c => ({
                        product_id: productId,
                        name: c.name,
                        code: c.code
                    }))

                if (colorsData.length > 0) {
                    await supabase.from('product_colors').insert(colorsData)
                }
            }

            alert("محصول با موفقیت به‌روزرسانی شد!")
            router.push(`/admin/products/${productId}`)
        } catch (error: any) {
            console.error("Error updating product:", error)

            // Show detailed error message
            let errorMessage = "خطا در به‌روزرسانی محصول"

            if (error.message) {
                errorMessage += `\n\nجزئیات: ${error.message}`
            }

            if (error.details) {
                errorMessage += `\n\n${error.details}`
            }

            if (error.hint) {
                errorMessage += `\n\nراهنما: ${error.hint}`
            }

            alert(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">در حال بارگذاری اطلاعات محصول...</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto">
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
                        <h1 className="text-3xl font-bold text-gray-900">ویرایش محصول</h1>
                        <p className="text-gray-600 mt-2">اطلاعات محصول را به‌روزرسانی کنید</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">اطلاعات اصلی</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    نام محصول (انگلیسی) *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Sport SR/F"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    نام محصول (فارسی/پشتو) *
                                </label>
                                <input
                                    type="text"
                                    name="name_local"
                                    value={formData.name_local}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right"
                                    placeholder="اسپرت SR/F"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    توضیحات
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-right"
                                    placeholder="توضیحات کامل محصول..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    دسته‌بندی *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    دسته‌بندی محلی
                                </label>
                                <input
                                    type="text"
                                    name="category_local"
                                    value={formData.category_local}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right"
                                    placeholder="موتورسیکلت"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Pricing */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">قیمت‌گذاری</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    قیمت (افغانی) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="19995"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    قیمت قبلی (افغانی)
                                </label>
                                <input
                                    type="number"
                                    name="old_price"
                                    value={formData.old_price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="22995"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    موجودی انبار
                                </label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="10"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Upload */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">تصاویر محصول</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    {uploadingImage ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                            <p className="text-gray-600">در حال آپلود...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <Upload className="w-12 h-12 text-gray-400" />
                                            <div>
                                                <p className="text-gray-700 font-medium">کلیک کنید یا تصاویر را بکشید</p>
                                                <p className="text-sm text-gray-500 mt-1">می‌توانید چند تصویر را همزمان انتخاب کنید</p>
                                                <p className="text-xs text-gray-400 mt-1">حداکثر 5 مگابایت برای هر تصویر</p>
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Image Gallery */}
                            {images.length > 0 && (
                                <div>
                                    <p className="text-sm font-bold text-gray-700 mb-3">
                                        تصاویر آپلود شده ({images.length})
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {images.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <div className={`relative rounded-xl overflow-hidden border-4 transition-all ${formData.image_url === url
                                                    ? 'border-primary shadow-lg'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <img
                                                        src={url}
                                                        alt={`Product ${index + 1}`}
                                                        className="w-full h-32 object-contain bg-gray-50 p-2"
                                                    />
                                                    {formData.image_url === url && (
                                                        <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            اصلی
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        {formData.image_url !== url && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setMainImage(url)}
                                                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-bold"
                                                                title="تنظیم به عنوان تصویر اصلی"
                                                            >
                                                                اصلی
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                            title="حذف تصویر"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">
                                        💡 تصویر با حاشیه آبی به عنوان تصویر اصلی محصول نمایش داده می‌شود
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Specifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <Tag className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">مشخصات فنی</h2>
                            </div>
                            <button
                                type="button"
                                onClick={addSpec}
                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 font-bold"
                            >
                                <Plus className="w-4 h-4" />
                                افزودن
                            </button>
                        </div>

                        <div className="space-y-3">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={spec.label}
                                        onChange={(e) => updateSpec(index, "label", e.target.value)}
                                        placeholder="برد"
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-all text-right"
                                    />
                                    <input
                                        type="text"
                                        value={spec.value}
                                        onChange={(e) => updateSpec(index, "value", e.target.value)}
                                        placeholder="220 کیلومتر"
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-all text-right"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSpec(index)}
                                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {specs.length === 0 && (
                                <p className="text-center text-gray-500 py-8">هنوز مشخصاتی اضافه نشده است</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                    <Star className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">ویژگی‌ها</h2>
                            </div>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors flex items-center gap-2 font-bold"
                            >
                                <Plus className="w-4 h-4" />
                                افزودن
                            </button>
                        </div>

                        <div className="space-y-3">
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        placeholder="سیستم ABS پیشرفته"
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-all text-right"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {features.length === 0 && (
                                <p className="text-center text-gray-500 py-8">هنوز ویژگی‌ای اضافه نشده است</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Colors */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                                    <Box className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">رنگ‌های موجود</h2>
                            </div>
                            <button
                                type="button"
                                onClick={addColor}
                                className="px-4 py-2 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors flex items-center gap-2 font-bold"
                            >
                                <Plus className="w-4 h-4" />
                                افزودن
                            </button>
                        </div>

                        <div className="space-y-3">
                            {colors.map((color, index) => (
                                <div key={index} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={color.name}
                                        onChange={(e) => updateColor(index, "name", e.target.value)}
                                        placeholder="آبی"
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none transition-all text-right"
                                    />
                                    <input
                                        type="color"
                                        value={color.code}
                                        onChange={(e) => updateColor(index, "code", e.target.value)}
                                        className="w-20 h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeColor(index)}
                                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {colors.length === 0 && (
                                <p className="text-center text-gray-500 py-8">هنوز رنگی اضافه نشده است</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Additional Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6">تنظیمات اضافی</h2>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="in_stock"
                                    checked={formData.in_stock}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                                />
                                <span className="font-medium text-gray-700">موجود در انبار</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                                />
                                <span className="font-medium text-gray-700">محصول ویژه</span>
                            </label>
                        </div>
                    </motion.div>

                    {/* Submit Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex gap-4"
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    در حال ذخیره...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    به‌روزرسانی محصول
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold text-lg"
                        >
                            انصراف
                        </button>
                    </motion.div>
                </form>
            </div>
        </AdminLayout>
    )
}
