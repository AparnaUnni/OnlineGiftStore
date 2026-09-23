// 'use client';
// import { AuthProvider } from "@/contexts/AuthContext";
// import { CartProvider } from "@/contexts/CartContext";

// export function Providers({ children }) {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         {children}
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// client/src/app/providers.jsx

'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from "@/contexts/CartContext"

export function Providers({ children }) {
    return (
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
            
        </AuthProvider>
    );
}