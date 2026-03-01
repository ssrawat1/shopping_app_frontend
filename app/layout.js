import Header from "@/components/Header";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { CartContextProvider } from "@/context/CartContext";
import { ProductContextProvider } from "@/context/ProductContext";
import "./globals.css";

export const metadata = {
  title: {
    template: "%s | Shopping App",
    default: "Shopping App"
  },
  description: "You Love Shopping | Shopping Loves You",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        <ThemeContextProvider>
          <ProductContextProvider>
            <CartContextProvider>
              <Header />     
                {children}
             </CartContextProvider>
          </ProductContextProvider>
        </ThemeContextProvider>
      </body>
    </html>

  );
}
