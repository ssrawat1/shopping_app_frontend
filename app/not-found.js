'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, ArrowLeft } from 'lucide-react'
import { useThemeContext } from '@/context/ThemeContext'

export default function NotFound() {
  const router = useRouter()
  const { isDark } = useThemeContext()

  return (
    <div className={`flex items-center justify-center min-h-[calc(100vh-64px)] px-4`}>
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl p-8 sm:p-12 max-w-md w-full text-center border`}>
        {/* 404 */}
        <h1 className="text-4xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          404
        </h1>

        {/* Content */}
        <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mt-4 sm:mt-6`}>
          Page Not Found
        </h2>
        <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2 sm:mt-3`}>
          The page you're looking for doesn't exist.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 justify-center">
          <button
            onClick={() => router.back()}
            className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-semibold border-2 transform hover:scale-105 transition-all duration-200 text-sm sm:text-base ${isDark ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-blue-500 hover:text-blue-400' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-600 hover:text-blue-600'}`}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Go Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            Home
          </Link>
        </div>

        {/* Error Code */}
        <p className={`mt-4 sm:mt-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Error Code: 404
        </p>
      </div>
    </div>
  )
}