import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Add retry logic
axiosRetry(api, { 
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 404;
  }
});

export default api;
