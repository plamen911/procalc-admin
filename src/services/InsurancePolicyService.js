import api from './api';

class InsurancePolicyService {
  /**
   * Get insurance policies with pagination, sorting, and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (ASC/DESC)
   * @param {string} params.search - Search term
   * @param {string} params.status - Status filter
   * @returns {Promise<Object>} Paginated policies data
   */
  async getPolicies(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);

      const response = await api.get(`api/v1/insurance-policies/admin/policies?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching insurance policies:', error);
      throw error;
    }
  }

  /**
   * Get insurance policy details by ID
   * @param {number} id - Policy ID
   * @returns {Promise<Object>} Policy details
   */
  async getPolicyById(id) {
    try {
      const response = await api.get(`api/v1/insurance-policies/admin/policies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching insurance policy ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get insurance policies statistics
   * @returns {Promise<Object>} Statistics data
   */
  async getStats() {
    try {
      const response = await api.get('api/v1/insurance-policies/admin/policies/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching insurance policies statistics:', error);
      throw error;
    }
  }

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0.00';
    return new Intl.NumberFormat('bg-BG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date string
   */
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get sort options for the policies list
   * @returns {Array} Sort options
   */
  getSortOptions() {
    return [
      { value: 'createdAt', label: 'Дата на създаване' },
      { value: 'code', label: 'Код на полицата' },
      { value: 'fullName', label: 'Име на застраховащия' },
      { value: 'total', label: 'Обща сума' },
      { value: 'settlement', label: 'Населено място' }
    ];
  }

  /**
   * Get items per page options
   * @returns {Array} Items per page options
   */
  getItemsPerPageOptions() {
    return [
      { value: 10, label: '10' },
      { value: 25, label: '25' },
      { value: 50, label: '50' },
      { value: 100, label: '100' }
    ];
  }
}

export default new InsurancePolicyService(); 