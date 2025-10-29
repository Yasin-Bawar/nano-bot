# Complete Installation Guide

## 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

## 2. Environment Variables

Your `.env.local` file is already configured with:
```
NEXT_PUBLIC_SUPABASE_URL=https://ifwvopjnyocdkwiualju.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Run SQL in Supabase

Go to your Supabase SQL Editor and run the `supabase-schema.sql` file.

## 4. What's Been Created

### Files Created:
- `supabase-schema.sql` - Complete database schema
- `lib/supabase.ts` - Supabase client and types
- `lib/api/products.ts` - Product API functions
- `lib/api/orders.ts` - Order API functions
- `lib/api/messages.ts` - Messaging API functions
- `lib/api/reviews.ts` - Review API functions
- `SUPABASE_SETUP.md` - Setup documentation
- `package-install.txt` - Installation command

### Database Tables:
1. **products** - Motorcycle and parts catalog
2. **product_specs** - Technical specifications
3. **product_features** - Product features list
4. **product_colors** - Available colors
5. **customers** - Customer information
6. **orders** - Order management
7. **messages** - Customer-admin chat
8. **reviews** - Product reviews
9. **cart** - Shopping cart
10. **wishlist** - Customer wishlist

### Features Implemented:
✅ Product catalog with search and filtering
✅ Customer registration
✅ Order creation and tracking
✅ Real-time messaging system
✅ Product reviews and ratings
✅ Shopping cart functionality
✅ Wishlist management
✅ Automatic rating calculations
✅ Row Level Security policies
✅ Database triggers and functions

## 5. Testing

After running the SQL:
1. Visit `/products` page - Should load products from database
2. Search for products - Real-time search
3. Click on a product - View details
4. Go through checkout - Creates customer and order
5. Test messaging - Real-time chat

## 6. Admin Access

To manage your data:
1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. View/edit: products, orders, customers, messages

## 7. Next Features to Add

- Admin dashboard for order management
- Email notifications
- Payment integration
- Image upload to Supabase Storage
- Analytics and reporting
- Customer authentication
- Order tracking page
