import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // Reduce timeout to 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Configure retry logic with more specific conditions
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Time interval between retries (1s, 2s, 3s)
  },
  retryCondition: (error: AxiosError): boolean => {
    // Retry on timeout errors, network errors, and 5xx errors
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === 'ECONNABORTED' ||
      (error.response?.status !== undefined && error.response?.status >= 500) ||
      false
    );
  },
  // Add timeout between retries
  shouldResetTimeout: true,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Log the error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });

    // Customize error message based on the error type
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    } else if (error.response.status === 404) {
      error.message = 'Resource not found.';
    } else if (error.response.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }

    return Promise.reject(error);
  }
);

export default api;
