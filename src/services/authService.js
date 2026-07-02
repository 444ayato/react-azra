import { supabase } from '../lib/supabase';
import { profileService } from './profileService';

export const authService = {
  /**
   * Sign Up — Buat akun baru via Supabase Auth + auto-create profile
   */
  signUp: async ({ email, password, fullName, phone }) => {
    // 1. Daftar ke Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (signUpError) throw new Error(signUpError.message);
    if (!authData.user) throw new Error('Registrasi gagal. Silakan coba lagi.');

    // 2. Auto-create profile
    try {
      await profileService.createProfile({
        id: authData.user.id,
        full_name: fullName,
        phone: phone || null,
        role: 'member'
      });

      // 3. Init points record
      await supabase.from('points').insert({
        profile_id: authData.user.id,
        total_points: 100, // Bonus pendaftaran
        current_tier: 'Bronze'
      });
    } catch (profileErr) {
      console.warn('Profile/points creation skipped:', profileErr);
    }

    return authData.user;
  },

  /**
   * Sign In — Login dengan email & password
   */
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Email atau password salah!');

    // Ambil profile untuk cek role
    const profile = await profileService.getProfile(data.user.id);
    return { user: data.user, session: data.session, profile };
  },

  /**
   * Sign Out — Hapus session
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.warn('Sign out warning:', error.message);
  },

  /**
   * Get current session
   */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default authService;
