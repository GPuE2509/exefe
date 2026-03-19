import apiClient from './api';
import API_CONFIG from '../configs/api';

// Auth Service
export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);

      if (response.success && response.data.token) {
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('email', response.data.user.email);

        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        message: response.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Server connection error'
      };
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }

      return {
        success: false,
        message: response.message || 'Registration failed'
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Server connection error'
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Check if user is admin
  isAdmin: () => {
    try {
      const user = authService.getCurrentUser();
      return user && user.roles && user.roles.includes('ROLE_ADMIN');
    } catch (error) {
      return false;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching profile'
      };
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(API_CONFIG.ENDPOINTS.AUTH.PROFILE, profileData);
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating profile'
      };
    }
  }
};
