import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  // 1. Inisialisasi State untuk mengambil data input email
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // 2. Fungsi Logika saat tombol Log in ditekan
  const handleSubmit = (e) => {
    // Mencegah halaman refresh bawaan HTML agar rute tidak ter-reset otomatis
    e.preventDefault();

    // Akun penentu hak akses (Guest dihapus karena guest tidak perlu login)
    const EMAIL_MEMBER = 'member@azra.com'; 
    const EMAIL_ADMIN = 'admin@azra.com';   

    if (email.trim().toLowerCase() === EMAIL_MEMBER) {
      navigate('/member'); // Sukses masuk ke halaman khusus member
    } else if (email.trim().toLowerCase() === EMAIL_ADMIN) {
      navigate('/dashboard'); // Sukses masuk ke dashboard admin
    } else {
      // Jika ketik email lain, beri peringatan agar user tahu pilihan email yang valid
      alert('Email tidak dikenali. Gunakan admin@azra.com atau member@azra.com');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-bold text-[var(--dark-blue)] mb-2">Welcome Back</h1>
        <p className="text-gray-500">Discover a better way of spendings with Azcyra.</p>
      </div>

      <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all mb-8 font-medium">
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
        Log in with Google
      </button>

      <div className="relative flex py-5 items-center mb-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">Or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* 3. Pasang fungsi handleSubmit ke dalam tag form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          {/* 4. Sambungkan input email dengan state */}
          <input 
            type="email" 
            placeholder="Enter your Email (admin@azra.com / member@azra.com)" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
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

        <button type="submit" className="w-full py-4 rounded-xl text-lg font-medium shadow-lg bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 mt-4 transition-colors">
          Log in
        </button>
      </form>

      <p className="mt-8 text-center text-gray-500">
        Not member yet? <Link to="/register" className="text-[var(--dark-blue)] font-bold hover:underline">Create an account</Link>
      </p>
    </div>
  );
}