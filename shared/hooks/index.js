// Shared API hooks for mobile and web applications

import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, AUTH_CONSTANTS } from '../constants';

// Base API client
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      timeout: this.timeout,
      headers: {
        ...API_CONFIG.HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  getToken() {
    try {
      return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  handleError(error) {
    if (error.name === 'AbortError') {
      return new Error('Request timeout');
    }
    if (error.message.includes('401')) {
      this.clearAuth();
      return new Error('Unauthorized - please log in again');
    }
    return error;
  }

  clearAuth() {
    try {
      localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONSTANTS.USER_KEY);
    } catch {}
  }

  // HTTP methods
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();

// Generic hook for API calls
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (customOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.request(endpoint, {
        ...options,
        ...customOptions,
      });
      setData(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  return { data, loading, error, execute };
};

// Authentication hooks
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, token);
      localStorage.setItem(AUTH_CONSTANTS.USER_KEY, JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONSTANTS.USER_KEY);
    setUser(null);
  };

  const getCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
      if (!token) return null;

      const response = await apiClient.get('/api/auth/me');
      setUser(response.data);
      return response.data;
    } catch (err) {
      logout();
      return null;
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
  };
};

// Bookings hooks
export const useBookings = () => {
  const { data, loading, error, execute } = useApi('/api/bookings');

  const getBookings = useCallback((params = {}) => {
    return execute({ method: 'GET', params });
  }, [execute]);

  const createBooking = useCallback(async (bookingData) => {
    return apiClient.post('/api/bookings', bookingData);
  }, []);

  const updateBooking = useCallback(async (id, updateData) => {
    return apiClient.put(`/api/bookings/${id}`, updateData);
  }, []);

  const cancelBooking = useCallback(async (id, reason) => {
    return apiClient.patch(`/api/bookings/${id}/cancel`, { reason });
  }, []);

  const getAvailableSlots = useCallback(async (serviceId, staffId, date) => {
    return apiClient.get('/api/bookings/available-slots', {
      serviceId,
      staffId,
      date,
    });
  }, []);

  return {
    bookings: data,
    loading,
    error,
    getBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    getAvailableSlots,
  };
};

// Services hooks
export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getServices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/api/services', params);
      setServices(response.data.services || []);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getServiceById = useCallback(async (id) => {
    return apiClient.get(`/api/services/${id}`);
  }, []);

  const createService = useCallback(async (serviceData) => {
    return apiClient.post('/api/services', serviceData);
  }, []);

  const updateService = useCallback(async (id, updateData) => {
    return apiClient.put(`/api/services/${id}`, updateData);
  }, []);

  const deleteService = useCallback(async (id) => {
    return apiClient.delete(`/api/services/${id}`);
  }, []);

  const searchServices = useCallback(async (query, filters = {}) => {
    return apiClient.get('/api/services/search', { q: query, ...filters });
  }, []);

  return {
    services,
    loading,
    error,
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    searchServices,
  };
};

// Staff hooks
export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStaff = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/api/staff', params);
      setStaff(response.data.staff || []);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStaffById = useCallback(async (id) => {
    return apiClient.get(`/api/staff/${id}`);
  }, []);

  const getStaffSchedule = useCallback(async (id, date) => {
    return apiClient.get(`/api/staff/${id}/schedule`, { date });
  }, []);

  const updateStaffSchedule = useCallback(async (id, scheduleData) => {
    return apiClient.put(`/api/staff/${id}/schedule`, scheduleData);
  }, []);

  return {
    staff,
    loading,
    error,
    getStaff,
    getStaffById,
    getStaffSchedule,
    updateStaffSchedule,
  };
};

// Analytics hooks
export const useAnalytics = () => {
  const getDashboardStats = useCallback(async (dateRange = {}) => {
    return apiClient.get('/api/analytics/dashboard', dateRange);
  }, []);

  const getBookingStats = useCallback(async (dateRange = {}) => {
    return apiClient.get('/api/analytics/bookings', dateRange);
  }, []);

  const getRevenueStats = useCallback(async (dateRange = {}) => {
    return apiClient.get('/api/analytics/revenue', dateRange);
  }, []);

  const getServiceStats = useCallback(async (dateRange = {}) => {
    return apiClient.get('/api/analytics/services', dateRange);
  }, []);

  const getStaffPerformance = useCallback(async (dateRange = {}) => {
    return apiClient.get('/api/analytics/staff-performance', dateRange);
  }, []);

  return {
    getDashboardStats,
    getBookingStats,
    getRevenueStats,
    getServiceStats,
    getStaffPerformance,
  };
};

// Generic CRUD hooks
export const useCrud = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(endpoint, params);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const getById = useCallback(async (id) => {
    return apiClient.get(`${endpoint}/${id}`);
  }, [endpoint]);

  const create = useCallback(async (itemData) => {
    const response = await apiClient.post(endpoint, itemData);
    setData(prev => [...prev, response.data]);
    return response.data;
  }, [endpoint]);

  const update = useCallback(async (id, updateData) => {
    const response = await apiClient.put(`${endpoint}/${id}`, updateData);
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...response.data } : item
    ));
    return response.data;
  }, [endpoint]);

  const remove = useCallback(async (id) => {
    await apiClient.delete(`${endpoint}/${id}`);
    setData(prev => prev.filter(item => item.id !== id));
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
  };
};

// File upload hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file, folder = 'uploads') => {
    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const token = localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
  };
};

export default {
  useApi,
  useAuth,
  useBookings,
  useServices,
  useStaff,
  useAnalytics,
  useCrud,
  useFileUpload,
};