import axios from 'axios';

const PUBLIC_ENDPOINTS = ['/sessions', '/users'];

const isPublicEndpoint = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  return PUBLIC_ENDPOINTS.some((endpoint) => url === endpoint || url.endsWith(endpoint));
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3333',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('@GoBarber:token');
  const isPublicRequest = isPublicEndpoint(config.url);

  if (token && !isPublicRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url as string | undefined;
    const isPublicRequest = isPublicEndpoint(requestUrl);

    // Handle 401 - Unauthorized/Token expired
    if (error.response?.status === 401 && !isPublicRequest) {
      localStorage.removeItem('@GoBarber:token');
      localStorage.removeItem('@GoBarber:user');

      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
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
