import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-bold text-[var(--dark-blue)] mb-2">Create Account</h1>
        <p className="text-gray-500">Join our community and get the best dental care.</p>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input type="text" placeholder="John" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input type="text" placeholder="Doe" className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            placeholder="Min. 8 characters" 
            className="input-field"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded text-[var(--primary)]" required />
            <span className="text-sm text-gray-500">
              I agree to the <span className="text-[var(--primary)] underline">Terms & Conditions</span> and Privacy Policy.
            </span>
          </label>
        </div>

        <button type="submit" className="w-full btn-primary py-4 rounded-xl text-lg shadow-lg shadow-blue-200 mt-4">
          Create Account
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