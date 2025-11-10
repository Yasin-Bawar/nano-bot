"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, User, AlertCircle } from "lucide-react"
import { loginAdmin } from "@/lib/admin-auth"

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [clientIp, setClientIp] = useState<string>("")
  const [ipChecked, setIpChecked] = useState(false)
  const [ipAuthorized, setIpAuthorized] = useState(false)

  // Get public IP address from ipify API
  useEffect(() => {
    getPublicIP()
  }, [])

  const getPublicIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setClientIp(data.ip)
      checkIpAuthorization(data.ip)
    } catch (error) {
      console.error('Failed to get public IP:', error)
      setIpChecked(true)
      setIpAuthorized(false)
      setTimeout(() => {
        router.push('/404')
      }, 3000)
    }
  }

  const checkIpAuthorization = async (ipAddress: string) => {
    try {
      const response = await fetch('/api/admin/check-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipAddress })
      })
      
      const data = await response.json()
      
      if (data.authorized) {
        setIpAuthorized(true)
        setIpChecked(true)
      } else {
        setIpAuthorized(false)
        setIpChecked(true)
        // Redirect to 404 after a short delay
        setTimeout(() => {
          router.push('/404')
        }, 3000)
      }
    } catch (error) {
      console.error('IP check failed:', error)
      setIpChecked(true)
      setIpAuthorized(false)
      setTimeout(() => {
        router.push('/404')
      }, 3000)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!ipAuthorized) {
      setError("Your IP address is not authorized to access the admin panel")
      return
    }
    
    setError("")
    setLoading(true)

    try {
      const result = await loginAdmin(username, password, clientIp)

      if (result.success) {
        // Small delay to ensure session is set
        setTimeout(() => {
          window.location.href = "/x9k2m7p4q8w5n3j6/dashboard"
        }, 100)
      } else {
        setError(result.error || "Invalid credentials")
        setLoading(false)
      }
    } catch (err) {
      setError("Login failed. Please try again.")
      setLoading(false)
    }
  }

  // Show loading while checking IP
  if (!ipChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Detecting your public IP address...</p>
          <p className="text-xs text-gray-500 mt-2">Verifying authorization...</p>
        </div>
      </div>
    )
  }

  // Show unauthorized message
  if (!ipAuthorized) {
    const copyIp = () => {
      navigator.clipboard.writeText(clientIp)
      alert('IP address copied to clipboard!')
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            Your IP address is not authorized to access the admin panel.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Your Public IP Address:</p>
            <p className="text-lg text-gray-800 font-mono font-bold mb-3">
              {clientIp}
            </p>
            <button
              onClick={copyIp}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
            >
              📋 Copy IP Address
            </button>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-left text-xs">
            <p className="font-semibold text-yellow-800 mb-1">To authorize this IP:</p>
            <ol className="text-yellow-700 space-y-1 ml-4 list-decimal">
              <li>Copy the IP address above</li>
              <li>Open Electron Admin App or Supabase SQL Editor</li>
              <li>Add IP: <code className="bg-yellow-100 px-1 text-xs break-all">{clientIp}</code></li>
            </ol>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Redirecting to home page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in to access the dashboard
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Protected by enterprise-level security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
