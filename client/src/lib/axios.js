import axios from 'axios'

// instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/v1`
        : '/api/v1',
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

// interceptors - request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// interceptors - response 401 handler
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            originalRequest._retry ||
            originalRequest.url?.includes('/auth/refresh-token') ||
            !localStorage.getItem('refreshToken')
        ) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh-token`,
                    { token: refreshToken }
                );
                const { token } = response.data.data;
                localStorage.setItem('accessToken', token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
export default api;

