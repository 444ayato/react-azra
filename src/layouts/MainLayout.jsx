import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // Pastikan baris ini ada

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header /> {/* Komponen Header sekarang sudah ada */}
        <main className="p-8">
          <Suspense fallback={<div className="flex justify-center p-20 font-medium">Loading Page...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}