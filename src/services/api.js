import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  uploadPhoto: (formData) => api.post('/auth/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Admin endpoints
export const adminAPI = {
  createCenter: (data) => api.post('/admin/learning-centers', data),
  getCenters: () => api.get('/admin/learning-centers')
};

// Manager endpoints
export const managerAPI = {
  createUser: (data) => api.post('/manager/users', data),
  getUsers: (role) => api.get(`/manager/users?role=${role}`),
  getStats: () => api.get('/manager/stats')
};

// Assistant endpoints
export const assistantAPI = {
  setAvailability: (data) => api.post('/assistant/availability', data),
  getAvailability: () => api.get('/assistant/availability'),
  getSessionsByTime: (date, time) => api.get(`/assistant/sessions/${date}/${time}`),
  markAttendance: (sessionId, data) => api.put(`/assistant/sessions/${sessionId}/attendance`, data),
  getSessions: (status) => api.get(`/assistant/sessions?status=${status}`)
};

// Student endpoints
export const studentAPI = {
  getAssistants: () => api.get('/student/assistants'),
  bookSession: (data) => api.post('/student/sessions', data),
  getSessions: (status) => api.get(`/student/sessions?status=${status}`),
  rateSession: (data) => api.post('/student/ratings', data)
};

export default api;