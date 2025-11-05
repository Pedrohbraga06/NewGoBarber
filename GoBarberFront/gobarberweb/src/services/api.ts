import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('@GoBarber:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Changed to capital A in Authorization
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
