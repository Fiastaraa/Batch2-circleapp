import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7001/api',
});

// Interceptor untuk menambahkan token Authorization ke request secara otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
