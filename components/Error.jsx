"use client"
import { useRouter } from "next/navigation"
import { startTransition } from "react"
import { AlertCircle, RefreshCw, ShoppingBag } from 'lucide-react'
import { useThemeContext } from "@/context/ThemeContext"
 
export default function ErrorContent({ reset }) {
  const { isDark } = useThemeContext()
  const router = useRouter()

  const handleRetry = () => {
    startTransition(() => {
      router.refresh()
      reset()
    })
  }

  return (
    <>
      <div
        className="flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <div className='text-center w-full max-w-sm sm:max-w-md lg:max-w-lg'>
          {/* Icon */}
          <div className='flex justify-center mb-4 sm:mb-6 lg:mb-8'>
            <div className='relative'>
              <div className={`absolute inset-0 rounded-full blur-lg sm:blur-xl opacity-40 ${isDark ? 'bg-red-500' : 'bg-red-400'
                }`}></div>
              <div className={`relative inline-flex items-center justify-center rounded-full ${isDark ? 'bg-gray-800 border-2 border-red-900/50' : 'bg-red-50 border-2 border-red-100'
                } w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24`}>
                <AlertCircle
                  className={`${isDark ? 'text-red-400' : 'text-red-600'} w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12`}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className={`font-bold mb-2 sm:mb-3 lg:mb-4 text-2xl sm:text-3xl lg:text-4xl ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            Oops! Something Went Wrong
          </h2>

          {/* Description */}
          <p className={`leading-relaxed mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base lg:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
            We encountered an error while loading this page. Our team has been notified and we're working to fix it.
          </p>

          {/* Button */}
          <div className='flex justify-center'>
            <button
              onClick={handleRetry}
              className='inline-flex items-center justify-center gap-2 lg:gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 py-2.5 px-6 text-sm sm:py-3 sm:px-8 sm:text-base lg:py-4 lg:px-10'
            >
              <RefreshCw className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6' />
              Try Again
            </button>
          </div>

          {/* Back to Shopping */}
          <div className={`mt-5 pt-5 sm:mt-6 sm:pt-6 lg:mt-8 lg:pt-8 ${isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'
            }`}>
            <button
              onClick={() => router.push('/cart')}
              className={`text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 mx-auto transition-colors ${isDark
                ? 'text-gray-400 hover:text-orange-400'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <ShoppingBag className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
              Back to Shopping
            </button>
          </div>

          {/* Help Text */}
          <div className='mt-3 sm:mt-4 lg:mt-6'>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500 hover:text-orange-400' : 'text-gray-400'
              }`}>
              Need assistance? Contact our support team
            </p>
          </div>
        </div>
      </div>
    </>

  )
}