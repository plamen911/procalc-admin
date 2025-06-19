import axios from 'axios';

const API_URL = 'https://127.0.0.1:8000/'; // Base API URL
//const API_URL = 'https://propcalc.zastrahovaite.com/'; // Base API URL

// Local storage key for JWT token
const TOKEN_KEY = 'admin_jwt_token';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure credentials are included in requests (cookies, etc.)
  withCredentials: true,
});

// Add a request interceptor to include JWT token in all requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.url);
    console.log('Request method:', config.method);
    console.log('Initial headers:', JSON.stringify(config.headers));

    // Check for CORS preflight request
    const isPreflight = config.method === 'options';
    console.log('Is CORS preflight request:', isPreflight);

    // Get token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Token exists:', !!token);

    if (token && !isPreflight) {
      // Check token format
      console.log('Token format before adding to header:', {
        length: token.length,
        prefix: token.substring(0, 10) + '...',
        containsBearer: token.includes('Bearer')
      });

      try {
        // Set Authorization header - use different methods to ensure it's set
        config.headers['Authorization'] = `Bearer ${token}`;

        // Also set it directly on the headers object
        if (config.headers.common) {
          config.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // Verify header was set correctly
        const authHeader = config.headers['Authorization'];
        console.log('Authorization header set:', authHeader ? authHeader.substring(0, 20) + '...' : 'undefined');
        console.log('Header starts with Bearer:', authHeader ? authHeader.startsWith('Bearer ') : false);

        // Log all headers after modification
        console.log('Final headers:', JSON.stringify(config.headers));
      } catch (e) {
        console.error('Error setting Authorization header:', e);
      }
    } else {
      if (isPreflight) {
        console.log('Skipping Authorization header for CORS preflight request');
      } else {
        console.warn('No JWT token found in localStorage');
        console.log('Checking if token exists in session storage:', !!sessionStorage.getItem(TOKEN_KEY));
      }
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export default api;
