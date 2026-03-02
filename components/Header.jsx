'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { ShoppingCart, Sun, Moon, User, Search, Store } from 'lucide-react'
import { useThemeContext } from '@/context/ThemeContext'
import { usePathname } from 'next/navigation'
import { profileApi } from '@/apis/userApi'
import ProfileModal from '@/modal/ProfileModal'
import { useCartContext } from '@/context/CartContext'
import { fetchCartItemsApi } from '@/apis/cartApi'
import { useProductContext } from '@/context/ProductContext'
import { useRouter } from 'next/navigation'
import DOMPurify from "dompurify"

const Header = () => {
  const [profileData, setProfileData] = useState(null);
  const profileRef = useRef(null);
  const currentPath = usePathname();
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter()
  const [showSuggestionBox, setShowSuggestionBox] = useState(true)


  const { cartItems, setCartItems } = useCartContext();
  const { isDark, isLoggedIn, setIsLoggedIn, setIsDark, showUserProfile, setShowUserProfile } = useThemeContext();
  const { searchQuery, setSearchQuery, filteredProducts, setCurrentPage } = useProductContext();

  // console.log("Filtered Products In Header:", filteredProducts);

  /* Input Suggestion Logic: */

  // filter suggestion products:
  const fsp = filteredProducts.flatMap(({ title, category, description }) => {
    const query = searchQuery.trim().toLowerCase()
    if (title.toLowerCase().startsWith(query)) {
      return [title.toLowerCase()]
    } else if (category.toLowerCase().startsWith(query)) {
      return [category.toLowerCase()]
    } else if (description.toLowerCase().startsWith(query)) {
      return [description.toLowerCase()]
    } else {
      return []
    }
  }
  );

  // Total number of suggestion products:
  const tsp = 6;
  const startingIndex = 0;
  const remainingSlot = fsp.length >= tsp ? tsp : tsp - fsp.length;
  // priority products:
  let spp = fsp.length >= tsp ? fsp.slice(startingIndex, remainingSlot) : [...fsp, ...filteredProducts.flatMap(({ title, category, description }) => {
    const query = searchQuery.trim().toLowerCase()
    if (!title.toLowerCase().startsWith(query) && title.toLowerCase().includes(query)) {
      return [title.toLowerCase()]
    } else if (!category.toLowerCase().startsWith(query) && category.toLowerCase().includes(query)) {
      return [category.toLowerCase()]
    } else if (!description.toLowerCase().startsWith(query) && description.toLowerCase().includes(query)) {
      return [description.toLowerCase()]
    } else {
      return []
    }
  }).slice(startingIndex, remainingSlot)];

  /* Reset to page 1 when search changes */
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Fetch profile data
  useEffect(() => {
    (async () => {
      try {
        const { data } = await profileApi()
        console.log("profile data:", data)
        setIsLoggedIn(true);
        setProfileData(data)
      } catch (error) {
        if (error.status === 401 && !error.response?.data?.success && error.response?.data?.error) {
          setIsLoggedIn(false)
        }
        console.log("Error while making profile request:", error);
      }
    })()
  }, [isLoggedIn])

  useEffect(() => {
    const handleClickOutside = (e) => {
      console.log(e.target)
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowUserProfile(false);
      }
    };

    if (showUserProfile) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };

  }, [showUserProfile])

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchCartItemsApi();
        console.log("Cart Data:", data)
        setCartItems(data.cartItems)
      } catch (error) {
        console.log("Error while fetching cart items:", error.message)
      }
    })()
  }, [setCartItems, isLoggedIn])

  const handleSearchQuery = (e) => {
    setSearchQuery(DOMPurify.sanitize(e.target.value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }))
    setShowSuggestionBox(true)
  }

  /* Total item Quantity: */
  const totalQuantity = cartItems?.reduce((prev, curr) => prev + curr.quantity, 0)

  console.log({ isLoggedIn })

  return (
    <header className={`py-5 ${isDark ? "bg-gray-900/90" : "bg-gray-50/90"} px-3 sm:px-6 md:px-10 lg:px-20 fixed w-full top-0 left-0 flex flex-wrap justify-between items-center z-50 shadow ${isDark ? "shadow-gray-800" : "border-gray-100 shadow-gray-200"}`}>
      {/* Logo */}
      <button onClick={() => {
        setSearchQuery("")
        router.push("/")
      }} className="flex items-center cursor-pointer">
        <div
          className={`
      p-2 rounded-full
      ${isDark ? "bg-gray-800 text-teal-400" : "bg-blue-100 text-blue-600"}
    `}
        >
          <Store className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </button>

      {/* Search Bar - Desktop */}
      <div
        className={`
    relative flex-1 max-w-xl mx-4
    hidden md:flex items-center
    px-5 py-2
    ${isDark
            ? isFocused && !searchQuery
              ? "bg-gray-800 border border-teal-400"
              : "bg-gray-800 border border-gray-700"
            : isFocused && !searchQuery
              ? "bg-white border border-blue-500"
              : "bg-white border border-gray-300"
          }

    ${isFocused && searchQuery && spp.length && showSuggestionBox
            ? "rounded-t-2xl"
            : "rounded-full"
          }
  `}
      >

        <input
          onBlur={() => {
            setIsFocused(false)
            setShowSuggestionBox(false)
          }}
          onFocus={() => {
            setIsFocused(true)
            setShowSuggestionBox(true)
          }
          }
          className={`
      flex-1  outline-none
      text-sm md:text-base px-5
       ${isDark
              ? "text-gray-100 placeholder-gray-500"
              : "text-gray-800 placeholder-gray-400"
            }
    `}
          placeholder="Search products..."
          type="text"
          value={searchQuery}
          onChange={handleSearchQuery}
          name="search"
          id="search"
        />

        <Search
          size={20}
          className={`shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        />

        {(spp?.length && searchQuery && isFocused || undefined) && showSuggestionBox && (
          <div
            className={`
      absolute ${isDark ? "-left-[0.5px]" : "-left-[1px]"} top-full
      rounded-b-2xl -right-[1px] 
      border border-t-0
      shadow-lg py-2
      max-h-fit 
      ${isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
              }
    `}
          >

            {spp.map((suggestion, i) => (
              <div
                key={i + 1}
                onMouseDown={(e) => {
                  e.preventDefault() // VERY IMPORTANT
                  setSearchQuery(suggestion)
                  setShowSuggestionBox(false)

                }}
                className={`
            flex items-center gap-3
             px-5 py-2 cursor-pointer
            text-sm max-w-[95%] rounded-r-full
            transition-colors
            ${isDark
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-700"
                  }
                  ${searchQuery.toLowerCase() === suggestion.slice(0, searchQuery.length) && i === 0 ? !isDark ? "bg-gray-200 py-2 px-5 rounded-r-full" : "bg-gray-700" : ""}
          `}
              >
                <Search
                  size={16}
                  className={isDark ? "text-gray-400" : "text-gray-500"}
                />
                <div className={`truncate`} >
                  {
                    suggestion.length > 50
                      ?
                      (
                        <p>
                          {
                            suggestion.slice(0, searchQuery.length).startsWith(searchQuery.trim().toLowerCase()) ? <strong>
                              {suggestion.slice(0, searchQuery.length)}</strong> : <span>{suggestion.slice(0, searchQuery.length)}</span>
                          }
                          <span>
                            {suggestion.slice(searchQuery.length).slice(0, 50) + "…"}
                          </span>
                        </p>
                      )
                      :
                      (
                        <p>
                          {
                            suggestion.slice(0, searchQuery.length).startsWith(searchQuery.trim().toLowerCase()) ? <strong>
                              {suggestion.slice(0, searchQuery.length)}</strong> : <span>{suggestion.slice(0, searchQuery.length)}</span>
                          }
                          <span>
                            {suggestion.slice(searchQuery.length)}
                          </span>
                        </p>
                      )
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className='flex gap-2 sm:gap-4 md:gap-6 items-center'>
        {isLoggedIn ? (
          /* Logged In State */
          <div ref={profileRef} className='flex relative gap-2 items-center'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUserProfile((prev) => !prev)
              }}
              className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
              aria-label="Profile"
            >
              <User size={20} className="sm:w-6 sm:h-6" />
            </button>
            {showUserProfile && profileData && (
              <ProfileModal setIsLoggedIn={setIsLoggedIn} profileData={profileData} setShowUserProfile={setShowUserProfile} />
            )}
          </div>
        ) : (
          /* Logged Out State */
          <div className='flex gap-1 sm:gap-2 md:gap-3 items-center'>
            <Link
              href="/login"
              className={`${currentPath === "/login" && `underline decoration-2 ${isDark ? "decoration-teal-600" : "decoration-blue-600"}`} px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${isDark ? "text-teal-400 hover:bg-gray-700" : "text-blue-600 hover:bg-gray-200/70"} transition-colors duration-200 rounded-lg`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`${currentPath === "/register" && `underline decoration-2 ${isDark ? "decoration-white" : "decoration-blue-600"}`} px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 ${isDark ? "bg-teal-600 text-white" : "bg-blue-100 text-blue-500"}`}
            >
              Register
            </Link>
          </div>
        )}

        {/* Cart */}
        <Link
          href="/cart"
          className={`relative p-2 ${isDark ? "hover:text-gray-100 hover:bg-gray-700" : "hover:bg-gray-200"} rounded-lg transition-colors duration-200`}
          aria-label="Shopping cart"
        >
          <ShoppingCart onClick={() => {
            setSearchQuery("")
          }} size={20} className="sm:w-6 sm:h-6" />
          <span className='absolute -top-2.5 sm:right-2 right-1.5 w-5 h-5  bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold shadow-lg'>
            {totalQuantity || 0}
          </span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 ${isDark ? "hover:text-gray-100 hover:bg-gray-700" : "hover:bg-gray-200"} rounded-lg transition-colors duration-200`}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} className="sm:w-6 sm:h-6" /> : <Moon size={20} className="sm:w-6 sm:h-6" />}
        </button>
      </nav>

      {/* Search Bar - Mobile (Below header) */}
      <div className={`w-full md:hidden mt-2 flex items-center rounded-full px-4 py-2 ${isDark
        ? "bg-gray-800 border border-gray-700 focus-within:border-teal-500"
        : "bg-white border border-gray-300 focus-within:border-blue-500"
        }`}>
        <input
          className={`outline-none bg-transparent flex-1 text-sm ${isDark ? "text-gray-100 placeholder-gray-500" : "text-gray-800 placeholder-gray-400"}`}
          placeholder='Search products...'
          type="text"
          value={searchQuery}
          onChange={handleSearchQuery}
          name="search-mobile"
          id="search-mobile"
        />
        <Search className={isDark ? "text-gray-400" : "text-gray-500"} size={18} />
      </div>
    </header >
  )
}

export default Header