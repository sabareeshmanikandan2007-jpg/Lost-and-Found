import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
export const BACKEND_URL = API_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true, // Used for http/cookies if needed
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Auth Endpoints ──────────────────────────────────────── */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/* ── Post Endpoints ──────────────────────────────────────── */
export const getPosts = async (params = {}) => {
  try {
    const response = await api.get('/posts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const getPost = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export const createPost = async (formData) => {
  try {
    const response = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Upload failed' };
  }
};

export const updatePost = async (id, formData) => {
  try {
    const response = await api.put(`/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Update failed' };
  }
};

export const resolvePost = async (id) => {
  try {
    const response = await api.patch(`/posts/${id}/resolve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resolve item' };
  }
};

export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete item' };
  }
};

export const getStats = async () => {
  try {
    const response = await api.get('/posts/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch stats' };
  }
};

export default api;
