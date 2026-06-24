import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Gabungkan first name dan last name menjadi kolom username tunggal di tabel Supabase
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      await userService.registerUser({
        username: fullName,
        email: email,
        password: password,
        role: 'member' // Default register sebagai portal pasien khusus member
      });

      setSuccess('Account created successfully! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-bold text-[var(--dark-blue)] mb-2">Create Account</h1>
        <p className="text-gray-500">Join our community and get the best dental care.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl border border-green-100 text-sm font-medium">
          🎉 {success}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input 
              type="text" 
              placeholder="John" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input 
              type="text" 
              placeholder="Doe" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              required 
            />
          </div>
        </div>

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
            placeholder="Min. 8 characters" 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            minLength={8}
            required
          />
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded text-[var(--primary)]" disabled={loading} required />
            <span className="text-sm text-gray-500">
              I agree to the <span className="text-[var(--primary)] underline">Terms & Conditions</span> and Privacy Policy.
            </span>
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-4 rounded-xl text-lg shadow-lg shadow-blue-200 mt-4 transition-colors"
        >
          {loading ? 'Processing Registration...' : 'Create Account'}
        </button>
      </form>

      <div className="relative flex py-6 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">Or register with</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <button className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium">
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
        Google
      </button>

      <p className="mt-8 text-center text-gray-500">
        Already have an account? <Link to="/login" className="text-[var(--dark-blue)] font-bold hover:underline">Log in</Link>
      </p>
    </div>
  );
}