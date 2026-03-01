import axios from "axios";

/* Base URL: */
const BASE_URL = process.env.NEXT_PUBLIC_DB_URL

export const axiosWithCreds = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})

export const axiosWithoutCreds = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})