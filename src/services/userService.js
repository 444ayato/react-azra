import supabase from '../lib/supabase';

export const userService = {
  getAllUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  registerUser: async (userData) => {
    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email.trim().toLowerCase())
        .single();

      if (existingUser) {
        throw new Error("Email Address sudah terdaftar!");
      }

      const { data, error } = await supabase
        .from('users')
        .insert({
          username: userData.username,
          email: userData.email.trim().toLowerCase(),
          password: userData.password,
          role: userData.role || 'member' 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  loginUser: async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error("Email Address atau Password salah!");
      }

      // Normalize role
      if (data.role === 'user') {
        data.role = 'member';
      }

      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
};

export default userService;