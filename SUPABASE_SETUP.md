# Supabase Setup Guide for NANOBOT Electric Motorcycles

## Step 1: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 2: Run SQL Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the entire content from `supabase-schema.sql`
4. Paste and run it in the SQL Editor
5. This will create all tables, functions, triggers, and sample data

## Step 3: Verify Tables Created

Check that these tables exist in your database:
- products
- product_specs
- product_features
- product_colors
- customers
- orders
- messages
- reviews
- cart
- wishlist

## Step 4: Test the Integration

The app is now connected to Supabase! Test these features:

### Products Page
- Browse products from database
- Search functionality
- Category filtering
- Real-time data

### Checkout Flow
- Customer data saved to database
- Orders created automatically
- Location tracking

### Messaging System
- Real-time chat with Supabase Realtime
- Message history stored
- Admin-customer communication

## API Functions Available

### Products (`lib/api/products.ts`)
- `getProducts(category?)` - Get all products
- `getFeaturedProducts()` - Get featured products
- `getProductById(id)` - Get single product with details
- `searchProducts(query)` - Search products
- `getRelatedProducts(productId, category, limit)` - Get related products

### Orders (`lib/api/orders.ts`)
- `createCustomer(customerData)` - Create new customer
- `createOrder(orderData)` - Create new order
- `createOrderWithCustomer(customerData, orderData)` - Create both at once
- `getOrderById(orderId)` - Get order details
- `getCustomerOrders(customerId)` - Get customer's orders
- `updateOrderStatus(orderId, status)` - Update order status

### Messages (`lib/api/messages.ts`)
- `sendMessage(messageData)` - Send a message
- `getOrderMessages(orderId)` - Get messages for an order
- `getCustomerMessages(customerId)` - Get customer messages
- `markMessageAsRead(messageId)` - Mark message as read
- `subscribeToMessages(orderId, callback)` - Real-time subscription
- `unsubscribeFromMessages(subscription)` - Unsubscribe

### Reviews (`lib/api/reviews.ts`)
- `addReview(reviewData)` - Add product review
- `getProductReviews(productId)` - Get product reviews
- `getCustomerReviews(customerId)` - Get customer reviews

## Database Features

- **Automatic timestamps** - created_at and updated_at
- **Rating calculation** - Auto-updates when reviews added
- **Row Level Security** - Secure data access
- **Real-time subscriptions** - Live updates
- **Full-text search** - Search across products
- **Relationships** - Proper foreign keys

## Next Steps

1. Update remaining pages to use Supabase
2. Add admin dashboard for managing orders
3. Implement real-time notifications
4. Add image upload to Supabase Storage
5. Create analytics dashboard
