import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Product {
  id: string
  name: string
  name_local: string
  description: string
  price: number
  old_price?: number
  category: 'motorcycle' | 'part' | 'accessory'
  category_local: string
  image_url: string
  images: string[]
  rating: number
  reviews_count: number
  in_stock: boolean
  stock_quantity: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ProductSpec {
  id: string
  product_id: string
  label: string
  value: string
}

export interface ProductFeature {
  id: string
  product_id: string
  feature: string
}

export interface ProductColor {
  id: string
  product_id: string
  name: string
  code: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  country_code: string
  location: string
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string
  product_id: string
  product_name: string
  quantity: number
  total_price: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  customer_id: string
  order_id?: string
  sender_type: 'customer' | 'admin'
  message: string
  is_read: boolean
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  customer_id: string
  rating: number
  comment?: string
  created_at: string
}
