"use client";

import { ShoppingCart, User2} from 'lucide-react'
import Link from "next/link";
import React from 'react'
import { useState } from "react";
import ProductCart from './ProductCart';
import { useCart } from '@/context/CartContext';

const Header = () => {

  const [open, setOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity} = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  console.log("Item count",cartItemCount);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b bg-white justify-between">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

        <Link href="/HomePageComponent" className="flex items-center">
          <img src="/memoria-logo.png" alt="Logo" className="h-16 w-auto " />
        </Link>
        <h1 className='italic font-[Open_Sans] text-3xl'>Memoria Crafts</h1>

        {/* <Link href="/ProductCart" className="flex items-center gap-4">
          <ShoppingCart className="h-6 w-6" />
        </Link> */}
        <div className='flex gap-4'>
        <User2 />

        <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-4 cursor-pointer"
      >
        
        <ShoppingCart className="h-6 w-6" />
        {cartItemCount > 0 && (
                <span className=" absolute top-4 right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-sm">
                  {cartItemCount}
                </span>
              )}
      </button>
      <ProductCart open={open} setOpen={setOpen} />
      </div>

        </div>
      </div>
    </header>

    
  )
}

export default Header


