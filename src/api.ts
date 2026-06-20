import axios from 'axios';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const baseURL = isLocal ? '/api' : 'https://msdairy-backend.onrender.com/api';
const api = axios.create({ baseURL });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ms_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ms_token');
      localStorage.removeItem('ms_user');
    }
    return Promise.reject(err);
  }
);

export default api;

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (name: string, email: string, phone: string, password: string) => api.post('/auth/register', { name, email, phone, password }),
  me: () => api.get('/auth/me'),
};

export const productsApi = {
  list: (params?: Record<string, string>) => api.get('/products', { params }),
  get: (id: string) => api.get(`/products/${id}`),
  create: (data: unknown) => api.post('/products', data),
  update: (id: string, data: unknown) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const ordersApi = {
  list: () => api.get('/orders'),
  get: (id: string) => api.get(`/orders/${id}`),
  create: (data: unknown) => api.post('/orders', data),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
};

export const petsApi = {
  list: (params?: Record<string, string>) => api.get('/pets', { params }),
  get: (id: string) => api.get(`/pets/${id}`),
};

export const groomingApi = {
  services: () => api.get('/grooming/services'),
  bookings: () => api.get('/grooming/bookings'),
  book: (data: unknown) => api.post('/grooming/bookings', data),
  updateStatus: (id: string, status: string) => api.patch(`/grooming/bookings/${id}/status`, { status }),
};

export const vetsApi = {
  list: () => api.get('/vets'),
  get: (id: string) => api.get(`/vets/${id}`),
  appointments: () => api.get('/vets/appointments/mine'),
  book: (data: unknown) => api.post('/vets/appointments', data),
  updateStatus: (id: string, status: string) => api.patch(`/vets/appointments/${id}/status`, { status }),
};

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  users: () => api.get('/admin/users'),
  orders: () => api.get('/admin/orders'),
  groomingBookings: () => api.get('/admin/grooming-bookings'),
  vetAppointments: () => api.get('/admin/vet-appointments'),
};
