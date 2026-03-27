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