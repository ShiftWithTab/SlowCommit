import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

api.interceptors.response.use(
    response => response,
    error => {
      console.log('🔥 axios error:', error.message);
      console.log('🔥 axios status:', error.response?.status);
      console.log('🔥 axios data:', error.response?.data);
      return Promise.reject(error);
    }
);