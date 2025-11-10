#!/usr/bin/env node

/**
 * Admin Setup Script
 * This script helps set up the admin panel with proper security
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

console.log('🚀 Setting up NANOBOT Admin Panel...\n')

// Generate secure session secret
const sessionSecret = crypto.randomBytes(64).toString('hex')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
let envContent = ''

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8')
  console.log('✅ Found existing .env.local file')
} else {
  console.log('📝 Creating new .env.local file')
}

// Add admin environment variables if they don't exist
const adminEnvVars = [
  `# Admin Panel Configuration`,
  `ADMIN_SESSION_SECRET=${sessionSecret}`,
  `ADMIN_SESSION_TIMEOUT=86400000`,
  `ADMIN_MAX_LOGIN_ATTEMPTS=5`,
  `ADMIN_LOCKOUT_DURATION=900000`,
  ``
]

// Check if admin vars already exist
if (!envContent.includes('ADMIN_SESSION_SECRET')) {
  envContent += '\n' + adminEnvVars.join('\n')
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Added admin configuration to .env.local')
} else {
  console.log('⚠️  Admin configuration already exists in .env.local')
}

// Create admin instructions
const instructions = `
🎉 Admin Panel Setup Complete!

📋 Next Steps:
1. Run the admin-schema.sql in your Supabase SQL editor
2. Change the default admin password (admin123)
3. Update the admin email address
4. Test the admin login at /admin

🔐 Default Admin Credentials:
   Username: admin
   Password: admin123
   Email: admin@nanobot.com

⚠️  SECURITY WARNING:
   - Change the default password immediately!
   - Use HTTPS in production
   - Consider IP whitelisting for admin access
   - Enable 2FA when available

🚀 Admin Panel Features:
   - Dashboard with real-time stats
   - Customer management
   - Order tracking and status updates
   - Message center for customer communication
   - Product management
   - Analytics and reporting
   - System settings

📖 For detailed setup instructions, see ADMIN_SETUP_GUIDE.md

Happy administrating! 🎯
`

console.log(instructions)

// Create a quick test script
const testScript = `
// Quick Admin Test
// Run this in your browser console on /admin page

// Test admin login
fetch('/api/x9k2m7p4q8w5n3j6/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
}).then(r => r.json()).then(console.log)
`

fs.writeFileSync(path.join(process.cwd(), 'admin-test.js'), testScript)
console.log('📝 Created admin-test.js for quick testing')

process.exit(0)