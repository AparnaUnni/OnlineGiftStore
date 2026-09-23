// // src/components/SignInForm.jsx
// "use client";
// import { useState } from "react";

// export default function SignUpForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name,setName] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Sign in:", { email, password });
//     // API call here
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Your existing Tailwind form fields */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Full Name</label>
//         <input
//           type="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-black border border-black/10 focus:border-indigo-500"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-black border border-black/10 focus:border-indigo-500"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-black border border-black/10 focus:border-indigo-500"
//           required
//         />
//       </div>
//       <div>
//           <button
//             type="submit"
//             className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
//           >
//             Sign Up
//           </button>
//         </div>
      
//     </form>
//   );
// }



// client/src/components/SignUpForm.jsx

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpForm({ onSuccess }) {
    const { register } = useAuth();
    
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await register(fullName, email, password);
            
            // Success - call onSuccess callback
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err.message || "Registration failed");
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

            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="John Doe"
                    required
                    disabled={loading}
                />
            </div>

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
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="••••••••"
                    minLength={6}
                    required
                    disabled={loading}
                />
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? "Creating Account..." : "Create Account"}
            </button>
        </form>
    );
}