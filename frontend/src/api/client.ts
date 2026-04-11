import axios from 'axios';
import { CONFIG } from '../constants/config';

export const api = axios.create({
    baseURL: `${CONFIG.BASE_URL}/api`,
    timeout: 10000,
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