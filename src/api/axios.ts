import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5134',  
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attaches JWT Bearer token to every outgoing request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auto-logout on 401 
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';  // Force redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;