import api from './api';

// Local storage keys - using admin-specific keys to separate from client tokens
const TOKEN_KEY = 'admin_jwt_token';
const USER_KEY = 'admin_user';

/**
 * Authentication service for JWT authentication in admin app
 */
const AuthService = {

  /**
   * Login as admin user and store JWT token
   * @param {string} username - Admin username
   * @param {string} password - Admin password
   * @returns {Promise} - Promise with user data
   */
  login: async (username, password) => {
    try {
      console.log('Login attempt for user:', username);
      const response = await api.post('/api/v1/admin/auth/login', {
        username,
        password
      });

      console.log('Login response received:', response.status);

      if (response.data.token) {
        console.log('Token received in login response');
        const token = response.data.token;

        // Log token format and structure (first 10 chars only for security)
        console.log('Token format check:', {
          length: token.length,
          prefix: token.substring(0, 10) + '...',
          containsBearer: token.includes('Bearer'),
          isString: typeof token === 'string'
        });

        // Store token and user data
        localStorage.setItem(TOKEN_KEY, token);
        console.log('Token stored in localStorage');

        // Extract user data from token or response
        const userData = response.data.user;
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        console.log('User data stored in localStorage');

        // Verify token was stored correctly
        const storedToken = localStorage.getItem(TOKEN_KEY);
        console.log('Token verification after login:', {
          exists: !!storedToken,
          matchesOriginal: storedToken === token,
          length: storedToken ? storedToken.length : 0
        });

        return userData;
      } else {
        console.warn('No token received in login response');
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout user and remove JWT token
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Get current user from local storage
   * @returns {Object|null} - User data or null if not logged in
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Get JWT token from local storage
   * @returns {string|null} - JWT token or null if not logged in
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Check if user is logged in
   * @returns {boolean} - True if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

// Note: Token interceptor moved to api.js to avoid circular dependency issues

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('API Response success:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('API Response error:', error.config?.url, error.message);

    // Make sure error.response exists before checking status
    if (!error.response) {
      console.error('No response object in error');
      return Promise.reject(error);
    }

    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);

    const originalRequest = error.config;
    console.log('Original request headers:', originalRequest.headers);

    // If the error is 401 (Unauthorized) and not already retrying
    if (error.response.status === 401 && !originalRequest._retry) {
      console.warn('401 Unauthorized error detected');
      originalRequest._retry = true;

      // Check if token exists in localStorage
      const token = localStorage.getItem(TOKEN_KEY);
      console.log('Token exists during 401 error:', !!token);

      // For admin app, we don't do automatic token refresh
      // Instead, we logout and redirect to login page
      console.log('Logging out user due to 401 error');
      AuthService.logout();

      // Add specific error information
      error.isAuthError = true;
      error.authErrorMessage = 'Your session has expired. Please login again.';
    }

    return Promise.reject(error);
  }
);

export default AuthService;
