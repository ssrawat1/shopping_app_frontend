/* Validation Rules: */
const validateConfig = {
  name: [
    { required: true, message: "Name is required" },
    { minLength: 2, message: "Name must be at least 2 characters" }
  ],
  email: [
    { required: true, message: "Email is required" },
    {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Enter a valid email address"
    }
  ],
  password: [
    { required: true, message: "Password is required" },
    { minLength: 8, message: "Password must be at least 8 characters" },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      message: "Include 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    }
  ]
}

/* Validate rules: */
export default function validator(data, setErrors) {
  const inputValidationError = {}
  Object.entries(data).forEach(([key, value]) => {
    validateConfig[key].some((rule) => {
      if (rule.required && !value) {
        inputValidationError[key] = rule.message
        return true
      } else if (rule.minLength && value.length < rule.minLength) {
        inputValidationError[key] = rule.message
        return true
      } else if (rule.pattern && !(rule.pattern.test(value))) {
        inputValidationError[key] = rule.message
        return true
      }
    })
  });
  setErrors(inputValidationError);
  return inputValidationError
}

/* OTP Validator: */

const otpValidateConfig = {
  otp: [
    { required: true, message: "OTP fields are required" },
    { minLength: 6, message: "OTP must be 6 character long" }
  ]
}

export function otpValidator(data, setError) {
  const otpValidationError = {}
  Object.entries(data).forEach(([key, value]) => {
    otpValidateConfig[key].some((rule) => {
      if (rule.required && value.includes("")) {
        otpValidationError[key] = rule.message
        return true
      } else if (rule.minLength && value.length !== rule.minLength) {
        otpValidationError[key] = rule.message
        return true
      }
    })
  })
  setError(otpValidationError);
  return otpValidationError
}
