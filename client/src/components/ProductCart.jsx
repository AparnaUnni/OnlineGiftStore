// // src/components/ProductCart.jsx
// "use client";
// import { useCart } from "@/context/CartContext";

// const ProductCart = () => {
//   const { cart } = useCart();

//   return (
//     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//       <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <ul className="space-y-4">
//           {cart.map((item, index) => (
//             <li
//               key={index}
//               className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
//             >
//               <div>
//                 <p className="font-medium">{item.name}</p>
//                 {item.price && (
//                   <p className="text-sm text-gray-600">
//                     {item.price.toFixed(2)}
//                   </p>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ProductCart;







// components/CartDrawer.jsx
"use client";
import { X } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import { useState } from 'react';
import { Trash2 } from 'lucide-react';


export default function ProductCart({ open, setOpen }) {

  const [list, setList] = useState([]);

  const { cart, removeFromCart, updateQuantity} = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + (typeof item.price === "number" ? item.price * (item.quantity || 1) : 0),
    0
  );

  const deleteItem = (id) => {
    removeFromCart(id);
    };

  const [suggestion, setSuggestion] = useState("");
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(suggestion);
    setIsEditing(false);
  };


  return (
    <>
      <div className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      
      <aside
        className={`fixed top-0 right-0 h-full w-70 sm:w-100 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "translate-x-full"}`}
        >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Cart</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-4rem)]">

          <div className="mt-8">
            <div className="flow-root">
              {cart.length === 0 ? (
                <p className="text-sm text-gray-500">Your cart is empty.</p>
                  ) : (
                   <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {cart.map((product, idx) => (
                        <li key={idx} className="flex py-6">
                          <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                            {product.imageSrc && (
                              <img
                                alt={product.imageAlt || product.name}
                                src={product.imageSrc}
                                className="size-full object-cover"
                              />
                            )}
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{product.name}</h3>
                                {typeof product.price === "number" && (
                                  <p className="ml-4">
                                    ₹
                                    {(product.price * (product.quantity || 1)).toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                                            
                              <div className="flex items-center gap-2 text-gray-500">
                                <span>Qty:</span>
                                <input
                                  type="number"
                                  min={1}
                                  value={product.quantity || 1}
                                  onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                                  className="w-12 px-1 py-0.5 text-sm"
                                />
                              </div>

                                          

                              <div className="flex">
                                {/* hook up remove logic later */}
                                <button
                                  onClick={() => deleteItem(product.id)}
                                  type="button"
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  <Trash2 className='text-red-700 cursor-pointer w-5 h-5'/>
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                        ))}
                    </ul>
                      )}
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Order note / comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Add any message (e.g. Write 'Happy Birthday Sarah' on cake, Prefer pink ribbon)..."
            />
            
          </div>
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <button className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700">
                Checkout
              </button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{" "}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </p>
            </div>
          </div>
        </div>

                
      </aside>
    </>
  );
}
