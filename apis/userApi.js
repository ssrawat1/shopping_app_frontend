import { axiosWithCreds, axiosWithoutCreds } from "./axiosInstance.js";

/* Register Api: */
export const registerApi = async (userData) => {
  console.log("Sending Register Request Initiated...");
  return await axiosWithoutCreds.post("/user/register", userData)
}

/* Login Api: */
export const loginApi = async (loginData) => {
  console.log("Sending Loging Request Initiated...");
  return await axiosWithCreds.post("/user/login", loginData)
}

/* Profile Api: */
export const profileApi = async () => {
  return await axiosWithCreds.get("/user/profile")
}

/* Logout Api: */
export const logoutApi = async () => {
  return await axiosWithCreds.post("/user/logout")
}