import { axiosWithCreds } from "./axiosInstance";

export const fetchProducts = async () => {
  return axiosWithCreds.get("/products/load")
}

export const fetchProductDetails = async (productId) => {
  return axiosWithCreds.get(`/products/${productId}`)
}