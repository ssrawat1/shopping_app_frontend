import { axiosWithoutCreds } from "./axiosInstance.js";


/* Send OTP: & Resend OTP: */
export const sendOtpApi = async (userData) => {
  console.log("Sending OTP Request Initiated...", userData);
  return await axiosWithoutCreds.post("/auth/send-otp", userData);
}

/* Verify OTP: */
export const verifyOtpApi = async ({ userOtp, email }) => {
  console.log("Verifying OTP Request Initiated...", { userOtp });
  return await axiosWithoutCreds.post("/auth/verify-otp", { userOtp, email });
}

