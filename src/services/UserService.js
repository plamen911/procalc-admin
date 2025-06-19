import api from './api';

/**
 * Service for managing users
 */
const UserService = {
  /**
   * Get all users
   * @returns {Promise} - Promise with users data
   */
  getAll: async () => {
    try {
      const response = await api.get('/api/v1/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
};

export default UserService;