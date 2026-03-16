import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from './constants';

// Error types
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for JWT auth
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or sessionStorage
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 - Unauthorized (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });

        const { token } = response.data;

        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Normalize error response
    const statusCode = error.response?.status || 500;
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      'An unexpected error occurred';
    const details = (error.response?.data as any)?.details || {};

    return Promise.reject(new AppError(statusCode, message, details));
  }
);

export default api;

/**
 * Utility function to make API calls with error handling
 */
export async function makeRequest<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: any,
  config?: any
): Promise<T> {
  try {
    const response = await api[method]<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}
