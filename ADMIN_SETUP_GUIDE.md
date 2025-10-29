# Admin Panel Setup Guide

## Overview
This guide will help you set up the complete admin panel for the NANOBOT website with high security and full database integration.

## 🔐 Security Features
- **Secure Authentication**: Cookie-based sessions with expiration
- **Route Protection**: Middleware protecting all admin routes
- **Session Management**: Automatic session cleanup and validation
- **Activity Logging**: Track all admin actions
- **Role-based Access**: Support for different admin roles
- **Failed Login Protection**: Account lockout after failed attempts

## 📋 Setup Steps

### 1. Database Setup
Run the admin schema to create necessary tables:

```sql
-- Run this in your Supabase SQL editor
-- File: admin-schema.sql
```

This creates:
- `admin_users` - Admin user accounts
- `admin_sessions` - Session management
- `admin_activity_log` - Activity tracking
- `system_settings` - Configurable settings

### 2. Default Admin Accounts
Two admin accounts are created:

**Primary Admin:**
- **Username**: `yasinadil834@gmail.com`
- **Password**: `Yasin2025@`
- **Email**: `yasinadil834@gmail.com`
- **Role**: `super_admin`

**Backup Admin:**
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@nanobot.com`
- **Role**: `super_admin`

### 3. Environment Variables
Add to your `.env.local`:

```env
# Admin Security
ADMIN_SESSION_SECRET=your-super-secret-key-here
ADMIN_SESSION_TIMEOUT=86400000
```

### 4. Password Security
For production, implement proper password hashing:

```bash
npm install bcryptjs
npm install @types/bcryptjs
```

## 🚀 Admin Panel Features

### Dashboard (`/admin/dashboard`)
- **Real-time Statistics**: Customers, orders, messages, revenue
- **Recent Orders**: Latest order activity with status
- **Order Status Distribution**: Visual breakdown of order statuses
- **Performance Metrics**: Revenue trends and growth indicators

### Customer Management (`/admin/customers`)
- **Customer List**: Paginated customer directory
- **Search & Filter**: Find customers by name, phone, location
- **Customer Details**: View customer information and history
- **Export Capabilities**: Export customer data

### Order Management (`/admin/orders`)
- **Order Tracking**: Complete order lifecycle management
- **Status Updates**: Change order status with real-time updates
- **Customer Integration**: View customer details for each order
- **Filtering**: Filter by status, date, customer
- **Bulk Operations**: Handle multiple orders simultaneously

### Message Center (`/admin/messages`)
- **Conversation View**: Chat-like interface for customer communication
- **Real-time Messaging**: Send and receive messages instantly
- **Message History**: Complete conversation threads
- **Product Cards**: Handle product recommendation messages
- **Customer Context**: Access customer and order information

### Product Management (`/admin/products`)
- **Product Catalog**: Visual grid of all products
- **Inventory Tracking**: Stock levels and availability
- **Product Analytics**: Performance metrics per product
- **Category Management**: Organize products by category
- **Bulk Operations**: Edit multiple products at once

### Analytics (`/admin/analytics`)
- **Revenue Analytics**: Track income trends and patterns
- **Sales Performance**: Top products and category breakdown
- **Customer Insights**: New customer acquisition trends
- **Time-based Reports**: 7d, 30d, 90d, 1y reporting periods
- **Activity Timeline**: Recent system activity

### System Settings (`/admin/settings`)
- **General Settings**: Site name, description, contact info
- **Notification Preferences**: Email, SMS, order notifications
- **Security Settings**: 2FA, session timeout, login attempts
- **Password Management**: Change admin passwords
- **System Configuration**: Customize system behavior

## 🔒 Security Best Practices

### 1. Change Default Credentials
```sql
UPDATE admin_users 
SET password_hash = '$2b$10$NEW_HASH_HERE',
    email = 'your-email@domain.com'
WHERE username = 'admin';
```

### 2. Enable HTTPS
Ensure your production site uses HTTPS for all admin routes.

### 3. IP Whitelisting
Consider restricting admin access to specific IP addresses:

```typescript
// In middleware.ts
const allowedIPs = ['192.168.1.100', '10.0.0.50']
const clientIP = request.ip || request.headers.get('x-forwarded-for')

if (!allowedIPs.includes(clientIP)) {
  return NextResponse.redirect(new URL('/unauthorized', request.url))
}
```

### 4. Regular Security Audits
- Monitor admin activity logs
- Review failed login attempts
- Update passwords regularly
- Check for suspicious activity

## 📊 Database Queries

### View Admin Activity
```sql
SELECT 
  au.username,
  aal.action,
  aal.resource_type,
  aal.created_at
FROM admin_activity_log aal
JOIN admin_users au ON aal.admin_id = au.id
ORDER BY aal.created_at DESC
LIMIT 50;
```

### Check Active Sessions
```sql
SELECT 
  au.username,
  as.ip_address,
  as.created_at,
  as.expires_at
FROM admin_sessions as
JOIN admin_users au ON as.admin_id = au.id
WHERE as.expires_at > NOW();
```

### System Health Check
```sql
-- Check for locked accounts
SELECT username, failed_login_attempts, locked_until
FROM admin_users
WHERE locked_until > NOW();

-- Check recent activity
SELECT COUNT(*) as recent_logins
FROM admin_activity_log
WHERE action = 'login' AND created_at > NOW() - INTERVAL '24 hours';
```

## 🚨 Troubleshooting

### Can't Access Admin Panel
1. Check if middleware is properly configured
2. Verify admin_session cookie exists
3. Check session expiration
4. Verify database connection

### Login Issues
1. Check username/password combination
2. Verify account is not locked
3. Check failed login attempts
4. Review admin_users table

### Performance Issues
1. Check database indexes
2. Monitor query performance
3. Review session cleanup
4. Check for memory leaks

## 🔄 Maintenance

### Regular Tasks
- Clean up expired sessions: `SELECT cleanup_expired_admin_sessions();`
- Archive old activity logs
- Update system settings as needed
- Review and rotate admin passwords

### Monitoring
- Set up alerts for failed login attempts
- Monitor admin activity patterns
- Track system performance metrics
- Review security logs regularly

## 📞 Support
For issues or questions about the admin panel:
1. Check the troubleshooting section
2. Review database logs
3. Check browser console for errors
4. Verify environment configuration

---

**⚠️ Security Warning**: Always change default passwords and implement proper security measures before deploying to production!