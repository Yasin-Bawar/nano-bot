"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  MessageCircle,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  Search,
  Home
} from "lucide-react"
import Link from "next/link"
import { getAdminSession, logoutAdmin } from "@/lib/admin-auth"

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "داشبورد", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "تنظیمات صفحه اصلی", href: "/admin/home-settings", icon: Home },
  { name: "مشتریان", href: "/admin/customers", icon: Users },
  { name: "سفارشات", href: "/admin/orders", icon: ShoppingBag },
  { name: "پیام‌ها", href: "/admin/messages", icon: MessageCircle },
  { name: "محصولات", href: "/admin/products", icon: Package },
  { name: "آمار و تحلیل", href: "/admin/analytics", icon: BarChart3 },
  { name: "تنظیمات", href: "/admin/settings", icon: Settings },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminSession, setAdminSession] = useState<any>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const session = getAdminSession()
    if (!session) {
      router.push("/admin")
    } else {
      setAdminSession(session)
    }
  }, [router])

  // Load notifications
  useEffect(() => {
    async function loadNotifications() {
      try {
        // Get recent unread messages
        const { supabase } = await import('@/lib/supabase')
        const { data: messages } = await supabase
          .from('messages')
          .select('*, customer:customers(name)')
          .eq('sender_type', 'customer')
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(5)

        const notifs = messages?.map(msg => ({
          id: msg.id,
          type: 'message',
          title: `پیام جدید از ${msg.customer?.name || 'مشتری'}`,
          message: msg.message.substring(0, 50) + '...',
          time: new Date(msg.created_at),
          read: false
        })) || []

        setNotifications(notifs)
        setUnreadCount(notifs.length)
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    if (adminSession) {
      loadNotifications()
      // Refresh every 30 seconds
      const interval = setInterval(loadNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [adminSession])

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotificationsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = async () => {
    await logoutAdmin()
    router.push("/admin")
  }

  if (!adminSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white overflow-hidden" dir="ltr">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-white border-l border-gray-100 shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        dir="ltr"
      >
        {/* Logo Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 bg-gradient-to-r from-primary to-accent" dir="ltr">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">نانوبات</h1>
              <p className="text-xs text-white/80">پنل مدیریت</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 flex-1 overflow-y-auto mt-4" dir="ltr">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                      : "text-gray-600 hover:bg-green-50 hover:text-primary"
                      }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${isActive
                      ? "bg-white/20"
                      : "bg-gray-100 group-hover:bg-primary/10"
                      }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-100" dir="ltr">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-4 w-full px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">خروج</span>
          </button>
        </div>
      </aside>
  {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0" dir="ltr">
          <div className="flex items-center gap-6 flex-row-reverse">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 hover:bg-green-50 rounded-xl transition-colors text-gray-600 hover:text-primary"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 w-96 border border-gray-100 hover:border-primary transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو در پنل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400 text-right"
              />
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-gray-500 bg-white rounded border border-gray-200">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-row-reverse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">
                  {adminSession.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">{adminSession.username}</div>
                <div className="text-xs text-gray-600 capitalize">{adminSession.role}</div>
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-3 hover:bg-green-50 rounded-xl transition-colors text-gray-600 hover:text-primary"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary to-accent">
                    <h3 className="font-bold text-white text-right">اعلان‌ها</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>اعلانی وجود ندارد</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <Link 
                          key={notif.id} 
                          href="/admin/messages"
                          onClick={() => setNotificationsOpen(false)}
                          className="block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3 text-right">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MessageCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm mb-1">{notif.title}</p>
                              <p className="text-xs text-gray-600 truncate">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.time).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <Link 
                      href="/admin/messages"
                      onClick={() => setNotificationsOpen(false)}
                      className="block p-3 text-center text-sm text-primary hover:bg-gray-50 font-medium border-t border-gray-100"
                    >
                      مشاهده همه پیام‌ها
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
      {/* Main Content */}
      <div className="lg:mr-72 h-screen flex flex-col" dir="ltr">
      

        {/* Page Content */}
        <main 
          className="flex-1 p-8 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" 
          style={{ 
            overflowY: 'scroll', 
            overflowX: 'hidden',
            height: 'calc(100vh - 5rem)',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin'
          }}
        >
          {children}
        </main>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-20 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در صفحات، مشتریان، سفارشات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="flex-1 outline-none text-right text-lg"
                />
                <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 text-right mb-3">صفحات سریع:</p>
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                      >
                        <Icon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {navigation
                    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                        >
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="text-gray-900 font-medium">{item.name}</span>
                        </Link>
                      )
                    })}
                  {navigation.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>نتیجه‌ای یافت نشد</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}