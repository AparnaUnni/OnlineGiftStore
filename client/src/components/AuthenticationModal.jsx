// client/src/components/AuthenticationModal.jsx

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthenticationModal({ onClose }) {
    const [tab, setTab] = useState("signin");

    const handleSuccess = () => {
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Welcome to Memoria
                        </h2>
                        <p className="text-sm text-gray-500">
                            {tab === "signin" ? "Sign in to continue" : "Create your account"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 py-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setTab("signin")}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                                tab === "signin"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setTab("signup")}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                                tab === "signup"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 pb-6">
                    {tab === "signin" ? (
                        <SignInForm onSuccess={handleSuccess} />
                    ) : (
                        <SignUpForm onSuccess={handleSuccess} />
                    )}
                </div>
            </div>
        </div>
    );
}