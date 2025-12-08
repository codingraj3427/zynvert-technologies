// src/services/admin.service.js
import axios from "axios";
import { authService } from "./auth.service"; // adjust path/name if different

// Prefer from config, else fallback
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5172/api";

const getAuthHeaders = async () => {
  const token = await authService.getToken(); // make sure this exists
  return { Authorization: `Bearer ${token}` };
};

export const adminService = {
  // ===== Analytics =====
  async getOverview(params = {}) {
    const headers = await getAuthHeaders();
    const res = await axios.get(`${API_BASE_URL}/admin/analytics/overview`, {
      headers,
      params,
    });
    return res.data;
  },

  async getRevenueByDay(params = {}) {
    const headers = await getAuthHeaders();
    const res = await axios.get(
      `${API_BASE_URL}/admin/analytics/revenue-by-day`,
      { headers, params }
    );
    return res.data;
  },

  async getTopProducts(params = {}) {
    const headers = await getAuthHeaders();
    const res = await axios.get(
      `${API_BASE_URL}/admin/analytics/top-products`,
      { headers, params }
    );
    return res.data;
  },

  async getTopCustomers(params = {}) {
    const headers = await getAuthHeaders();
    const res = await axios.get(
      `${API_BASE_URL}/admin/analytics/top-customers`,
      { headers, params }
    );
    return res.data;
  },

  // ===== Products =====
  async getProducts() {
    const headers = await getAuthHeaders();
    const res = await axios.get(`${API_BASE_URL}/admin/products`, { headers });
    return res.data;
  },

  async getProduct(id) {
    const headers = await getAuthHeaders();
    const res = await axios.get(`${API_BASE_URL}/admin/products/${id}`, {
      headers,
    });
    return res.data;
  },

  async createProduct(payload) {
    const headers = await getAuthHeaders();
    const res = await axios.post(`${API_BASE_URL}/admin/products`, payload, {
      headers,
    });
    return res.data;
  },

  async updateProduct(id, payload) {
    const headers = await getAuthHeaders();
    const res = await axios.put(
      `${API_BASE_URL}/admin/products/${id}`,
      payload,
      { headers }
    );
    return res.data;
  },

  async deleteProduct(id) {
    const headers = await getAuthHeaders();
    const res = await axios.delete(`${API_BASE_URL}/admin/products/${id}`, {
      headers,
    });
    return res.data;
  },

  // ===== Orders =====
  async getOrders() {
    const headers = await getAuthHeaders();
    const res = await axios.get(`${API_BASE_URL}/admin/orders`, { headers });
    return res.data;
  },

  async updateOrderStatus(id, status) {
    const headers = await getAuthHeaders();
    const res = await axios.put(
      `${API_BASE_URL}/admin/orders/${id}/status`,
      { status },
      { headers }
    );
    return res.data;
  },

  // ===== Customers =====
  async getCustomers() {
    const headers = await getAuthHeaders();
    const res = await axios.get(`${API_BASE_URL}/admin/customers`, {
      headers,
    });
    return res.data;
  },
};
