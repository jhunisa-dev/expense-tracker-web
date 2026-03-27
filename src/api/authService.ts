import api from './axios';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface MeResponse {
    id: number;
    name: string;
}

export const authService = {
    login: async (data: LoginRequest) => {
        const response = await api.post<string>('/api/Auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest) => {
        const response = await api.post('/api/Auth/register', data);
        return response.data;
    },

    getMe: async (): Promise<MeResponse> => {
        const response = await api.get<MeResponse>('/api/Auth/me');
        return response.data;
    }
};