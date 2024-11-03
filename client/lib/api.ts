import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
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

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    // Return empty data instead of rejecting for 404s
    if (error.response?.status === 404) {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(error);
  }
);

export default api;
