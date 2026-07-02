import { supabase } from '../lib/supabase';

export const patientService = {
  /**
   * Get patient by profile_id (member)
   */
  getPatientByProfileId: async (profileId) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('profile_id', profileId)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  },

  /**
   * Get patient by phone (guest lookup)
   */
  getPatientByPhone: async (phone) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  },

  /**
   * Create patient (guest booking or member linking)
   */
  createPatient: async ({ profile_id, name, phone, email }) => {
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
  },

  /**
   * Get all patients (Admin)
   */
  getAllPatients: async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Search patients by name (Admin)
   */
  searchPatients: async (query) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Update patient
   */
  updatePatient: async (id, updates) => {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete patient
   */
  deletePatient: async (id) => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

export default patientService;
