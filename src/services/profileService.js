import { supabase } from '../lib/supabase';

export const profileService = {
  /**
   * Get profile by user ID (UUID from auth.users)
   */
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  /**
   * Create profile (after sign up)
   */
  createProfile: async ({ id, full_name, phone, role }) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id,
        full_name,
        phone: phone || null,
        role: role || 'member'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update profile
   */
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all profiles (Admin only)
   */
  getAllProfiles: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

export default profileService;
