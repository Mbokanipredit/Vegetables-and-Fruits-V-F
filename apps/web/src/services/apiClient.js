import axios from 'axios';
import { PRODUCTS_DATA } from '../data/productsData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Products API service using Axios with fallback
export const productsApi = {
  async getProducts(category, search) {
    try {
      const response = await apiClient.get('/api/products', {
        params: { category, search },
      });
      return response.data;
    } catch (error) {
      console.warn('Backend API unreachable, using client data cache fallback:', error.message);
      let filtered = [...PRODUCTS_DATA];
      if (category && category !== 'All Products') {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            (p.kinyarwanda && p.kinyarwanda.toLowerCase().includes(query))
        );
      }
      return filtered;
    }
  },
};

const authHeader = (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {});

// Extract a readable error message from an API error
export const apiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const msg = error?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  if (msg) return msg;
  if (!error?.response) return 'Cannot reach the server. Please check that the API is running.';
  return fallback;
};

// Auth API service
export const authApi = {
  async register(payload) {
    const { data } = await apiClient.post('/api/auth/register', payload);
    return data; // { token, user }
  },
  async login(email, password) {
    const { data } = await apiClient.post('/api/auth/login', { email, password });
    return data;
  },
  async adminLogin(email, password) {
    const { data } = await apiClient.post('/api/auth/admin/login', { email, password });
    return data;
  },
  async getCustomers(adminToken) {
    const { data } = await apiClient.get('/api/auth/customers', authHeader(adminToken));
    return data;
  },
};

// Orders API service using Axios
export const ordersApi = {
  async createOrder(orderPayload, token) {
    try {
      const response = await apiClient.post('/api/orders', orderPayload, authHeader(token));
      return response.data;
    } catch (error) {
      // Only fall back to local storage when the server is unreachable
      if (error.response) throw error;
      console.warn('Backend API offline, saving order locally:', error.message);
      // Fallback local order object generator
      const mockOrder = {
        id: `local-${Date.now()}`,
        orderNumber: `VF-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        ...orderPayload,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      
      // Save in localStorage for persistence
      const existing = JSON.parse(localStorage.getItem('vf_orders') || '[]');
      existing.unshift(mockOrder);
      localStorage.setItem('vf_orders', JSON.stringify(existing));

      return mockOrder;
    }
  },

  async getMyOrders(token) {
    const { data } = await apiClient.get('/api/orders/mine', authHeader(token));
    return data;
  },

  async getOrders(adminToken) {
    const response = await apiClient.get('/api/orders', authHeader(adminToken));
    return response.data;
  },

  async updateStatus(orderId, status, adminToken) {
    const { data } = await apiClient.patch(`/api/orders/${orderId}/status`, { status }, authHeader(adminToken));
    return data;
  },
};

// Contact API service using Axios
export const contactApi = {
  async sendMessage(contactPayload) {
    try {
      const response = await apiClient.post('/api/contact', contactPayload);
      return response.data;
    } catch (error) {
      console.warn('Backend API offline, saving contact message locally');
      const msg = { id: `msg-${Date.now()}`, ...contactPayload, createdAt: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem('vf_messages') || '[]');
      existing.unshift(msg);
      localStorage.setItem('vf_messages', JSON.stringify(existing));
      return msg;
    }
  },
};
