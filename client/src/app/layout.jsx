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
  title: 'Memoria Crafts | Personalized & Memory Gifts in Dubai, UAE',
  description: 'Shop unique personalized gifts, custom memory crafts and thoughtful handmade gifts delivered across Dubai and UAE. Perfect for birthdays, anniversaries and special moments.',
  keywords: 'personalized gifts Dubai, custom memory gifts UAE, thoughtful gifts online UAE, handmade gifts Dubai',
  openGraph: {
    title: 'Memoria Crafts | Personalized Gifts Dubai',
    description: 'Unique personalized and memory gifts delivered across UAE.',
    url: 'https://www.memoriacrafts.com',
    siteName: 'Memoria Crafts',
    images: [
      {
        url: '/og-image.jpg', // 1200x630px image of your best product
        width: 1200,
        height: 630,
        alt: 'Memoria Crafts - Personalized Gifts Dubai',
      },
    ],
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memoria Crafts | Personalized Gifts Dubai',
    description: 'Unique personalized and memory gifts delivered across UAE.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.memoriacrafts.com',
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