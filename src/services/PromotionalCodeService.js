import api from './api';

class PromotionalCodeService {
  /**
   * Get all promotional codes for a specific user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} List of promotional codes
   */
  async getByUserId(userId) {
    try {
      const response = await api.get(`api/v1/admin/promotional-codes/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching promotional codes for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get a promotional code by ID
   * @param {number} id - Promotional code ID
   * @returns {Promise<Object>} Promotional code data
   */
  async getById(id) {
    try {
      const response = await api.get(`api/v1/admin/promotional-codes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching promotional code ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new promotional code
   * @param {Object} codeData - Promotional code data
   * @returns {Promise<Object>} Created promotional code data
   */
  async create(codeData) {
    try {
      const response = await api.post('api/v1/admin/promotional-codes', codeData);
      return response.data;
    } catch (error) {
      console.error('Error creating promotional code:', error);
      throw error;
    }
  }

  /**
   * Update a promotional code
   * @param {number} id - Promotional code ID
   * @param {Object} codeData - Updated promotional code data
   * @returns {Promise<Object>} Updated promotional code data
   */
  async update(id, codeData) {
    try {
      const response = await api.put(`api/v1/admin/promotional-codes/${id}`, codeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating promotional code ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a promotional code
   * @param {number} id - Promotional code ID
   * @returns {Promise<Object>} Response message
   */
  async delete(id) {
    try {
      const response = await api.delete(`api/v1/admin/promotional-codes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting promotional code ${id}:`, error);
      throw error;
    }
  }
}

export default new PromotionalCodeService();