import api from './api';

class UserManagementService {
  /**
   * Get all users (excluding those with ROLE_ANONYMOUS)
   * @returns {Promise<Array>} List of users
   */
  async getAll() {
    try {
      const response = await api.get('api/v1/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User data
   */
  async getById(id) {
    try {
      const response = await api.get(`api/v1/admin/user-management/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user data
   */
  async create(userData) {
    try {
      const response = await api.post('api/v1/admin/user-management', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update a user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async update(id, userData) {
    try {
      const response = await api.put(`api/v1/admin/user-management/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param {number} id - User ID
   * @returns {Promise<Object>} Response message
   */
  async delete(id) {
    try {
      const response = await api.delete(`api/v1/admin/user-management/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get available roles for assignment
   * @returns {Array} List of available roles
   */
  getAvailableRoles() {
    return [
      { value: 'ROLE_ADMIN', label: 'Administrator' },
      { value: 'ROLE_OFFICE', label: 'Office' },
      { value: 'ROLE_AGENT', label: 'Agent' }
    ];
  }
}

export default new UserManagementService();