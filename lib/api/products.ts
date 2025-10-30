import { supabase, Product } from '../supabase'

// Get all products
export async function getProducts(category?: string) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

// Get featured products
export async function getFeaturedProducts() {
  // First, get the list of featured product IDs from home settings
  const { data: featuredData, error: featuredError } = await supabase
    .from('home_featured_products')
    .select('product_id')
    .order('order_index', { ascending: true })

  if (featuredError && featuredError.code !== "42P01" && featuredError.code !== "PGRST116") {
    console.error('Error fetching featured product IDs:', featuredError)
  }

  const featuredProductIds = featuredData?.map(fp => fp.product_id) || []

  // If no featured products are selected, fall back to products marked as featured
  if (featuredProductIds.length === 0) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('in_stock', true)
      .limit(6)

    if (error) {
      console.error('Error fetching featured products:', error)
      return []
    }

    return data as Product[]
  }

  // Get the actual products based on the featured IDs
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', featuredProductIds)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  // Sort products to match the order in featuredProductIds
  const sortedProducts = featuredProductIds
    .map(id => data?.find(p => p.id === id))
    .filter(Boolean) as Product[]

  return sortedProducts
}

// Get single product with all details
export async function getProductById(id: string) {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (productError) {
    console.error('Error fetching product:', productError)
    return null
  }

  // Get specs
  const { data: specs } = await supabase
    .from('product_specs')
    .select('*')
    .eq('product_id', id)

  // Get features
  const { data: features } = await supabase
    .from('product_features')
    .select('*')
    .eq('product_id', id)

  // Get colors
  const { data: colors } = await supabase
    .from('product_colors')
    .select('*')
    .eq('product_id', id)

  return {
    ...product,
    specs: specs || [],
    features: features?.map(f => f.feature) || [],
    colors: colors || []
  }
}

// Search products
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,name_local.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('in_stock', true)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }

  return data as Product[]
}

// Get related products
export async function getRelatedProducts(productId: string, category: string, limit = 3) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', productId)
    .eq('in_stock', true)
    .limit(limit)

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return data as Product[]
}
