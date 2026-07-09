import supabase from '../lib/supabase';

export const customerService = {
  /**
   * Mengambil semua data customers/pasien (Admin)
   */
  getAllCustomers: async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  },

  /**
   * Mengambil customer berdasarkan ID
   */
  getCustomerById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching customer by ID:', error);
      return null;
    }
  },

  /**
   * Mengambil customer berdasarkan user_id (Member login)
   */
  getCustomerByUserId: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      
      // Return first result or null
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching customer by user ID:', error);
      return null;
    }
  },

  /**
   * Mencari customer berdasarkan email
   */
  getCustomerByEmail: async (email) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email.trim().toLowerCase());

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching customer by email:', error);
      return null;
    }
  },

  /**
   * Membuat data customer baru
   */
  createCustomer: async (data) => {
    try {
      const { data: result, error } = await supabase
        .from('customers')
        .insert({
          user_id: data.user_id || null,
          full_name: data.full_name,
          email: data.email ? data.email.trim().toLowerCase() : null,
          phone: data.phone || null,
          address: data.address || null,
          birth_date: data.birth_date || null,
          gender: data.gender || null,
          points: data.points || 0,
          tier: data.tier || 'regular',
          total_orders: data.total_orders || 0,
          total_spent: data.total_spent || 0,
          notes: data.notes || ''
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  /**
   * Update data customer
   */
  updateCustomer: async (id, data) => {
    try {
      const { data: result, error } = await supabase
        .from('customers')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  /**
   * Update poin customer
   */
  updatePoints: async (id, points) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ points })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating points:', error);
      throw error;
    }
  },

  /**
   * Menghapus customer
   */
  deleteCustomer: async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  /**
   * Mencari customer berdasarkan nama (partial match)
   */
  searchCustomers: async (query) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .ilike('full_name', `%${query}%`)
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  },

  /**
   * Mengambil customers berdasarkan tier
   */
  getCustomersByTier: async (tier) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('tier', tier)
        .order('points', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customers by tier:', error);
      return [];
    }
  }
};

export default customerService;