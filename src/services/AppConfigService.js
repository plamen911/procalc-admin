import api from './api';
import axios from 'axios'; // Import axios directly for direct calls

const ENDPOINT = '/api/v1/app-configs/admin';
const API_URL = 'https://127.0.0.1:8000'; // Match the URL in api.js
const TOKEN_KEY = 'admin_jwt_token'; // Match the key in api.js
const CLAUSES_ENDPOINT = '/api/v1/insurance-policies/admin/insurance-clauses';

const AppConfigService = {
  getAll: async () => {
    try {
      const response = await api.get(ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error fetching app configs:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating app config ${id}:`, error);
      throw error;
    }
  },

  // Get all insurance clauses for dropdown options
  getInsuranceClauses: async () => {
    console.log('AppConfigService.getInsuranceClauses: Starting request sequence');

    // Try with api instance first
    try {
      console.log('AppConfigService.getInsuranceClauses: Using api instance');
      const response = await api.get(CLAUSES_ENDPOINT);
      console.log('API instance successful in AppConfigService');
      return response.data;
    } catch (error) {
      console.error('Error fetching insurance clauses with api instance in AppConfigService:', error);

      // Try with direct axios next
      console.log('Attempting fallback with direct axios in AppConfigService');
      try {
        const data = await AppConfigService.getInsuranceClausesWithDirectAxios();
        console.log('Direct axios successful in AppConfigService');
        return data;
      } catch (axiosError) {
        console.error('Error with direct axios fallback in AppConfigService:', axiosError);

        // Finally try with fetch API
        console.log('Attempting final fallback with fetch API in AppConfigService');
        try {
          const data = await AppConfigService.getInsuranceClausesWithFetch();
          console.log('Fetch API successful in AppConfigService');
          return data;
        } catch (fetchError) {
          console.error('All approaches failed in AppConfigService. Final error:', fetchError);
          throw fetchError;
        }
      }
    }
  },

  // Direct axios call without using the api instance
  getInsuranceClausesWithDirectAxios: async () => {
    try {
      console.log('AppConfigService.getInsuranceClausesWithDirectAxios: Using direct axios');
      const token = localStorage.getItem(TOKEN_KEY);
      console.log('Direct axios in AppConfigService: Token exists:', !!token);

      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Direct axios in AppConfigService: Authorization header set');
      }

      const response = await axios.get(`${API_URL}${CLAUSES_ENDPOINT}`, {
        headers: headers,
        withCredentials: true // Include cookies
      });

      console.log('Direct axios in AppConfigService response status:', response.status);
      console.log('Direct axios in AppConfigService successful, data received');
      return response.data;
    } catch (error) {
      console.error('Error fetching insurance clauses with direct axios in AppConfigService:', error);
      throw error;
    }
  },

  // Fallback method using native fetch API
  getInsuranceClausesWithFetch: async () => {
    try {
      console.log('AppConfigService.getInsuranceClausesWithFetch: Using fetch API');

      const token = localStorage.getItem(TOKEN_KEY);
      console.log('Fetch in AppConfigService: Token exists:', !!token);

      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Fetch in AppConfigService: Authorization header set');
      }

      const response = await fetch(`${API_URL}${CLAUSES_ENDPOINT}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include' // Include cookies
      });

      console.log('Fetch in AppConfigService response status:', response.status);

      if (!response.ok) {
        throw new Error(`Fetch error in AppConfigService: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetch in AppConfigService successful, data received');
      return data;
    } catch (error) {
      console.error('Error fetching insurance clauses with fetch in AppConfigService:', error);
      throw error;
    }
  }
};

export default AppConfigService;
