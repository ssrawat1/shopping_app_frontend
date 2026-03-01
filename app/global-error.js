'use client'
import { ThemeContextProvider } from "@/context/ThemeContext"
import { ProductContextProvider } from "@/context/ProductContext"
import { CartContextProvider } from "@/context/CartContext"
import ErrorContent from "@/components/Error"
import "./globals.css"
import Header from "@/components/Header"

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider>
          <ProductContextProvider>
            <CartContextProvider>
              <Header />
              <ErrorContent reset={reset} />
            </CartContextProvider>
          </ProductContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  )
}