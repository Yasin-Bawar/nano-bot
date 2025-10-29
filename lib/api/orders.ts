import { supabase, Customer, Order } from '../supabase'

// Create customer
export async function createCustomer(customerData: {
  name: string
  phone: string
  country_code: string
  location: string
  latitude?: number
  longitude?: number
}) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single()

  if (error) {
    console.error('Error creating customer:', error)
    throw error
  }

  return data as Customer
}

// Create order
export async function createOrder(orderData: {
  customer_id: string
  product_id: string | null
  product_name: string
  quantity: number
  total_price: number
  notes?: string
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()

  if (error) {
    console.error('Error creating order:', error)
    throw error
  }

  return data as Order
}

// Create order with customer (using the database function)
export async function createOrderWithCustomer(
  customerData: {
    name: string
    phone: string
    country_code: string
    location: string
    latitude?: number
    longitude?: number
  },
  orderData: {
    product_id: string
    product_name: string
    quantity: number
    total_price: number
  }
) {
  const { data, error } = await supabase.rpc('create_order_with_customer', {
    p_customer_name: customerData.name,
    p_phone: customerData.phone,
    p_country_code: customerData.country_code,
    p_location: customerData.location,
    p_latitude: customerData.latitude || null,
    p_longitude: customerData.longitude || null,
    p_product_id: orderData.product_id,
    p_product_name: orderData.product_name,
    p_quantity: orderData.quantity,
    p_total_price: orderData.total_price
  })

  if (error) {
    console.error('Error creating order with customer:', error)
    throw error
  }

  return data[0]
}

// Get order by ID
export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customers(*)
    `)
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return data
}

// Get customer orders
export async function getCustomerOrders(customerId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customer orders:', error)
    return []
  }

  return data as Order[]
}

// Update order status
export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    console.error('Error updating order status:', error)
    throw error
  }

  return data as Order
}
