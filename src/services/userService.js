import api from './api';

export const userService = {
  // 1. Mengambil Semua Data User (Untuk Halaman Manajemen Admin jika diperlukan)
  getAllUsers: async () => {
    const response = await api.get('/users?order=id.asc');
    return response.data;
  },

  // 2. Tambah / Registrasi Akun Baru
  registerUser: async (userData) => {
    // Validasi duplikasi email sebelum mendaftar
    const checkEmail = await api.get(`/users?email=eq.${userData.email.trim().toLowerCase()}`);
    if (checkEmail.data.length > 0) {
      throw new Error("Email Address sudah terdaftar!");
    }

    const response = await api.post('/users', {
      username: userData.username,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role || 'member' // Default dari halaman pendaftaran mandiri akan menjadi 'member'
    });
    return response.data;
  },

  // 3. Login User (Verifikasi langsung silang ke Supabase)
  loginUser: async (email, password) => {
    const response = await api.get(`/users?email=eq.${email.trim().toLowerCase()}&password=eq.${password}`);
    
    if (response.data.length === 0) {
      throw new Error("Email Address atau Password salah!");
    }

    const matchedUser = response.data[0];

    // Penyelamat: Jika di database rolenya tertulis 'user', kita seragamkan menjadi 'member'
    // supaya sistem routing navigasi di halaman Login.jsx tidak bingung.
    if (matchedUser.role === 'user') {
      matchedUser.role = 'member';
    }

    return matchedUser; // Mengembalikan objek data pengguna yang sudah aman
  }
};