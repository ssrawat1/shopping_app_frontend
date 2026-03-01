"use client"
import { fetchProducts } from '@/apis/productsApi'
import { useEffect, useState } from 'react'
import { Loader2, XCircle } from 'lucide-react'
import { useThemeContext } from '@/context/ThemeContext'
import Link from 'next/link'
import { addToCartApi, fetchCartItemsApi } from '@/apis/cartApi'
import { useCartContext } from '@/context/CartContext'
import Pagination from '@/components/Pagination'
import { useProductContext } from '@/context/ProductContext'

const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isServerError, setIsServerError] = useState(false)
  const { isDark, isLoggedIn } = useThemeContext();
  const { setCartItems, searchQuery } = useCartContext();
  const { setProducts, paginatedProducts, setCurrentPage } = useProductContext();

  /* Reset to page 1 when search changes */
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchProducts()
        setProducts(data);
        setIsLoading(false)
      } catch (error) {
        console.log("Error while loading products:", error)
        setIsLoading(false);
        if (
          error.status === 404 &&
          !error.response.data.success &&
          error.response.data.error
        ) {
          setIsServerError(error.response.data)
        }
      }
    })()
  }, [isLoggedIn])

  const handleAddToCart = async (productId) => {
    try {
      const { data } = await addToCartApi({ productId });
      const { data: cartData } = await fetchCartItemsApi();
      console.log("cart items:", cartData)
      if (cartData.success && cartData) {
        setCartItems(cartData.cartItems)
      }
      console.log("Add to Cart Response:", data)
    } catch (error) {
      console.log("Error While Adding Product to Cart:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className={`animate-spin h-12 w-12 ${isDark ? "text-teal-400" : "text-blue-600"}`} />
      </div>
    )
  }

  if (!isServerError.success && isServerError.error) {
    return (
      <div className='flex flex-col gap-2 text-gray-400 font-bold text-xl items-center min-h-screen justify-center'>
        <XCircle size={50} />
        <span className='text-inherit'>{isServerError.error}</span>
      </div>
    )
  }

  return (
    <section className="px-4 w-full mt-32 sm:mt-32 md:mt-24 sm:px-6 lg:px-8 py-6 pb-20 max-w-screen-2xl mx-auto">
      <div className={`grid gap-4 sm:gap-6 ${paginatedProducts.length === 1
        ? 'grid-cols-1 max-w-sm mx-auto'
        : paginatedProducts.length === 2
          ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
          : paginatedProducts.length === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
        {paginatedProducts.length ? (
          paginatedProducts.map(
            ({
              _id: id,
              title,
              price,
              category,
              thumbnail,
              rating,
              brand,
              discountPercentage,
              availabilityStatus
            }) => (
              <article
                key={id}
                className={`rounded-2xl overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-shadow min-w-0
                  ${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}
                `}
              >
                {/* Image */}
                <div className={`h-48 sm:h-56 flex items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                  <img
                    src={thumbnail}
                    width={500}
                    height={500}
                    alt={title}
                    loading="lazy"
                    className="object-contain h-full w-full p-4"
                  />
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
                  <div className="min-w-0">
                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-semibold leading-tight mb-2 line-clamp-2 break-words">
                      {title}
                    </h3>

                    {/* Category & Brand */}
                    <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
                      <span className={`inline-block text-xs px-2 py-1 rounded-full whitespace-nowrap ${isDark ? "bg-gray-600 text-gray-200" : "bg-gray-100 text-gray-700"
                        }`}>
                        {category}
                      </span>
                      {brand && (
                        <span className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          <strong className={isDark ? "text-gray-200" : "text-gray-800"}>
                            {brand}
                          </strong>
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${isDark ? "bg-yellow-400/10 text-yellow-300" : "bg-yellow-50 text-yellow-800"
                        }`}>
                        <span>★</span>
                        <span className="font-medium">{rating ?? "-"}</span>
                      </div>
                      {availabilityStatus && (
                        <span className={`text-xs font-medium ${isDark ? "text-green-400" : "text-green-600"
                          }`}>
                          {availabilityStatus}
                        </span>
                      )}
                    </div>

                    {/* Price & Discount */}
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                      <div className={`text-base sm:text-lg font-bold px-3 py-1 rounded-lg ${isDark ? "bg-gray-600 text-white" : "bg-indigo-50 text-blue-600"
                        }`}>
                        ${price}
                      </div>

                      {discountPercentage > 0 && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded whitespace-nowrap">
                          {discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAddToCart(id)}
                      className={` cursor-pointer flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isDark
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                        }`}
                    >
                      Add to cart
                    </button>

                    <Link
                      href={`/products/${id}`}
                      className={` cursor-pointer text-center flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isDark
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        }`}
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            )
          )
        ) : (
          <div className="col-span-full flex flex-col items-center gap-3 min-h-[60vh] justify-center text-center">
            <XCircle
              size={56}
              className={isDark ? "text-gray-400" : "text-gray-500"}
            />
            <h3 className={`text-xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              No products found
            </h3>
          </div>
        )}
      </div>
      {paginatedProducts.length > 0 && <Pagination />}
    </section>
  )
}

export default Products