# 🚀 Quick Start - 3 Steps to Get Running

## Step 1: Install Package (1 minute)

Open your terminal and run:

```bash
npm install @supabase/supabase-js
```

## Step 2: Setup Database (2 minutes)

1. Open your Supabase dashboard: https://ifwvopjnyocdkwiualju.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Open the file `supabase-schema.sql` from your project
5. Copy ALL the content (it's a long file)
6. Paste it into the SQL Editor
7. Click "Run" button
8. Wait for "Success" message

## Step 3: Start Your App

```bash
npm run dev
```

## ✅ That's It!

Your website is now fully connected to Supabase!

### Test These Features:

1. **Products Page** (`/products`)
   - Products load from database
   - Search works
   - Categories filter

2. **Product Details** (`/products/[id]`)
   - Click any product
   - See full details from database

3. **Checkout** (`/checkout`)
   - Fill form
   - Data saves to database
   - Creates customer + order

4. **Messaging** (`/messaging`)
   - Real-time chat
   - Messages stored in database

### View Your Data:

Go to Supabase Dashboard → Table Editor to see:
- Products
- Customers
- Orders
- Messages

### Sample Data Included:

The SQL script includes 8 sample products:
- Sport SR/F ($19,995)
- Urban Cruiser ($17,995)
- White Sport ($10,995)
- Silver Edition ($11,995)
- White Rounded ($12,995)
- Battery Pack ($2,499)
- Handlebars ($299)
- Motor System ($1,899)

## 🎉 You're Done!

Everything is connected and working. The website now:
- Loads products from Supabase
- Saves orders to database
- Stores customer data
- Handles real-time messaging
- Manages reviews and ratings

## Need Help?

Check these files:
- `SUPABASE_SETUP.md` - Detailed setup guide
- `INSTALLATION_GUIDE.md` - Complete installation info
- `supabase-schema.sql` - Database structure
