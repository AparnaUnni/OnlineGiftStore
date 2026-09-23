// "use client";
// import { useState } from "react";

// export default function SignInForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const res = await fetch("/api/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
      
//       if (res.ok) {
//         window.location.href = "/dashboard";  // Redirect
//       } else {
//         alert("Invalid credentials");
//       }
//     } catch (err) {
//       alert("Network error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="mt-2 block w-full rounded-md bg-white/5 px-2 py-2 text-black border border-black/10 focus:border-indigo-500"
//           required
//         />
//       </div>

//         <div>
//           <div className="flex items-center justify-between">
//             <label htmlFor="password" className="block text-sm/6 font-medium text-gray-700">
//               Password
//             </label>
//             <div className="text-sm">
//               <a href="#" className="font-semibold text-indigo-800 hover:text-indigo-300">
//                 Forgot password?
//               </a>
//             </div>
//           </div>
//           <div className="mt-2">
//             <input
//               id="password"
//               name="password"
//               type="password"
//               required
//               autoComplete="current-password"
//               className="mt-2 block w-full rounded-md bg-white/5 px-2 py-2 text-black border border-black/10 focus:border-indigo-500"
//             />
//           </div>
//         </div>

//         <div>
//           <button
//             type="submit"
//             className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500"
//           >
//             Sign In
//           </button>
//         </div>
      
      
//     </form>
//   );
// }


// components/SignInForm.jsx
// 'use client';
// import { useState } from 'react';

// export default function SignInForm({ onSuccess }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error);

//       // Save token to localStorage
//       localStorage.setItem('token', data.token);
      
//       // Call parent callback
//       onSuccess?.(data.user);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="your@email.com"
//           required
//           className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-indigo-400 focus:bg-white/20"
//           disabled={loading}
//         />
//       </div>
      
//       <div>
//         <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="••••••••"
//           required
//           className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-indigo-400 focus:bg-white/20"
//           disabled={loading}
//         />
//       </div>
      
//       {error && (
//         <p className="text-red-400 text-sm">{error}</p>
//       )}
      
//       <button 
//         type="submit" 
//         disabled={loading}
//         className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold text-white transition-all shadow-lg disabled:opacity-50"
//       >
//         {loading ? 'Signing In...' : 'Sign In'}
//       </button>
//     </form>
//   );
// }




// client/src/components/SignInForm.jsx

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";


import { Eye, EyeOff } from "lucide-react";

// Add this state


export default function SignInForm({ onSuccess }) {
    const { login } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            
            // Success - call onSuccess callback
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="john@example.com"
                    required
                    disabled={loading}
                />
            </div>

            {/* Password */}
            <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Password
    </label>
    <div className="relative">
        <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="••••••••"
            required
            disabled={loading}
        />
        <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
    </div>
</div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? "Signing In..." : "Sign In"}
            </button>
        </form>
    );
}