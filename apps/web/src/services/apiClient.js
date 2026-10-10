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

// Orders API service using Axios
export const ordersApi = {
  async createOrder(orderPayload) {
    try {
      const response = await apiClient.post('/api/orders', orderPayload);
      return response.data;
    } catch (error) {
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

  async getOrders() {
    try {
      const response = await apiClient.get('/api/orders');
      return response.data;
    } catch (error) {
      console.warn('Backend API offline, retrieving orders from local storage');
      return JSON.parse(localStorage.getItem('vf_orders') || '[]');
    }
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
