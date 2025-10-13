import axios from 'axios';

// Storage helpers
const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setTokens: ({ access, refresh }) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
};

// Ensure we always have an absolute backend URL; fall back to localhost:8000
const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const instance = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: false
});

// Attach access token
instance.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh on 401 once
let isRefreshing = false;
let queue = [];

function processQueue(error, token = null) {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  queue = [];
}

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;
    if (status === 401 && !original._retry) {
      original._retry = true;
      const refresh = tokenStorage.getRefresh();
      if (!refresh) {
        tokenStorage.clear();
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        })
          .then((newAccess) => {
            original.headers.Authorization = `Bearer ${newAccess}`;
            return instance(original);
          })
          .catch((err) => Promise.reject(err));
      }
      isRefreshing = true;
      try {
        const { data } = await axios.post(`${API_BASE}/api/auth/refresh/`, { refresh });
        const newAccess = data?.access;
        tokenStorage.setTokens({ access: newAccess });
        processQueue(null, newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return instance(original);
      } catch (err) {
        tokenStorage.clear();
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// API wrappers
export const api = {
  auth: {
    register: (payload) => instance.post('/auth/register/', payload).then((r) => r.data),
    login: (payload) => instance.post('/auth/login/', payload).then((r) => r.data),
    verify: () => instance.get('/auth/verify/').then((r) => r.data),
    refresh: (refresh) => axios.post(`${API_BASE}/api/auth/refresh/`, { refresh }).then((r) => r.data),
    logout: (refresh) => instance.post('/auth/logout/', { refresh }).then((r) => r.data)
  },
  notes: {
    list: (params) => instance.get('/notes/', { params }).then((r) => r.data),
    get: (id) => instance.get(`/notes/${id}/`).then((r) => r.data),
    create: (payload) => instance.post('/notes/', payload).then((r) => r.data),
    update: (id, payload) => instance.put(`/notes/${id}/`, payload).then((r) => r.data),
    remove: (id) => instance.delete(`/notes/${id}/`).then((r) => r.data)
  },
  tags: {
    list: (params) => instance.get('/tags/', { params }).then((r) => r.data),
    create: (payload) => instance.post('/tags/', payload).then((r) => r.data),
    update: (id, payload) => instance.put(`/tags/${id}/`, payload).then((r) => r.data),
    remove: (id) => instance.delete(`/tags/${id}/`).then((r) => r.data)
  }
};

export default instance;

