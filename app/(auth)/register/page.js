"use client"
import { useThemeContext } from '@/context/ThemeContext'
import Link from 'next/link'
import React, { useState } from 'react'
import registerValidator, { otpValidator } from "@/validator/authValidator.js"
import { registerApi } from '@/apis/userApi.js'
import { sendOtpApi, verifyOtpApi } from '@/apis/otpApi.js'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DOMPurify from "dompurify"

const Register = () => {
  /* Register State */
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [errors, setErrors] = useState({});
  const [isAllowToSubmit, setIsAllowToSubmit] = useState(false)
  const { isDark } = useThemeContext();
  /* OTP State */
  const [otp, setOtp] = useState(Array.from({ length: 6 }).fill(""))
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [showOtpCreateAccount, setShowOtpCreateAccount] = useState(false)
  /* Re-send Otp: */
  const [isResendOtp, setIsResendOtp] = useState(false)
  const [isResendSucceed, setIsResendSucceed] = useState(false);
  /* submitting */
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitSucceed, setIsSubmitSucceed] = useState(false)
  /* Error While Creating Account: */
  const [createAccountError, setCreateAccountError] = useState(null)
  const [sendOtpError, setSendOtpError] = useState(null)

  const router = useRouter()

  /* Handle onChange */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) }));
    const inputFiledErrors = registerValidator({ [name]: value.trim() }, setErrors)
    setErrors(inputFiledErrors);
    if (!Object.keys(inputFiledErrors).length && Object.values(userData).every(val => val)) {
      setIsAllowToSubmit(true)
    } else {
      setIsAllowToSubmit(false)
    }
  }

  /* Handle Focus: */
  const handleFocus = (e, index) => {
    const { name, value, key } = e.target
    if (name === "otp") {
      otp[index] = value
      otpValidator({ [name]: otp }, setErrors)
      return
    }
    registerValidator({ [name]: value }, setErrors);
  }

  /* Handle Blur: */
  const handleBlur = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  /* Handle Verification: */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setIsSendingOtp(true)
      const { data } = await sendOtpApi({ email: DOMPurify.sanitize(userData.email, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) });
      if (!data.success && data.error) { }
      setShowOtpVerification(true)
      setIsSendingOtp(false)
      setIsAllowToSubmit(false)
      setShowOtpCreateAccount(false)
    } catch (error) {
      console.log("error while sending otp request:", error.message);
      if (error.status === 404 || !error.response.data.success) {
        setSendOtpError(error.response.data)
        setIsSendingOtp(false);
      }
      setTimeout(setSendOtpError, 2000)
    }
  }

  /* Handle Change Otp: */
  const handleChangeOtp = (index, value) => {
    setOtp((prev) => {
      prev[Number(index)] = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
      return [...prev]
    });
    otp[index] = value;
    const otpValidationErrors = otpValidator({ otp }, setErrors);
    if (Object.keys(otpValidationErrors).length) {
      setIsAllowToSubmit(false)
    } else {
      setIsAllowToSubmit(true)
    }

    /* Handle Auto-focus to next input if value is entered */
    if (value && index < 5) {
      document.querySelector(`#otp-${index + 1}`)?.focus();
    }
  }

  /* Handle key down (To prevent from negative number ): */
  const handleKeyDown = (index, e) => {
    // Handle right arrow
    if (e.key === "ArrowRight" && index < 5) {
      document?.querySelector(`#otp-${index + 1}`).focus()
    } else if (e.key === "ArrowLeft" && index > 0) {// Handle left arrow
      document?.querySelector(`#otp-${index - 1}`).focus()
    } else if (e.key === "Backspace") {// Handle backspace
      if (!otp[index] && index > 0) {
        document?.querySelector(`#otp-${index - 1}`).focus()
      } else {
        // clearing current filed
        otp[index] = "";
        setOtp((prev) => ([...prev]))
        const otpValidationErrors = otpValidator({ otp }, setErrors);
        if (Object.keys(otpValidationErrors).length) {
          setIsAllowToSubmit(false)
        } else {
          setIsAllowToSubmit(true)
        }
      }
    }
  }

  /* Handle Paste: */
  const handlePaste = (e) => {
    e.preventDefault();
    const copiedData = e.clipboardData.getData("text").replaceAll(/\D/g, "").slice(0, 6);
    if (copiedData && copiedData.length) {
      const copiedOtpArray = copiedData.split("");
      const requiredOtpArray = [...copiedOtpArray, ...Array.from({ length: 6 - copiedOtpArray.length }).fill("")]
      setOtp(requiredOtpArray);
      document?.querySelector(`#otp-${Math.min(requiredOtpArray.length, 5)}`).focus()
      const otpValidationErrors = otpValidator({ otp: requiredOtpArray }, setErrors);
      if (Object.keys(otpValidationErrors).length) {
        setIsAllowToSubmit(false)
      } else {
        setIsAllowToSubmit(true)
      }
    }
  }

  /* Handle Submit: */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUserInput = {};
    Object.entries(userData).forEach(([key, val]) => {
      cleanUserInput[key] = key === "email"
        ? val.trim().toLowerCase()
        :
        val.trim()
    });
    if (Object.keys(registerValidator(cleanUserInput, setErrors)).length) return;

    try {
      setIsSubmitting(true)
      const { data } = await registerApi(userData);
      setIsSubmitting(false)
      setIsSubmitSucceed(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
      setErrors({})
      setUserData({ name: "", email: "", password: "" });
    } catch (error) {
      if (error.status === 409) {
        setCreateAccountError(error.response.data)
        setIsSubmitting(false)
        setIsSubmitSucceed(false)
      }
      setTimeout(() => setCreateAccountError(null), 2000)
    }
  }

  /* Handle Verify Otp: */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValidationError = otpValidator({ otp }, setErrors);
    try {
      setIsOtpVerifying(true)
      const { data } = await verifyOtpApi({ userOtp: otp.join(""), email: userData.email })
      if (!data.success && data.error) {
        // setErrors(data.errors)
      }
      setIsOtpVerifying(false)
      setIsOtpVerified(true);
      setOtp(["", "", "", "", "", ""])

      setTimeout(() => {
        setShowOtpCreateAccount(true)
        setIsAllowToSubmit(true)
        setIsOtpVerified(false);
      }, 2000)
    } catch (error) {
      if (error.status === 400 && !error.response.data.success && error.response.data.error) {
        setErrors({ otp: error.response.data.error })
      }
      setTimeout(() => {
        setErrors({})
        setIsOtpVerifying(false)
      }, 2000)
    }
  }

  /* Handle Resend OTP: */
  const handleResendOtp = async () => {
    try {
      setIsResendOtp(true)
      const { data } = await sendOtpApi({ email: userData.email });
      if (!data.success && data.error) { }
      setIsResendOtp(false);
      setIsResendSucceed(true);
      setTimeout(() => {
        setIsResendSucceed(false)
      }, 2000)
    } catch (error) {
      console.log("Error while re-rending otp:", error.message)
    }
  }

  return (
    <div
      className="flex mt-16 sm:mt-28 md:mt-20 items-center justify-center px-4 sm:px-6"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      {!showOtpVerification ?
        <form onSubmit={handleSendOtp} autoComplete='off' className={`${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"} rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-6 w-full max-w-sm sm:max-w-md`}>
          {/* Header */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-inherit">Create Account</h1>
            <p className="text-inherit text-xs sm:text-sm">Enter your details to get started</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white font-semibold text-xs sm:text-sm shadow-md">
              1
            </div>
            <div className="w-16 sm:w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-blue-600 rounded-full"></div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-gray-400 font-semibold text-xs sm:text-sm">
              2
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 sm:space-y-2">
            {/* Full Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-inherit">
                Full Name
              </label>
              <input
                value={userData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={(e) => handleFocus(e)}
                type="text"
                name="name"
                required
                id="name"
                autoComplete='off'
                placeholder="Enter your full name"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-gray-400"
              />
              {errors.name && <p className='text-red-600 text-xs'>{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-inherit">
                Email Address
              </label>
              <input
                value={userData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={(e) => handleFocus(e)}
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
                value={userData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={(e) => handleFocus(e)}
                type="password"
                name="password"
                id="password"
                autoComplete='off'
                required
                placeholder="Create a strong password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-gray-400"
              />
              {errors.password && <p className='text-red-600 text-xs'>{errors.password}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isAllowToSubmit || isSendingOtp}
            className={`${!isAllowToSubmit || isSendingOtp ? "cursor-not-allowed bg-gray-400" : "cursor-pointer bg-blue-600 hover:bg-blue-700"} w-full text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg shadow-lg`}
          >
            {isSendingOtp ? <span className='text-white font-bold'>Sending OTP...</span> : "Send Verification Code"}
          </button>
          {sendOtpError?.error && <div className='w-full bg-red-200 py-2 px-3 sm:px-4 text-xs sm:text-sm rounded text-red-600 text-center font-semibold'><span>{sendOtpError.error}</span></div>}

          {/* Terms and Sign In */}
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
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Sign in here
                </Link>
              </span>
            </div>
          </div>
        </form>
        : <form onSubmit={showOtpCreateAccount ? handleSubmit : handleVerifyOtp} autoComplete='off' className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-6 w-full max-w-sm sm:max-w-md`}>
          {/* Header */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{isOtpVerified || showOtpCreateAccount ? "Create Account" : "OTP Verification"}</h1>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm`}>{isOtpVerified || showOtpCreateAccount ? "Verification completed create your account now" : "Verify your email to complete registration"}</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white font-semibold text-xs sm:text-sm shadow-md">
              1
            </div>
            <div className={`w-12 sm:w-16 h-1.5 ${isDark ? "bg-gray-600" : "bg-gray-300"} rounded-full`}>
              <div className="h-full w-full bg-green-600 rounded-full"></div>
            </div>
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${isDark ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-400"} ${isOtpVerified || showOtpCreateAccount && "bg-green-600 text-white"} font-semibold text-xs sm:text-sm`}>
              2
            </div>
          </div>

          <div className={`${isDark ? "bg-gray-500 border-blue-800" : "bg-blue-50 border-blue-200 text-blue-900"} w-full py-2 sm:py-3 px-3 sm:px-5 rounded-lg border text-center`}>
            <p className="text-xs sm:text-sm flex flex-col items-center gap-1.5 sm:gap-2">
              {showOtpCreateAccount || isOtpVerified ?
                <span className='text-green-600 font-semibold text-xs sm:text-sm'>Verification has been completed</span> :
                <span className='text-inherit font-bold text-xs sm:text-sm'>we've sent a {isResendSucceed ? <strong className='text-purple-400'>New</strong> : ""} 6 digit verification code to</span>
              }
              <strong className={`${isDark ? "text-teal-300 font-bold" : "text-teal-600"} font-semibold text-xs sm:text-sm break-all`}>
                {showOtpCreateAccount || isOtpVerified ? <CheckCircle color='green' className='w-5 h-5 sm:w-6 sm:h-6' /> : <span className='text-inherit'>{userData.email}</span>}
              </strong>
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 pt-2">
            <button
              onClick={() => {
                setShowOtpVerification(false)
                setShowOtpCreateAccount(false),
                  setIsAllowToSubmit(true)
                setOtp(["", "", "", "", "", ""])
                router.push("/register")
              }}
              disabled={isOtpVerified || isOtpVerifying || isSubmitSucceed || isSubmitting}
              className={`${isOtpVerified || isOtpVerifying || isSubmitSucceed || isSubmitting ? "cursor-not-allowed" : "cursor-pointer"} flex shadow items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${isDark ? `text-gray-100 hover:text-white ${showOtpCreateAccount && "bg-blue-900/10 border-blue-800"} hover:bg-blue-900/20` : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"} ${showOtpCreateAccount && "w-full flex justify-center bg-blue-300/20 border border-blue-300"}`}
            >
              <ArrowLeft className='w-3 h-3 sm:w-4 sm:h-4' />
              <span className='text-xs sm:text-sm'>Back to Details</span>
            </button>
            {
              !showOtpCreateAccount && <button
                onClick={handleResendOtp}
                disabled={isOtpVerified || isResendOtp}
                className={`${showOtpCreateAccount || isOtpVerified || isResendOtp || isOtpVerified || isOtpVerifying ? "cursor-not-allowed" : "cursor-pointer"} px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${isDark ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/20" : "text-blue-600 hover:text-blue-700 shadow hover:bg-blue-50"}`}
              >
                {isResendOtp ? <span className='text-green-600 font-semibold'>Sending...</span> : (isResendSucceed ? <p className='flex gap-1.5 sm:gap-2 justify-center items-center'><span className='text-green-600'>Success</span> <CheckCircle className='w-3 h-3 sm:w-4 sm:h-4' color='green' /></p> : <span>Resend Code</span>)}
              </button>
            }
          </div>
          {
            !showOtpCreateAccount && !isOtpVerified && <div className="space-y-3 sm:space-y-4">
              <label className={`block text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Verification Code
              </label>
              <div className="flex gap-1.5 sm:gap-2 md:gap-3 justify-center items-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleChangeOtp(index, e.target.value)}
                    name='otp'
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    type="number"
                    required
                    autoComplete='off'
                    onFocus={(e) => handleFocus(e, index)}
                    onBlur={handleBlur}
                    onInput={(e) => {
                      let { value } = e.target
                      if (value.length > 1) {
                        e.target.value = value[0];
                      }
                    }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl border-b-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium
        ${isDark ? 'text-gray-300 border-b-gray-500' : 'bg-white text-blue-600 border-b-blue-700'}
        focus:outline-none transition-all duration-200`}
                  />
                ))}
              </div>
              {errors.otp && <p className='text-red-600 text-xs sm:text-sm font-semibold py-2 px-3 sm:px-5 bg-red-100 rounded'>{errors.otp}</p>}
            </div>
          }
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isAllowToSubmit || isOtpVerified || isOtpVerifying || isSubmitting || isSubmitSucceed}
            className={`${!isAllowToSubmit || isOtpVerifying || isSubmitting ? "cursor-not-allowed bg-gray-400" : isOtpVerified || isSubmitSucceed ? "bg-green-600 cursor-not-allowed hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} w-full text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg shadow-lg transition-all duration-200`}
          >
            {showOtpCreateAccount ? (isSubmitting ? "Creating Account..." : (isSubmitSucceed ? <p className='flex justify-center gap-1.5 sm:gap-2 items-center'><span>Success</span> <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5' /></p> : "Create Account")) : isOtpVerified ? <p className='flex gap-1.5 sm:gap-2 justify-center items-center'><span>Verified</span><CheckCircle className='w-4 h-4 sm:w-5 sm:h-5' /></p> : !isOtpVerifying ? "Verify OTP" : "Verifying..."}
          </button>

          {createAccountError?.error && <div className='w-full bg-red-200 py-2 px-3 sm:px-4 text-xs sm:text-sm rounded text-red-600 text-center'><strong>{createAccountError.error}</strong></div>}

          {/* Terms and Sign In */}
          <div className={`pt-3 sm:pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <div className="text-center">
              <span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                  Sign in here
                </Link>
              </span>
            </div>
          </div>
        </form>
      }
    </div>
  )
}

export default Register