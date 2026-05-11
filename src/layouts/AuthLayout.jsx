import { Outlet } from 'react-router-dom';
// 1. Import gambar secara eksplisit dari folder assets
import dokterGigiImg from '../assets/doktergigi.jpg';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F0FE] p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl flex overflow-hidden min-h-[600px]">
        
        {/* Sisi Kiri (Gambar dari folder Assets) */}
        <div className="hidden lg:block w-1/2 relative">
          <img 
            src={dokterGigiImg} // 2. Gunakan variabel hasil import di sini
            alt="Dentist Profile" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay agar teks tetap terbaca */}
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="absolute bottom-12 left-12 right-12 text-white z-10">
            <p className="text-2xl font-light italic leading-relaxed drop-shadow-md">
              "For There Was Never Yet Philosopher, That Could Endure The Toothache Patiently"
            </p>
            <p className="mt-4 font-bold tracking-wide drop-shadow-md">~ Dr Dre Andre Romelle</p>
            <p className="text-sm opacity-90">Founder of Smile Pvt.Ltd</p>
          </div>
        </div>
        
        {/* Sisi Kanan (Form Login/Register) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-12 lg:p-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
}