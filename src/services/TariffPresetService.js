import api from './api';

const ENDPOINT = '/api/v1/insurance-policies/admin/tariff-presets';

const TariffPresetService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error fetching tariff presets:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data;
    } catch (error) {
      console.error('Error creating tariff preset:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating tariff preset ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting tariff preset ${id}:`, error);
      throw error;
    }
  }
};

export default TariffPresetService;
