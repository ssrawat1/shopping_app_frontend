'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package } from 'lucide-react'
import { useThemeContext } from '@/context/ThemeContext'

export default function ProductNotFound() {
  const router = useRouter()
  const { isDark } = useThemeContext()

  return (
    <div className={`min-h-screen flex items-start justify-center px-4 pt-20`}>
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl p-8 sm:p-12 max-w-md w-full text-center border`}>
        {/* Icon */}
        <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto ${isDark ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40' : 'bg-gradient-to-r from-blue-100 to-purple-100'} rounded-full flex items-center justify-center`}>
          <Package className={`w-8 h-8 sm:w-10 sm:h-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>

        {/* Content */}
        <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mt-6`}>
          Product Not Found
        </h2>
        <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-3`}>
          This product doesn't exist or has been removed from our catalog.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <button
            onClick={() => router.back()}
            className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-semibold border-2 transform hover:scale-105 transition-all duration-200 text-sm sm:text-base ${isDark ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-blue-500 hover:text-blue-400' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-600 hover:text-blue-600'}`}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Go Back
          </button>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
          >
            Browse Products
          </Link>
        </div>

        {/* Error Code */}
        <p className={`mt-4 sm:mt-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Error: Product Not Available
        </p>
      </div>
    </div>
  )
}