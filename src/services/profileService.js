// C:\azra-core\src\services\profileService.js
import supabase from '../lib/supabase';

export const profileService = {
  /**
   * Get profile by user ID (UUID from auth.users)
   */
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  /**
   * Create profile (after sign up)
   */
  createProfile: async ({ id, full_name, phone, role }) => {
    try {
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
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  /**
   * Update profile
   */
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Get all profiles (Admin only)
   */
  getAllProfiles: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
  }
};

export default profileService;