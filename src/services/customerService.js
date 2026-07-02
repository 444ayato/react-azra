import api from './api';

export const customerService = {
  /**
   * Mengambil semua data customers/pasien (Admin)
   */
  getAllCustomers: async () => {
    const response = await api.get('/customers?order=id.asc');
    return response.data;
  },

  /**
   * Mengambil customer berdasarkan ID
   */
  getCustomerById: async (id) => {
    const response = await api.get(`/customers?id=eq.${id}`);
    return response.data[0] || null;
  },

  /**
   * Mengambil customer berdasarkan user_id (Member login)
   */
  getCustomerByUserId: async (userId) => {
    const response = await api.get(`/customers?user_id=eq.${userId}`);
    return response.data[0] || null;
  },

  /**
   * Mencari customer berdasarkan email
   */
  getCustomerByEmail: async (email) => {
    const response = await api.get(`/customers?email=eq.${email.trim().toLowerCase()}`);
    return response.data[0] || null;
  },

  /**
   * Membuat data customer baru
   * @param {Object} data - { full_name, email, phone, address, birth_date, gender, notes }
   */
  createCustomer: async (data) => {
    const response = await api.post('/customers', {
      user_id: data.user_id || null,
      full_name: data.full_name,
      email: data.email ? data.email.trim().toLowerCase() : null,
      phone: data.phone || null,
      address: data.address || null,
      birth_date: data.birth_date || null,
      gender: data.gender || null,
      points: 100, // Bonus poin pendaftaran pertama
      tier: 'regular',
      notes: data.notes || ''
    });
    return response.data;
  },

  /**
   * Update data customer
   */
  updateCustomer: async (id, data) => {
    const response = await api.patch(`/customers?id=eq.${id}`, data);
    return response.data;
  },

  /**
   * Update poin customer
   */
  updatePoints: async (id, points) => {
    const response = await api.patch(`/customers?id=eq.${id}`, { points });
    return response.data;
  },

  /**
   * Menghapus customer
   */
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers?id=eq.${id}`);
    return response.data;
  },

  /**
   * Mencari customer berdasarkan nama (partial match)
   */
  searchCustomers: async (query) => {
    const response = await api.get(`/customers?full_name=ilike.*${encodeURIComponent(query)}*&order=full_name.asc`);
    return response.data;
  },

  /**
   * Mengambil customers berdasarkan tier
   */
  getCustomersByTier: async (tier) => {
    const response = await api.get(`/customers?tier=eq.${tier}&order=points.desc`);
    return response.data;
  }
};
