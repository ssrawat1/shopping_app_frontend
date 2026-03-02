'use client'
import { useThemeContext } from '@/context/ThemeContext'
import Link from 'next/link'
import React, { useState } from 'react'
import loginValidator from "@/validator/authValidator.js"
import { loginApi } from '@/apis/userApi'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fetchCartItemsApi } from '@/apis/cartApi'
import { useCartContext } from '@/context/CartContext'
import DOMPurify from "dompurify"

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  const { isDark, setIsLoggedIn } = useThemeContext()
  const { setCartItems } = useCartContext()
  const [errors, setErrors] = useState({})
  const [isAllowToSubmit, setIsAllowToSubmit] = useState(false);

  /* Verify status: */
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false)

  /* Server Error State: */
  const [loginError, setLoginError] = useState(null)
  const router = useRouter()

  /* onChange Handler: */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) }));
    const inputFiledErrors = loginValidator({ [name]: value }, setErrors);
    if (!Object.keys(inputFiledErrors).length && Object.values(loginData).every(val => val)) {
      setIsAllowToSubmit(true)
    } else {
      setIsAllowToSubmit(false)
    }
  }

  /* Handle Focus: */
  const handleFocus = (e) => {
    const { name, value } = e.target
    loginValidator({ [name]: value }, setErrors);
  }

  /* Handle Blur: */
  const handleBlur = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  /* Handle Submit: */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const cleanUserInput = {};
    Object.entries(loginData).forEach(([key, val]) => {
      cleanUserInput[key] = key === "email"
        ? val.trim().toLowerCase()
        :
        val.trim()
    });
    if (Object.keys(loginValidator(cleanUserInput, setErrors)).length) return;
    try {
      setIsVerifying(true)
      const { data } = await loginApi(loginData);
      const { data: cartData } = await fetchCartItemsApi();
      if (cartData.success && cartData) {
        setCartItems(cartData.cartItems)
      }
      setIsVerifying(false)
      setIsVerified(true)
      setErrors({})
      setIsLoggedIn(true)
      setLoginData({ email: "", password: "" });
      setTimeout(() => router.push("/"), 2000)
    } catch (error) {
      setIsVerifying(false)
      if (error.status === 401 && !error.response.data.success && error.response.data.error) {
        setLoginError(error.response.data);
      }
      setTimeout(() => setLoginError(null), 2000)
    }
  }

  return (
    <div
      className="flex mt-4 md:mt-12 sm:mt-24 items-center justify-center px-4 sm:px-6"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      <form
        onSubmit={handleLoginSubmit}
        autoComplete='off'
        className={`${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"} rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-6 w-full max-w-sm sm:max-w-md`}
      >
        <div className="text-center space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-inherit">Welcome Back</h1>
          <p className="text-inherit text-xs sm:text-sm">Please sign in to your account</p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-inherit">
              Email Address
            </label>
            <input
              value={loginData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              type="email"
              name="email"
              id="email"
              autoComplete='off'
              required
              placeholder="Enter your email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-gray-400"
            />
            {errors.email && <p className='text-red-600 text-xs'>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-inherit">
              Password
            </label>
            <input
              value={loginData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              type="password"
              name="password"
              id="password"
              autoComplete='off'
              required
              placeholder="Enter your password"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-gray-400"
            />
            {errors.password && <p className='text-red-600 text-xs'>{errors.password}</p>}
          </div>
        </div>

        {loginError?.error && <div className='w-full bg-red-200 py-2 px-3 sm:px-4 text-xs sm:text-sm rounded text-red-600 text-center'><strong>{loginError.error}</strong></div>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isAllowToSubmit || isVerifying || isVerified}
          className={`${!isAllowToSubmit || isVerifying ? "cursor-not-allowed bg-gray-400" : `${isVerified ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`} w-full text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl`}
        >
          {
            isVerifying ? <span>Verifying...</span> : (isVerified ? <p className='flex justify-center items-center gap-1.5 sm:gap-2'><span>Success</span><CheckCircle className='w-4 h-4 sm:w-5 sm:h-5' /></p> : <span>Verify & Login</span>)
          }
        </button>

        {/* Terms and Sign Up */}
        <div className="space-y-3 sm:space-y-4 pt-2">
          <p className="text-[10px] sm:text-xs text-inherit leading-relaxed">
            By continuing, you agree to our{' '}
            <Link href="/terms-of-services" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Terms of Services
            </Link>
            . Learn how we collect, use, and protect your information in our{' '}
            <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="text-center pt-2 border-t border-gray-200">
            <span className="text-xs sm:text-sm text-inherit">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Sign up here
              </Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login