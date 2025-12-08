// src/services/profile.service.js
import axios from 'axios';
import { authService } from './auth.service'; // Assuming path

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5172/api';

export const profileService = {

  // 1. Fetch full profile details (including phone, fetched from Postgres)
  fetchProfileDetails: async () => {
    const token = await authService.getToken();
    if (!token) throw new Error("Authentication token missing.");
    
    // This endpoint should return the user's detailed profile (first name, last name, phone, etc.)
    const response = await axios.get(`${API_URL}/profile/details`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // 2. Update profile details
  updateProfileDetails: async (data) => {
    const token = await authService.getToken();
    if (!token) throw new Error("Authentication token missing.");
    
    const response = await axios.put(`${API_URL}/profile/details`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // 3. Fetch all saved addresses for the current user
  fetchAddresses: async () => {
    const token = await authService.getToken();
    if (!token) throw new Error("Authentication token missing.");

    const response = await axios.get(`${API_URL}/profile/addresses`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // This should return an array of address objects
    return response.data;
  },

  // 4. Save a new address or update an existing one
  saveAddress: async (addressData) => {
    const token = await authService.getToken();
    if (!token) throw new Error("Authentication token missing.");

    // The backend uses the token to identify the user
    const response = await axios.post(`${API_URL}/profile/addresses`, addressData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // 5. Update an existing address
  updateAddress: async (addressId, addressData) => {
    const token = await authService.getToken();
    if (!token) throw new Error("Authentication token missing.");
    
    const response = await axios.put(`${API_URL}/profile/addresses/${addressId}`, addressData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // 6. Delete an address
  deleteAddress: async (addressId) => {
    const token = await authService.getToken();
    if (!token) throw new Error("Authentication token missing.");
    
    await axios.delete(`${API_URL}/profile/addresses/${addressId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // Returns status 204 (No Content) on success
  }


};