import React, { useState, useMemo } from 'react';
import carData from './cars.json';
import CarCard from './CarCard';
import AdminDashboard from './admin'; // Mengimpor file admin.jsx

const CarShowcase = () => {
  // State untuk berpindah halaman
  const [activeView, setActiveView] = useState('user');
  
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');

  // Lógica perpindahan halaman
  if (activeView === 'admin') {
    return <AdminDashboard onSwitch={() => setActiveView('user')} />;
  }

  const brands = useMemo(() => ['All', ...new Set(carData.map(c => c.brand))].sort(), []);
  const fuelTypes = useMemo(() => ['All', ...new Set(carData.map(c => c.engine.fuel))].sort(), []);

  const filteredCars = useMemo(() => {
    return carData.filter(car => {
      const matchesSearch = car.model.toLowerCase().includes(search.toLowerCase()) || 
                            car.brand.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brandFilter === 'All' || car.brand === brandFilter;
      const matchesFuel = fuelFilter === 'All' || car.engine.fuel === fuelFilter;
      return matchesSearch && matchesBrand && matchesFuel;
    });
  }, [search, brandFilter, fuelFilter]);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-blue-500">
      <header className="border-b border-gray-900 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter">
            AZ<span className="text-blue-600">CYRA</span>
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-[10px] font-mono text-gray-600 tracking-[0.3em] uppercase">
              Luxury Automotive Gallery
            </div>
            
            {/* BUTTON KE ADMIN */}
            <button 
              onClick={() => setActiveView('admin')}
              className="bg-white text-black hover:bg-blue-600 hover:text-white text-[10px] font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg shadow-white/5 active:scale-95"
            >
              GO TO ADMIN
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="bg-gray-900/20 p-8 rounded-[2rem] border border-gray-800/50 mb-12 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Search Model</label>
              <input 
                type="text" placeholder="Ex: Porsche 911..."
                className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-5 py-3 text-sm focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Manufacturer</label>
              <select 
                className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-5 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Energy Source</label>
              <select 
                className="bg-[#0a0a0a] border border-gray-800 rounded-xl px-5 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
              >
                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </section>

        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-gray-800 rounded-[2rem]">
            <p className="text-gray-700 text-lg italic font-light tracking-widest">No inventory matches your search.</p>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-gray-900 mt-20 text-center">
        <p className="text-gray-700 text-[9px] font-mono uppercase tracking-[0.5em]">
          &copy; 2026 AZCYRA — Global Luxury Showroom
        </p>
      </footer>
    </div>
  );
};

export default CarShowcase;