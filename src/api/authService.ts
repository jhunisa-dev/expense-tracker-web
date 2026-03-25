import api from './axios';

// 1. Define the Data Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// 2. Export the API calls
export const authService = {
  login: async (data: LoginRequest) => {
    // The backend returns a plain string (the JWT token)
    const response = await api.post<string>('/api/Auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post('/api/Auth/register', data);
    return response.data;
  },

  getMe: async () => {
    // Based on your backend, this returns the Username as a string
    const response = await api.get<string>('/api/Auth/me');
    return response.data;
  }
};