// "use client";

// import { ShoppingCart, User2} from 'lucide-react'
// import Link from "next/link";
// import React from 'react'
// import { useState } from "react";
// import ProductCart from './ProductCart';
// import { useCart } from '@/contexts/CartContext';
// import AuthenticationModal from './AuthenticationModal';

// const Header = () => {

//   const [open, setOpen] = useState(false);
//   const { cart, removeFromCart, updateQuantity} = useCart();
//   const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
//   console.log("Item count",cartItemCount);

//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 border-b bg-white justify-between">
//       <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">

//         <Link href="/HomePageComponent" className="flex items-center">
//           <img src="/memoria-logo.png" alt="Logo" className="h-16 w-auto " />
//         </Link>
//         <h1 className='italic font-[Open_Sans] text-3xl'>Memoria Crafts</h1>

//         {/* <Link href="/ProductCart" className="flex items-center gap-4">
//           <ShoppingCart className="h-6 w-6" />
//         </Link> */}
//         <div className='flex gap-4'>
//         <button
//             onClick={() => setIsAuthModalOpen(true)}
//             className="p-2 rounded-full hover:bg-gray-100"
//           >
//             <User2 className="h-6 w-6" />
//           </button>
      
      

//       {/* Auth Modal */}
//       {isAuthModalOpen && (
//         <AuthenticationModal onClose={() => setIsAuthModalOpen(false)} />
//       )}

//         <button
//         type="button"
//         onClick={() => setOpen(true)}
//         className="flex items-center gap-4 cursor-pointer"
//       >
        
//         <ShoppingCart className="h-6 w-6" />
//         {cartItemCount > 0 && (
//                 <span className=" absolute top-4 right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-sm">
//                   {cartItemCount}
//                 </span>
//               )}
//       </button>
//       <ProductCart open={open} setOpen={setOpen} />
//       </div>

//         </div>
//       </div>
//     </header>

    
//   )
// }

// export default Header


// client/src/components/Header.jsx

"use client";

import { ShoppingCart, User2, LogOut, ChevronDown } from 'lucide-react';
import Link from "next/link";
import React, { useState, useRef, useEffect } from 'react';
import ProductCart from './ProductCart';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthenticationModal from './AuthenticationModal';

const Header = () => {
    const [open, setOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const { cart } = useCart();
    const { user, logout, loading } = useAuth();
    
    const dropdownRef = useRef(null);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 border-b bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    
                    {/* Logo */}
                    <Link href="/HomePageComponent" className="flex items-center shrink-0">
                        <img src="/memoria-logo.png" alt="Logo" className="h-12 w-auto" />
                    </Link>
                    
                    {/* Title — hidden on small screens */}
                    <h1 className="hidden sm:block italic font-[Open_Sans] text-xl md:text-3xl truncate">
                        Memoria Crafts
                    </h1>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        
                        {/* User Section */}
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        ) : user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-white border border-gray-800 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-black font-semibold text-sm">
                                            {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                                        </span>
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                        {user.fullName?.split(' ')[0] || 'User'}
                                    </span>
                                    <ChevronDown 
                                        className={`h-4 w-4 text-gray-500 transition-transform shrink-0 ${
                                            isDropdownOpen ? 'rotate-180' : ''
                                        }`} 
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {user.fullName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <User2 className="h-4 w-4" />
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/orders"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                My Orders
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-100 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <User2 className="h-6 w-6 text-gray-600" />
                                <span className="hidden sm:block text-sm font-medium text-gray-700">
                                    Sign In
                                </span>
                            </button>
                        )}

                        {isAuthModalOpen && (
                            <AuthenticationModal onClose={() => setIsAuthModalOpen(false)} />
                        )}

                        {/* Cart Button */}
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ShoppingCart className="h-6 w-6 text-gray-600" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                        
                        <ProductCart open={open} setOpen={setOpen} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;