import React from 'react';

export default function Card({ children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      {children}
    </div>
  );
}