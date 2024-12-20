import axios from 'axios';

// Create an Axios instance with common configurations
const api = axios.create({
  baseURL: 'http://localhost:3000', // Base URL for the backend API
  timeout: 5000, // Optional: Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json', // Default headers for requests
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Include authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response.data, // Simplify response to return only data
  (error) => {
    // Handle response errors
    if (error.response) {
      // Log the error for debugging
      console.error('API Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
