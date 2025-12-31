"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";


const GiftsPage = ({ title, items }) => {
 const { addToCart } = useCart();

//   const [cart, setCart] = useState([]);

//   const handleAddToCart = (item) => {
//   setCart((prev) => {
//     const updated = [...prev, item];
//     console.log("cart now:", updated);   // see all selected items
//     return updated;
//   });
// };


  return (
  <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-center mb-10 text-3xl text-bold">{title}</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {Array.isArray(items) && 
  items.map((item) => (
    <div key={item._id || item.id} className="group">
      <img
        alt={item.imageAlt}
        src={item.imageSrc}
        className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
      />
      <h3 className="mt-4 text-m text-gray-700">{item.name}</h3>
      <p className="mt-1 text-m font-medium text-gray-900">AED {item.price}</p>
      <button
        type="button"
        onClick={() => addToCart(item)}
        className="mt-5 bg-gray-200 w-full rounded-lg py-2 text-center text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-400"
      >
        Add to Cart
      </button>
    </div>
  ))}
</div>

        
      </div>
    </div>
);
}
export default GiftsPage;
