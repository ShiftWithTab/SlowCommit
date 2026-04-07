import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.219.105:8080/api',
  timeout: 5000
});
