import Link from 'next/link'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border border-white/20">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-xl opacity-50"></div>
            </div>
          </div>

          {/* 404 Text */}
          <h1 className="text-9xl font-bold text-white mb-4 tracking-tight">
            404
          </h1>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-4">
            صفحه مورد نظر یافت نشد
          </h2>

          {/* Description */}
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
          </p>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-8"></div>

          {/* Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-6 h-6" />
            بازگشت به صفحه اصلی
          </Link>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm">
              در صورت نیاز به کمک، با پشتیبانی تماس بگیرید
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
