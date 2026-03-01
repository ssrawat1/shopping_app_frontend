import { axiosWithCreds } from "./axiosInstance"

/* Add To Cart Api: */
export const addToCartApi = async ({ productId }) => {
  console.log("Calling to Add to cart Api:", productId)
  return await axiosWithCreds.post(`/cart/items/${productId}`)
}

/* Fetch Cart Items: */
export const fetchCartItemsApi = async () => {
  return await axiosWithCreds.get("/cart/items")
}

/* Increase Quantity: */
export const increaseCartItemQuantityApi = async ({ id }) => {
  return await axiosWithCreds.patch(`/cart/items/${id}/increase`)
}

/* Decrease Quantity: */
export const decreaseCartItemQuantityApi = async ({ id }) => {
  return await axiosWithCreds.patch(`/cart/items/${id}/decrease`)
}

/* Delete Specific Cart Item: */
export const removeCartItemApi = async ({ id }) => {
  return await axiosWithCreds.delete(`/cart/items/${id}`)
}

/* Delete All cart Items: */
export const removeAllItemsApi = async () => {
  return await axiosWithCreds.delete('/cart/items')
}
