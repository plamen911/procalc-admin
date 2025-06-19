import api from './api';
import axios from 'axios'; // Import axios directly for direct calls

const API_URL = 'https://127.0.0.1:8000'; // Match the URL in api.js
const ENDPOINT = '/api/v1/insurance-policies/admin/insurance-clauses';
const TOKEN_KEY = 'admin_jwt_token'; // Match the key in api.js

const InsuranceClauseService = {
  getAll: async () => {
    console.log('InsuranceClauseService.getAll: Starting request sequence');

    // Try with api instance first
    try {
      console.log('InsuranceClauseService.getAll: Using api instance');
      const response = await api.get(ENDPOINT);
      console.log('API instance successful');
      return response.data;
    } catch (error) {
      console.error('Error fetching insurance clauses with api instance:', error);

      // Try with direct axios next
      console.log('Attempting fallback with direct axios');
      try {
        const data = await InsuranceClauseService.getAllWithDirectAxios();
        console.log('Direct axios successful');
        return data;
      } catch (axiosError) {
        console.error('Error with direct axios fallback:', axiosError);

        // Finally try with fetch API
        console.log('Attempting final fallback with fetch API');
        try {
          const data = await InsuranceClauseService.getAllWithFetch();
          console.log('Fetch API successful');
          return data;
        } catch (fetchError) {
          console.error('All approaches failed. Final error:', fetchError);
          throw fetchError;
        }
      }
    }
  },

  // Fallback method using native fetch API
  getAllWithFetch: async () => {
    try {
      console.log('InsuranceClauseService.getAllWithFetch: Using fetch API');
      const token = localStorage.getItem(TOKEN_KEY);
      console.log('Fetch: Token exists:', !!token);

      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Fetch: Authorization header set');
      }

      const response = await fetch(`${API_URL}${ENDPOINT}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include' // Include cookies
      });

      console.log('Fetch response status:', response.status);

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetch successful, data received');
      return data;
    } catch (error) {
      console.error('Error fetching insurance clauses with fetch:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating insurance clause ${id}:`, error);
      throw error;
    }
  },

  updatePosition: async (id, newPosition) => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, { position: newPosition });
      return response.data;
    } catch (error) {
      console.error(`Error updating position for insurance clause ${id}:`, error);
      throw error;
    }
  },

  toggleActive: async (id, active) => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, { active });
      return response.data;
    } catch (error) {
      console.error(`Error toggling active status for insurance clause ${id}:`, error);
      throw error;
    }
  },

  // Direct axios call without using the api instance
  getAllWithDirectAxios: async () => {
    try {
      console.log('InsuranceClauseService.getAllWithDirectAxios: Using direct axios');
      const token = localStorage.getItem(TOKEN_KEY);
      console.log('Direct axios: Token exists:', !!token);

      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Direct axios: Authorization header set');
      }

      const response = await axios.get(`${API_URL}${ENDPOINT}`, {
        headers: headers,
        withCredentials: true // Include cookies
      });

      console.log('Direct axios response status:', response.status);
      console.log('Direct axios successful, data received');
      return response.data;
    } catch (error) {
      console.error('Error fetching insurance clauses with direct axios:', error);
      throw error;
    }
  }
};

export default InsuranceClauseService;
