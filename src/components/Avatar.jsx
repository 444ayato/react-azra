import React from 'react';

export default function Avatar({ name = 'User' }) {
  // Ambil huruf pertama dari prop nama
  const initial = name.charAt(0).toUpperCase();

  return (
    <div 
      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gray-200 text-[#011632] border border-gray-300 shadow-sm"
      title={name}
    >
      {initial}
    </div>
  );
}