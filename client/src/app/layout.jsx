// // src/app/layout.jsx
// import "./globals.css";
// import { CartProvider } from "@/contexts/CartContext";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <CartProvider>
            
//             {children}
          
//         </CartProvider>
//       </body>
//     </html>
//   );
// }


// src/app/layout.jsx

import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

// app/layout.jsx
export const metadata = {
  title: 'Memoria Crafts | Personalized Gifts Dubai UAE',
  description: 'Shop unique personalized and memory gifts delivered across Dubai and UAE. Perfect for birthdays, anniversaries and special moments.',
  keywords: 'personalized gifts Dubai, custom memory gifts UAE, thoughtful gifts online UAE, handmade gifts Dubai, birthday gifts UAE, anniversary gifts Dubai',
  icons: {
    icon: '/memoria-logo.png',
    apple: '/memoria-logo.png',
  },
  alternates: {
    canonical: 'https://online-gift-store.vercel.app',
  },
  openGraph: {
    title: 'Memoria Crafts | Personalized Gifts Dubai',
    description: 'Unique personalized and memory gifts delivered across UAE.',
    url: 'https://online-gift-store.vercel.app',
    siteName: 'Memoria Crafts',
    locale: 'en_AE',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}