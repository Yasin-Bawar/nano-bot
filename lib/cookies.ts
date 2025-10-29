// Cookie utility functions for user session management

export interface UserSession {
  customerId: string
  orderId: string
  customerName: string
  customerPhone: string
  productName: string
}

// Set cookie with expiration (30 days)
export function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

// Get cookie value
export function getCookie(name: string): string | null {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length))
    }
  }
  return null
}

// Delete cookie
export function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Save user session to cookies
export function saveUserSession(session: UserSession) {
  setCookie('customerId', session.customerId)
  setCookie('orderId', session.orderId)
  setCookie('customerName', session.customerName)
  setCookie('customerPhone', session.customerPhone)
  setCookie('productName', session.productName)
  setCookie('sessionActive', 'true')
}

// Get user session from cookies
export function getUserSession(): UserSession | null {
  const customerId = getCookie('customerId')
  const orderId = getCookie('orderId')
  const customerName = getCookie('customerName')
  const customerPhone = getCookie('customerPhone')
  const productName = getCookie('productName')
  const sessionActive = getCookie('sessionActive')

  if (customerId && orderId && customerName && sessionActive === 'true') {
    return {
      customerId,
      orderId,
      customerName,
      customerPhone: customerPhone || '',
      productName: productName || 'محصول'
    }
  }

  return null
}

// Clear user session
export function clearUserSession() {
  deleteCookie('customerId')
  deleteCookie('orderId')
  deleteCookie('customerName')
  deleteCookie('customerPhone')
  deleteCookie('productName')
  deleteCookie('sessionActive')
}

// Check if user is logged in
export function isUserLoggedIn(): boolean {
  return getCookie('sessionActive') === 'true' && getCookie('customerId') !== null
}