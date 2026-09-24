
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const HomePageComponent = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("${process.env.NEXT_PUBLIC_API_URL}/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-gray-100 ">
   <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
     <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-28">
       <h2 className="text-center mb-10 text-4xl text-extrabold italic">Create Perfect Gifts</h2>
       <div className=" mt-6 space-y-12 lg:grid lg:grid-cols-4 lg:space-y-0 lg:gap-x-6">
         {categories.map((items) => (
              
              <div key={items.name} className=" bg-card rounded-lg cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group group relative">
                <img
                  alt={items.imageAlt}
                  src={items.imageSrc}
                  className="w-full rounded-t-lg bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-2/1 lg:aspect-square"
                />
                <h3 className="m-5 text-xl font-semibold text-gray-900">
                  <Link href={items.href}>
                    <span className="absolute inset-0" />
                    {items.name}
                  </Link>

                </h3>
                <p className=" m-5 text-sm text-gray-500 ">{items.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default HomePageComponent;


// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";
// import { useAuth } from "@/contexts/AuthContext"; // 👈 Add this

// const HomePageComponent = () => {
//   const [categories, setCategories] = useState([]);
//   const { user, logout } = useAuth(); // 👈 Get user from context

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await axios.get("http://localhost:4000/api/categories");
//         setCategories(res.data);
//       } catch (err) {
//         console.error("Error fetching categories", err);
//       }
//     }
//     load();
//   }, []);

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* 👈 USER SECTION - Top Bar */}
//       {user && (
//         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
//                   <span className="text-2xl font-bold text-white">
//                     {user.email?.[0]?.toUpperCase()}
//                   </span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg">Welcome back!</h3>
//                   <p className="text-indigo-100 text-sm">{user.email}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={logout}
//                 className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all flex items-center space-x-2"
//               >
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-28">
          
//           {/* 👈 NON-LOGGED IN - Auth CTA */}
//           {!user && (
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-bold text-gray-900 mb-4">
//                 Create Perfect Gifts
//               </h2>
//               <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//                 Sign in to save your favorites, track orders, and get personalized recommendations
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg">
//                   Sign In
//                 </button>
//                 <button className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all">
//                   Create Account
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* 👈 LOGGED IN - Personalized Header */}
//           {user && (
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-bold text-gray-900 mb-4 italic">
//                 Your Gift Collection
//               </h2>
//               <p className="text-xl text-gray-600 mb-8">
//                 Personalized recommendations for {user.email.split('@')[0]}
//               </p>
//             </div>
//           )}

//           {/* Categories Grid */}
//           <div className="mt-6 space-y-12 lg:grid lg:grid-cols-4 lg:space-y-0 lg:gap-x-6">
//             {categories.map((items) => (
//               <div key={items.name} className="bg-white rounded-2xl cursor-pointer hover:shadow-2xl transition-all overflow-hidden group relative border">
//                 <img
//                   alt={items.imageAlt}
//                   src={items.imageSrc}
//                   className="w-full rounded-t-2xl bg-white object-cover group-hover:opacity-90 max-sm:h-80 sm:aspect-2/1 lg:aspect-square h-64"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
//                     <Link href={items.href}>
//                       <span className="absolute inset-0" />
//                       {items.name}
//                     </Link>
//                   </h3>
//                   <p className="text-gray-600 leading-relaxed">{items.description}</p>
                  
//                   {/* 👈 USER-SPECIFIC ACTIONS */}
//                   {user && (
//                     <div className="mt-4 pt-4 border-t border-gray-100 flex items-center space-x-3">
//                       <button className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
//                         Add to Favorites
//                       </button>
//                       <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 4.5M4.4 5h15.2M7 13h10m-10 0h4" />
//                         </svg>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePageComponent;
