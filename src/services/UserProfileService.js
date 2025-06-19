import api from './api';

/**
 * Service for managing user profile
 */
const UserProfileService = {
  /**
   * Get current user profile
   * @returns {Promise} - Promise with user profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/api/v1/admin/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Promise with updated user profile data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/v1/admin/profile', profileData);
      
      // If the email was updated, update the stored user data
      if (profileData.email && response.data.user) {
        const userStr = localStorage.getItem('admin_user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            userData.email = response.data.user.email;
            userData.fullName = response.data.user.fullName;
            localStorage.setItem('admin_user', JSON.stringify(userData));
          } catch (e) {
            console.error('Error updating stored user data:', e);
          }
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

export default UserProfileService;