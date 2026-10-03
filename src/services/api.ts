import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Update port if your Spring Boot uses a different port

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically add JWT token to requests if stored
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

