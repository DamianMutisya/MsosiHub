import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Configure retry logic
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Time interval between retries (1s, 2s, 3s)
  },
  retryCondition: (error: AxiosError): boolean => {
    return !!(
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === 'ECONNABORTED' ||
      (error.response && error.response.status >= 500)
    );
  },
  shouldResetTimeout: true,
});

// Add request interceptor to handle URL encoding
api.interceptors.request.use((config) => {
  if (config.url) {
    // Encode URL parameters properly
    config.url = encodeURI(config.url);
  }
  return config;
});

// Add request interceptor for better error handling
api.interceptors.request.use(
  config => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 404) {
      console.log('Resource not found, returning empty array');
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(error);
  }
);

export default api;
