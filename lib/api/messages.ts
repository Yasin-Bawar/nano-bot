import { supabase, Message } from '../supabase'

// Send message
export async function sendMessage(messageData: {
  customer_id: string
  order_id?: string
  sender_type: 'customer' | 'admin'
  message: string
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single()

  if (error) {
    console.error('Error sending message:', error)
    throw error
  }

  return data as Message
}

// Get messages for order
export async function getOrderMessages(orderId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data as Message[]
}

// Get messages for customer
export async function getCustomerMessages(customerId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching customer messages:', error)
    return []
  }

  return data as Message[]
}

// Mark message as read
export async function markMessageAsRead(messageId: string) {
  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', messageId)
    .select()
    .single()

  if (error) {
    console.error('Error marking message as read:', error)
    throw error
  }

  return data as Message
}

// Subscribe to new messages (real-time)
export function subscribeToMessages(
  orderId: string,
  callback: (message: Message) => void
) {
  console.log('📡 Creating subscription for order:', orderId)

  const subscription = supabase
    .channel(`messages:${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`
      },
      (payload) => {
        console.log('📬 Received postgres change:', payload)
        callback(payload.new as Message)
      }
    )
    .subscribe((status) => {
      console.log('📊 Subscription status:', status)
      if (status === 'SUBSCRIBED') {
        console.log('✅ Successfully subscribed to real-time messages')
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Channel error - real-time not working')
      } else if (status === 'TIMED_OUT') {
        console.error('⏱️ Subscription timed out')
      }
    })

  return subscription
}

// Unsubscribe from messages
export function unsubscribeFromMessages(subscription: any) {
  supabase.removeChannel(subscription)
}
