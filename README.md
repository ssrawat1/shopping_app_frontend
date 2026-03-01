# 🛒 Next.js Shopping App - Client Side

A modern, secure, and user-friendly shopping application built with **Next.js**.  
This project focuses on seamless user experience, session-based authentication, smart cart management, and performance optimization.

---

## 🚀 Features

### 🔐 Session-Based Authentication
- Secure session-based authentication system
- Guest users can browse and add items to cart
- On login, guest cart items are automatically merged with the user’s account cart
- On logout, cart items are preserved in guest session
- Smooth cart restoration on re-login

### 🛍 Smart Cart System
- Guest cart (session-based)
- Authenticated user cart (database-based)
- Automatic cart merging logic
- Add, remove, and update product quantities
- Persistent cart experience similar to major e-commerce platforms

### 📦 Product Management
- Product listing page
- Product detail page
- Cart page with full summary
- Clean and responsive UI

### 📑 Pagination
- Implemented pagination for product listing
- Improves performance
- Enhances user experience
- Reduces excessive scrolling

### 🎨 Theme Support
- Light/Dark mode support
- Improved accessibility and modern UI feel

---

## 🏗 Tech Stack

- **Frontend:** Next.js
- **Backend:** Node.js / Express.js
- **Database:** MongoDB
- **Authentication:** Session-based authentication
- **State Management:** Context API

---

## 🧠 Authentication & Cart Logic

### Guest Flow:
1. User visits website
2. Items added to guest session cart
3. Cart stored temporarily

### Login Flow:
1. User logs in
2. Guest cart items are merged into user's database cart
3. Duplicate products are handled properly (quantities updated)

### Logout Flow:
1. User logs out
2. Current cart items are stored in guest session
3. Cart restored on next login

This ensures a seamless shopping experience without losing user data.

---

## 📂 Project Structure

```
shop_client
├── apis
│ ├── axiosInstance.js  
│ ├── cartApi.js  
│ ├── otpApi.js  
│ └── productsApi.js  
│ └── userApi.js  
├── app
│ ├── (auth)
│ │ ├── login  
│ │ └── register  
│ ├── (cart-items)/cart
│ ├── (product-detail)/products/[id]  
│ ├── layout.js  
│ ├── page.js  
│ └── globals.css  
├── components
│ ├── Header.jsx  
│ ├── Pagination.jsx  
│ └── Error.jsx  
├── context
│ ├── CartContext.jsx  
│ ├── ProductContext.jsx  
│ └── ThemeContext.jsx  
├── modal
│ └── ProfileModal.jsx  
├── pages
│ ├── Product.jsx  
│ └── ProductDetails.jsx  
├── public
├── utils
│ └── filters/items.js  
└── .env  
```

---

## 🧠 **Authentication & Cart Logic**

### Guest Flow:
1. Guest user visits the website.
2. Items are added to the guest session cart.
3. Cart data is stored temporarily in the session.

### Login Flow:
1. User logs in.
2. Guest cart items are merged into the user's database cart.
3. Any duplicate products are handled by updating the quantities.

### Logout Flow:
1. User logs out.
2. The current cart data is stored in the guest session.
3. Cart data is restored on the next login.

This ensures that the shopping experience remains seamless, even if the user switches between guest and authenticated sessions.

---

### **Project Breakdown**

- **Controllers:** Manage application logic (e.g., auth, cart, products, and users).
- **Models:** Define the MongoDB schema for various resources like products, users, and carts.
- **Routes:** Define the API endpoints for each feature (auth, cart, products, etc.).
- **Middleware:** Handle various pre-route checks (e.g., ID validation).
- **Services:** Contains utility functions for tasks like sending OTPs.
- **Utils:** Common utilities for performance optimization (rate limiting and throttling).

The backend architecture ensures a modular, maintainable, and scalable solution for handling user data, product management, and cart functionality.