// client/src/contexts/AuthContext.jsx

'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user on mount
        try {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    // Register
    const register = async (fullName, email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);

        return data;
    };

    // Login
    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);

        return data;
    };

    // Update Profile
    const updateProfile = async (profileData) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/auth/update-profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Update failed');
        }

        // Update local storage and state
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);

        return data;
    };

    // Change Password
    const changePassword = async (currentPassword, newPassword) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Password change failed');
        }

        return data;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            register,
            login,
            logout,
            updateProfile,
            changePassword,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}