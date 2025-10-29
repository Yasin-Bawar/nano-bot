import { supabase, Review } from '../supabase'

// Add review
export async function addReview(reviewData: {
  product_id: string
  customer_id: string
  rating: number
  comment?: string
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single()

  if (error) {
    console.error('Error adding review:', error)
    throw error
  }

  return data as Review
}

// Get product reviews
export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      customer:customers(name)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data
}

// Get customer reviews
export async function getCustomerReviews(customerId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      product:products(name, name_local, image_url)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customer reviews:', error)
    return []
  }

  return data
}
