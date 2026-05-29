import React from 'react';

export default function Button({ type = 'primary', children, onClick, ...props }) {
  // Mapping class Tailwind berdasarkan prop type
  const themeStyles = {
    primary: 'bg-[#1376f8] text-white hover:bg-opacity-90',
    success: 'bg-[#17bf28] text-white hover:bg-opacity-90',
    danger: 'bg-[#e52323] text-white hover:bg-opacity-90',
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 text-sm ${themeStyles[type] || themeStyles.primary}`}
      {...props}
    >
      {children}
    </button>
  );
}