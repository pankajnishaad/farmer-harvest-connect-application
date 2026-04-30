import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fhc_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fhc_token');
      localStorage.removeItem('fhc_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// API helpers
export const farmerApi = {
  register:       (data) => api.post('/farmer/register', data),
  login:          (data) => api.post('/farmer/login', data),
  postHarvest:    (data) => api.post('/farmer/harvest', data),
  getOffers:      ()     => api.get('/farmer/offers'),
  respondOffer:   (id, status) => api.patch(`/farmer/offers/${id}`, { status }),
  postCrop:       (data) => api.post('/farmer/crops', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getCrops:       ()     => api.get('/farmer/crops'),
  getBuyerOffers: ()     => api.get('/farmer/buyer-offers'),
  getProfile:     ()     => api.get('/farmer/profile'),
  updateProfile:  (data) => api.put('/farmer/profile', data),
};

export const providerApi = {
  register:      (data) => api.post('/provider/register', data),
  login:         (data) => api.post('/provider/login', data),
  postService:   (data) => api.post('/provider/services', data),
  getServices:   ()     => api.get('/provider/services'),
  deleteService: (id)   => api.delete(`/provider/services/${id}`),
  getRequests:   ()     => api.get('/provider/requests'),
  submitBid:     (data) => api.post('/provider/bids', data),
  getBookings:   ()     => api.get('/provider/bookings'),
  getProfile:    ()     => api.get('/provider/profile'),
};

export const buyerApi = {
  register:     (data)  => api.post('/buyer/register', data),
  login:        (data)  => api.post('/buyer/login', data),
  getCrops:     (params)=> api.get('/buyer/crops', { params }),
  makeOffer:    (data)  => api.post('/buyer/offers', data),
  getOrders:    ()      => api.get('/buyer/orders'),
  uploadReceipt:(id, data) => api.post(`/buyer/orders/${id}/receipt`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getProfile:   ()      => api.get('/buyer/profile'),
};

export const adminApi = {
  login:         (data) => api.post('/admin/login', data),
  getStats:      ()     => api.get('/admin/stats'),
  getUsers:      ()     => api.get('/admin/users'),
  blockUser:     (id)   => api.patch(`/admin/users/${id}/block`),
  getTransactions:()    => api.get('/admin/transactions'),
  getDisputes:   ()     => api.get('/admin/disputes'),
  getListings:   ()     => api.get('/admin/listings'),
  removeListings:(id)   => api.delete(`/admin/listings/${id}`),
};
