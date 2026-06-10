// config/axiosConfig.js
import axios from 'axios';
import { storage } from '../utils/storage';
import { API } from '../constants/apiEndpoints';
import { isSessionExpiredError } from '../utils/errorHandler';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API.BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isSessionExpiredError(error)) {
      // Clear local session
      storage.clearAll();
      // Optional: dispatch event to notify app (we'll handle in AuthContext later)
      // For now, just log and let the app redirect on next navigation
      console.warn('Session expired. Please log in again.');
      
      // You can dispatch a custom event for the app to listen
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;