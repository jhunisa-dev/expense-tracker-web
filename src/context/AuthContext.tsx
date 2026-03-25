//import React, { createContext, useState, useEffect, ReactNode } from 'react';
//import { authService, LoginRequest } from '../api/authService';

//interface AuthContextType {
//    user: string | null; // Storing the username returned from /api/Auth/me
//    isAuthenticated: boolean;
//    isLoading: boolean;
//    login: (data: LoginRequest) => Promise<void>;
//    logout: () => void;
//}

//export const AuthContext = createContext<AuthContextType | undefined>(undefined);

//export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//    const [user, setUser] = useState<string | null>(null);
//    const [isLoading, setIsLoading] = useState(true);

//    // Check if the user is already logged in when the app loads
//    useEffect(() => {
//        const checkAuth = async () => {
//            const token = localStorage.getItem('token');
//            if (token) {
//                try {
//                    const username = await authService.getMe();
//                    setUser(username);
//                } catch (error) {
//                    console.error("Token invalid or expired", error);
//                    localStorage.removeItem('token');
//                }
//            }
//            setIsLoading(false);
//        };

//        checkAuth();
//    }, []);

//    const login = async (data: LoginRequest) => {
//        const token = await authService.login(data);
//        localStorage.setItem('token', token); // Save the JWT

//        // Immediately fetch their profile data to update the UI
//        const username = await authService.getMe();
//        setUser(username);
//    };

//    const logout = () => {
//        localStorage.removeItem('token');
//        setUser(null);
//    };

//    return (
//        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
//            {children}
//        </AuthContext.Provider>
//    );
//};

import { createContext } from 'react';
import type { LoginRequest } from '../api/authService';

export interface AuthContextType {
    user: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);