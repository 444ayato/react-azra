import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verifikasi kredensial ke tabel users Supabase
      const user = await userService.loginUser(email, password);
      
      // Simpan session objek ke localStorage
      localStorage.setItem('userSession', JSON.stringify(user));
      
      // Pengalihan halaman dinamis berdasarkan kolom 'role' dari database
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/member');
      }
    } catch (err) {
      setError(err.message || 'Gagal terhubung ke database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-bold text-[var(--dark-blue)] mb-2">Welcome Back</h1>
        <p className="text-gray-500">Discover a better way of spendings with Azcyra.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all mb-8 font-medium">
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
        Log in with Google
      </button>

      <div className="relative flex py-5 items-center mb-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-[var(--primary)]" />
            <span className="text-sm text-gray-600">Remember Me</span>
          </label>
          <Link to="/forgot-password" name="forgot" className="text-sm text-gray-400 hover:text-[var(--primary)]">
            Forget Password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 rounded-xl text-lg font-medium shadow-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-blue-100 mt-4 transition-colors"
        >
          {loading ? 'Verifying Credentials...' : 'Log in'}
        </button>
      </form>

      <p className="mt-8 text-center text-gray-500">
        Not member yet? <Link to="/register" className="text-[var(--dark-blue)] font-bold hover:underline">Create an account</Link>
      </p>
    </div>
  );
}