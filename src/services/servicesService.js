import supabase from '../lib/supabase';

/**
 * Memformat angka ke format Rupiah
 * Contoh: 350000 -> "Rp 350.000"
 */
export const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0';
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
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  /**
   * Mengambil layanan berdasarkan ID
   */
  getServiceById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching service by ID:', error);
      return null;
    }
  },

  /**
   * Mengambil layanan berdasarkan kategori
   */
  getServicesByCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching services by category:', error);
      return [];
    }
  },

  /**
   * Membuat layanan baru (Admin)
   */
  createService: async (data) => {
    try {
      const { data: result, error } = await supabase
        .from('services')
        .insert({
          name: data.name,
          description: data.description || null,
          price: data.price,
          duration_minutes: data.duration_minutes || null,
          category: data.category || null,
          is_active: data.is_active !== undefined ? data.is_active : true
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  /**
   * Update layanan (Admin)
   */
  updateService: async (id, data) => {
    try {
      const { data: result, error } = await supabase
        .from('services')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  /**
   * Soft delete — nonaktifkan layanan (Admin)
   */
  deactivateService: async (id) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deactivating service:', error);
      throw error;
    }
  },

  /**
   * Hard delete layanan (Admin)
   */
  deleteService: async (id) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
};

export default servicesService;