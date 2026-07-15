import supabase from '../lib/supabase';

export const patientService = {
  /**
   * Get patient by profile_id (member)
   */
  getPatientByProfileId: async (profileId) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('profile_id', profileId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching patient by profile ID:', error);
      return null;
    }
  },

  /**
   * Get patient by phone (guest lookup)
   */
  getPatientByPhone: async (phone) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching patient by phone:', error);
      return null;
    }
  },

  /**
   * Create patient (guest booking or member linking)
   */
  createPatient: async ({ profile_id, name, phone, email }) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert({
          profile_id: profile_id || null,
          name,
          phone,
          email: email || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  /**
   * Get all patients (Admin)
   */
  getAllPatients: async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  /**
   * Search patients by name (Admin)
   */
  searchPatients: async (query) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching patients:', error);
      return [];
    }
  },

  /**
   * Update patient
   */
  updatePatient: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  /**
   * Delete patient
   */
  deletePatient: async (id) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }
};

export default patientService;