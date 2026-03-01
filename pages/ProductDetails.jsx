"use client"
import { fetchProductDetails } from '@/apis/productsApi'
import { useThemeContext } from '@/context/ThemeContext'
import { Loader2, XCircle, ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Package
} from "lucide-react";
import { useCartContext } from '@/context/CartContext'
import { addToCartApi, fetchCartItemsApi } from '@/apis/cartApi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'


const ProductDetails = ({ productId }) => {
  const [productData, setProductData] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false)
  const { isDark } = useThemeContext()
  const router = useRouter()
  const { setCartItems } = useCartContext()

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

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const { data } = await fetchProductDetails(productId);
        console.log("Product Detail Api Response:", data);
        setProductData(data.productDetails)
        setIsLoading(false)
        setIsError(false)
      } catch (error) {
        setIsLoading(false)
        console.log("Error while making Api call to product details:", error)
        if (error.status === 404 && !error.response.data.success && error.response.data.error) {
          setIsError(error.response.data)
        }
      }
    })()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className={`animate-spin h-12 w-12 ${isDark ? "text-teal-400" : "text-blue-600"}`} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex flex-col gap-2 text-gray-400 font-bold text-xl items-center min-h-screen justify-center'>
        <XCircle size={50} />
        <span className='text-inherit'>{isError.error}</span>
      </div>
    )
  }

  console.log(productData)

  return (
    <section className="max-w-7xl mt-32 sm:mt-32 md:mt-20 mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-7 inline-block">
        <button onClick={() => router.back()} className={`flex justify-center items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer ${isDark
          ? "bg-teal-600 text-white hover:bg-teal-700"
          : "bg-gray-200 hover:bg-gray-300"
          }`}>
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-10 ${isDark ? "text-gray-200" : "text-gray-800"
          }`}
      >
        {/* LEFT: Images */}
        <div className="flex flex-col gap-4">

          <div
            className={`rounded-3xl overflow-hidden flex items-center justify-center h-[420px]
          ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
          >
            <Link href={productData.thumbnail}>
              <Image
                src={productData.thumbnail}
                alt={productData.title}
                width={600}
                height={600}
                className="object-contain h-full w-full p-6"
              />
            </Link>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 justify-center">
            {productData.images?.map((img, idx) => (
              <div
                key={idx}
                className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer
              ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
              >
                <Link href={img}>
                  <Image
                    src={img}
                    alt="product"
                    width={80}
                    height={80}
                    className="object-contain w-full h-full p-2"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="flex flex-col gap-5">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold">
            {productData.title}
          </h1>

          {/* Brand & Category */}
          <div className="flex flex-wrap gap-3 text-sm">
            <span
              className={`px-3 py-1 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
            >
              {productData.brand}
            </span>
            <span
              className={`px-3 py-1 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
            >
              {productData.category}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="font-semibold">{productData.rating}</span>
            <span className="text-sm text-gray-500">
              ({productData.reviews?.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-500">
              ${productData.price}
            </span>
            {productData.discountPercentage > 0 && (
              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                {productData.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Stock */}
          <p
            className={`text-sm font-semibold ${productData.stock > 0 ? "text-green-500" : "text-red-500"
              }`}
          >
            {productData.availabilityStatus}
          </p>

          {/* Description */}
          <p className="leading-relaxed text-sm sm:text-base">
            {productData.description}
          </p>

          {/* Extra Info */}
          {/* Extra Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-2">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl
    ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}`}
            >
              <Truck size={18} />
              <span>{productData.shippingInformation}</span>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl
    ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}`}
            >
              <ShieldCheck size={18} />
              <span>{productData.warrantyInformation}</span>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl
    ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}`}
            >
              <RotateCcw size={18} />
              <span>{productData.returnPolicy}</span>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl
    ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}`}
            >
              <Package size={18} />
              <span>Stock: {productData.stock}</span>
            </div>
          </div>


          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => handleAddToCart(productId)}
              className={`flex-1 py-3 rounded-full cursor-pointer font-semibold transition
            ${isDark
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              Add to Cart
            </button>

            <button
              className={`flex-1 py-3 rounded-full font-semibold transition cursor-pointer
            ${isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              Buy Now
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {productData.tags?.map((tag, i) => (
              <span
                key={i}
                className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {/* Reviews */}
      <div
        className={`mt-14 max-w-4xl mx-auto rounded-3xl p-5 sm:p-6
  ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
      >
        <h2 className="text-xl font-bold mb-5 text-center">
          Customer Reviews
        </h2>

        <div className="flex flex-col gap-4">
          {productData.reviews?.map((review) => (
            <div
              key={review._id}
              className={`p-4 rounded-2xl
        ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm sm:text-base truncate">
                  {review.reviewerName}
                </p>

                <span className="flex items-center gap-1 text-yellow-400 text-sm">
                  ★ {review.rating}
                </span>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(review.date).toDateString()}
              </p>

              {/* Comment */}
              <p className="mt-2 text-sm leading-relaxed line-clamp-3">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>


    </section>
  )

}

export default ProductDetails
