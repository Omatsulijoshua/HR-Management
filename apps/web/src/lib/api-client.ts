import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const orgId = localStorage.getItem('organizationId');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (orgId) {
      config.headers['x-organization-id'] = orgId;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data || {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
    return Promise.reject(errorResponse);
  }
);
