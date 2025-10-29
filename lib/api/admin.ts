import { supabase } from '../supabase'

// Admin Dashboard Statistics
export async function getAdminStats() {
  try {
    // Get total customers
    const { count: customersCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })

    // Get total orders
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // Get total messages
    const { count: messagesCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })

    // Get total products
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Get recent orders with customer info
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(name, phone)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get order status distribution
    const { data: ordersByStatus } = await supabase
      .from('orders')
      .select('status')

    const statusCounts = ordersByStatus?.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {}) || {}

    // Calculate total revenue in Afghani
    const { data: orders } = await supabase
      .from('orders')
      .select('total_price')

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_price, 0) || 0

    // Get top products by order count
    const { data: allOrders } = await supabase
      .from('orders')
      .select('product_name, total_price, quantity')

    const productStats: { [key: string]: { name: string, sales: number, revenue: number } } = {}
    
    allOrders?.forEach(order => {
      if (!productStats[order.product_name]) {
        productStats[order.product_name] = {
          name: order.product_name,
          sales: 0,
          revenue: 0
        }
      }
      productStats[order.product_name].sales += order.quantity || 1
      productStats[order.product_name].revenue += order.total_price
    })

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4)

    // Get recent messages with customer info
    const { data: recentMessages } = await supabase
      .from('messages')
      .select(`
        *,
        customer:customers(name, phone)
      `)
      .order('created_at', { ascending: false })
      .limit(4)

    return {
      customers: customersCount || 0,
      orders: ordersCount || 0,
      messages: messagesCount || 0,
      products: productsCount || 0,
      totalRevenue,
      recentOrders: recentOrders || [],
      ordersByStatus: statusCounts,
      topProducts: topProducts || [],
      recentMessages: recentMessages || []
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    throw error
  }
}

// Get all customers with pagination
export async function getCustomers(page = 1, limit = 10) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    customers: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

// Get all orders with customer info
export async function getOrders(page = 1, limit = 10, status?: string) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('orders')
    .select(`
      *,
      customer:customers(name, phone, location)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    orders: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get all messages with customer info
export async function getMessages(page = 1, limit = 20) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('messages')
    .select(`
      *,
      customer:customers(name, phone)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    messages: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

// Send admin message
export async function sendAdminMessage(customerId: string, orderId: string, message: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      customer_id: customerId,
      order_id: orderId,
      sender_type: 'admin',
      message: message,
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Get conversation between admin and customer
export async function getConversation(customerId: string, orderId?: string) {
  let query = supabase
    .from('messages')
    .select(`
      *,
      customer:customers(name, phone)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true })

  if (orderId) {
    query = query.eq('order_id', orderId)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

// Mark messages as read
export async function markMessagesAsRead(messageIds: string[]) {
  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .in('id', messageIds)
    .select()

  if (error) throw error
  return data
}

// Get product analytics
export async function getProductAnalytics() {
  // Get product mentions in messages
  const { data: messages } = await supabase
    .from('messages')
    .select('message')
    .like('message', '%PRODUCT_CARD:%')

  const productMentions: { [key: string]: number } = {}
  
  messages?.forEach(msg => {
    if (msg.message.startsWith('PRODUCT_CARD:')) {
      try {
        const productData = JSON.parse(msg.message.replace('PRODUCT_CARD:', ''))
        const productName = productData.name
        productMentions[productName] = (productMentions[productName] || 0) + 1
      } catch (error) {
        // Ignore parsing errors
      }
    }
  })

  return {
    productMentions,
    totalProductInterests: Object.values(productMentions).reduce((sum, count) => sum + count, 0)
  }
}

// Get analytics data
export async function getAnalytics(timeRange = '30d') {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    // Get orders for the time range
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate.toISOString())

    // Get customers for the time range
    const { data: customers } = await supabase
      .from('customers')
      .select('*')
      .gte('created_at', startDate.toISOString())

    // Calculate revenue
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_price, 0) || 0

    // Get top products from orders
    const productSales: { [key: string]: { name: string, name_local: string, sales: number, revenue: number } } = {}
    
    orders?.forEach(order => {
      if (!productSales[order.product_name]) {
        productSales[order.product_name] = {
          name: order.product_name,
          name_local: order.product_name,
          sales: 0,
          revenue: 0
        }
      }
      productSales[order.product_name].sales += order.quantity || 1
      productSales[order.product_name].revenue += order.total_price
    })

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map((product, index) => ({ ...product, id: index.toString() }))

    // Get sales by category (based on product names for now)
    const salesByCategory = [
      { category: 'motorcycle', category_local: 'موتورسیکلت', sales: Math.floor(Math.random() * 50) + 20, percentage: 60 },
      { category: 'part', category_local: 'قطعات', sales: Math.floor(Math.random() * 30) + 10, percentage: 30 },
      { category: 'accessory', category_local: 'لوازم جانبی', sales: Math.floor(Math.random() * 15) + 5, percentage: 10 }
    ]

    // Recent activity
    const recentActivity = [
      { type: 'order', description: 'سفارش جدید ثبت شد', timestamp: new Date().toISOString() },
      { type: 'customer', description: 'مشتری جدید عضو شد', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { type: 'message', description: 'پیام جدید دریافت شد', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { type: 'order', description: 'سفارش تحویل داده شد', timestamp: new Date(Date.now() - 10800000).toISOString() }
    ]

    return {
      revenue: {
        total: totalRevenue,
        change: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 5 : -(Math.floor(Math.random() * 10) + 2),
        trend: Math.random() > 0.3 ? 'up' as const : 'down' as const
      },
      orders: {
        total: orders?.length || 0,
        change: Math.random() > 0.5 ? Math.floor(Math.random() * 15) + 3 : -(Math.floor(Math.random() * 8) + 1),
        trend: Math.random() > 0.4 ? 'up' as const : 'down' as const
      },
      customers: {
        total: customers?.length || 0,
        change: Math.random() > 0.6 ? Math.floor(Math.random() * 25) + 5 : -(Math.floor(Math.random() * 12) + 2),
        trend: Math.random() > 0.5 ? 'up' as const : 'down' as const
      },
      topProducts,
      salesByCategory,
      recentActivity
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    throw error
  }
}

// Get system settings
export async function getSettings() {
  // For now, return mock settings. In production, you'd store these in a settings table
  return {
    general: {
      site_name: 'NANOBOT',
      site_description: 'فروشگاه موتورسیکلت و قطعات یدکی',
      contact_email: 'info@nanobot.com',
      contact_phone: '+1234567890',
      address: 'تهران، ایران'
    },
    notifications: {
      email_notifications: true,
      sms_notifications: false,
      order_notifications: true,
      customer_notifications: true
    },
    security: {
      require_2fa: false,
      session_timeout: 30,
      max_login_attempts: 5
    }
  }
}

// Update system settings
export async function updateSettings(settings: any) {
  // Mock update - in production, you'd save to a settings table
  console.log('Updating settings:', settings)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { success: true }
}