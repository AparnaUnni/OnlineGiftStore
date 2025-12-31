// src/app/layout.jsx
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CustomLayout from "@/components/CustomLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
