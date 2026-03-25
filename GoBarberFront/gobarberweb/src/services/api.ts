import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3333',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('@GoBarber:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Unauthorized/Token expired
    if (error.response?.status === 401) {
      localStorage.removeItem('@GoBarber:token');
      localStorage.removeItem('@GoBarber:user');
      window.location.href = '/';
    }

    // Handle 500 - Server error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    // Handle 503 - Service unavailable
    if (error.response?.status === 503) {
      console.error('Service unavailable:', error.response.data);
    }

    // Handle network errors (no response)
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
