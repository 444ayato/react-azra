import api from './api';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users?order=id.asc');
    return response.data;
  },

  registerUser: async (userData) => {
    const checkEmail = await api.get(`/users?email=eq.${userData.email.trim().toLowerCase()}`);
    if (checkEmail.data.length > 0) {
      throw new Error("Email Address sudah terdaftar!");
    }

    const response = await api.post('/users', {
      username: userData.username,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role || 'member' 
    });
    // PostgREST returns array [createdRecord], extract first item
    return response.data && response.data.length > 0 ? response.data[0] : null;
  },

  loginUser: async (email, password) => {
    const response = await api.get(`/users?email=eq.${email.trim().toLowerCase()}&password=eq.${password}`);
    
    if (response.data.length === 0) {
      throw new Error("Email Address atau Password salah!");
    }

    const matchedUser = response.data[0];

    if (matchedUser.role === 'user') {
      matchedUser.role = 'member';
    }

    return matchedUser; 
  }
};