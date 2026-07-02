import api from './api';

export const pointsService = {
  /**
   * Mengambil semua riwayat poin (Admin)
   */
  getAllPointsHistory: async () => {
    const response = await api.get('/points_history?order=created_at.desc');
    return response.data;
  },

  /**
   * Mengambil riwayat poin berdasarkan customer_id (Member)
   */
  getPointsByCustomerId: async (customerId) => {
    const response = await api.get(
      `/points_history?customer_id=eq.${customerId}&order=created_at.desc`
    );
    return response.data;
  },

  /**
   * Mengambil riwayat poin berdasarkan tipe (earned, redeemed, expired, bonus)
   */
  getPointsByType: async (type) => {
    const response = await api.get(
      `/points_history?type=eq.${type}&order=created_at.desc`
    );
    return response.data;
  },

  /**
   * Mengambil total poin yang pernah didapat customer
   */
  getTotalPointsEarned: async (customerId) => {
    const response = await api.get(
      `/points_history?customer_id=eq.${customerId}&type=eq.earned&select=points`
    );
    const total = response.data.reduce((sum, item) => sum + item.points, 0);
    return total;
  },

  /**
   * Membuat entri riwayat poin baru
   * @param {Object} data - { customer_id, order_id, points, type, description }
   */
  createPointsEntry: async (data) => {
    const response = await api.post('/points_history', {
      customer_id: data.customer_id,
      order_id: data.order_id || null,
      points: data.points,
      type: data.type || 'earned',
      description: data.description || ''
    });
    return response.data;
  },

  /**
   * Menghapus entri riwayat poin
   */
  deletePointsEntry: async (id) => {
    const response = await api.delete(`/points_history?id=eq.${id}`);
    return response.data;
  }
};
