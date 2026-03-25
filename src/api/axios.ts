import axios from 'axios';

// Create a configured instance of Axios
const api = axios.create({
    baseURL: 'https://localhost:<YOUR_DOTNET_PORT>', // TODO: Update this port!
    headers: {
        'Content-Type': 'application/json',
    },
});

// ----------------------------------------------------------------
// REQUEST INTERCEPTOR (The "Attach ID Card" step)
// ----------------------------------------------------------------
api.interceptors.request.use(
    (config) => {
        // 1. Get the token from localStorage
        const token = localStorage.getItem('token');

        // 2. If we have a token, attach it to the Authorization header
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ----------------------------------------------------------------
// RESPONSE INTERCEPTOR (The "Bouncer" step)
// ----------------------------------------------------------------
api.interceptors.response.use(
    (response) => {
        // Any status code that lies within the range of 2xx causes this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx causes this function to trigger
        if (error.response && error.response.status === 401) {
            // 401 Unauthorized means the token is missing, invalid, or expired.
            console.warn('Unauthorized! Clearing token and redirecting to login...');

            // Clear the bad token
            localStorage.removeItem('token');

            // Force reload to the login page (or use React Router navigation if preferred)
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;