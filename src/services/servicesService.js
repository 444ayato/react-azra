import api from './api';

/**
 * Memformat angka ke format Rupiah
 * Contoh: 350000 -> "Rp 350.000"
 */
export const formatRupiah = (amount) => {
  return 'Rp ' + Number(amount).toLocaleString('id-ID');
};

/**
 * Memformat durasi dari menit ke string deskriptif
 * Contoh: 60 -> "60 Menit", 90 -> "1 Jam 30 Menit"
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '-';
  const jam = Math.floor(minutes / 60);
  const menit = minutes % 60;
  if (jam === 0) return `${menit} Menit`;
  if (menit === 0) return `${jam} Jam`;
  return `${jam} Jam ${menit} Menit`;
};

export const servicesService = {
  /**
   * Mengambil semua layanan yang aktif
   */
  getAllServices: async () => {
    // Catatan: Jika nama tabel di Supabase menggunakan S besar, ganti '/services' menjadi '/Services'
    const response = await api.get('/services?is_active=eq.true&order=category.asc');
    return response.data;
  },

  /**
   * Mengambil layanan berdasarkan ID
   */
  getServiceById: async (id) => {
    const response = await api.get(`/services?id=eq.${id}`);
    return response.data[0] || null;
  },

  /**
   * Mengambil layanan berdasarkan kategori
   */
  getServicesByCategory: async (category) => {
    const response = await api.get(
      `/services?category=eq.${encodeURIComponent(category)}&is_active=eq.true&order=name.asc`
    );
    return response.data;
  },

  /**
   * Membuat layanan baru (Admin)
   */
  createService: async (data) => {
    const response = await api.post('/services', {
      name: data.name,
      description: data.description || null,
      price: data.price,
      duration_minutes: data.duration_minutes || null,
      category: data.category || null,
      is_active: data.is_active !== undefined ? data.is_active : true
    });
    return response.data;
  },

  /**
   * Update layanan (Admin)
   */
  updateService: async (id, data) => {
    const response = await api.patch(`/services?id=eq.${id}`, data);
    return response.data;
  },

  /**
   * Soft delete — nonaktifkan layanan (Admin)
   */
  deactivateService: async (id) => {
    const response = await api.patch(`/services?id=eq.${id}`, { is_active: false });
    return response.data;
  },

  /**
   * Hard delete layanan (Admin)
   */
  deleteService: async (id) => {
    const response = await api.delete(`/services?id=eq.${id}`);
    return response.data;
  }
};