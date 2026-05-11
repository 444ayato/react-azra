import React, { useState, useMemo } from 'react';
import carData from './cars.json';

const AdminDashboard = ({ onSwitch }) => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');

  const brands = useMemo(() => ['All', ...new Set(carData.map(c => c.brand))].sort(), []);
  const fuelTypes = useMemo(() => ['All', ...new Set(carData.map(c => c.engine?.fuel))].sort(), []);

  const filteredCars = useMemo(() => {
    return carData.filter(car => {
      const matchesSearch = car.model.toLowerCase().includes(search.toLowerCase()) || 
                            car.brand.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brandFilter === 'All' || car.brand === brandFilter;
      const matchesFuel = fuelFilter === 'All' || car.engine?.fuel === fuelFilter;
      return matchesSearch && matchesBrand && matchesFuel;
    });
  }, [search, brandFilter, fuelFilter]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      <header className="bg-[#111] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tighter italic text-white">
              AZ<span className="text-blue-600">CYRA</span> <span className="text-gray-500 font-light not-italic ml-2 text-sm">ADMIN PANEL</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={onSwitch}
              className="group flex items-center gap-2 border border-blue-600/30 hover:border-blue-600 bg-blue-600/5 hover:bg-blue-600 text-blue-500 hover:text-white text-[10px] font-bold py-2 px-5 rounded-full transition-all duration-300"
            >
              <span>BACK TO SHOWCASE</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center font-bold text-white border border-gray-700">A</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-8 items-end">
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#111] p-5 rounded-2xl border border-gray-800 shadow-xl">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Search Database</label>
              <input 
                type="text" placeholder="Filter by name..."
                className="bg-black border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Brand</label>
              <select className="bg-black border border-gray-800 rounded-lg px-4 py-2 text-sm outline-none" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Fuel</label>
              <select className="bg-black border border-gray-800 rounded-lg px-4 py-2 text-sm outline-none" value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value)}>
                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="bg-blue-600/5 border border-blue-900/20 p-5 rounded-2xl min-w-[200px]">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Live Inventory</p>
            <p className="text-3xl font-black text-white">{filteredCars.length} <span className="text-blue-600 text-sm">CARS</span></p>
          </div>
        </div>

        <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 border-b border-gray-800 text-[10px] text-gray-500 uppercase">
                  <th className="px-6 py-5">Vehicle</th>
                  <th className="px-6 py-5">Engine</th>
                  <th className="px-6 py-5">Performance</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-blue-600/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={car.image} className="w-12 h-8 rounded object-cover" alt="" />
                        <div>
                          <p className="text-sm font-bold text-white uppercase">{car.brand} {car.model}</p>
                          <p className="text-[10px] text-gray-500">{car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[11px]">
                      <p className="text-gray-300">{car.engine?.type}</p>
                      <p className="text-gray-600">{car.engine?.displacement}</p>
                    </td>
                    <td className="px-6 py-4 text-[11px]">
                      <p className="text-gray-300">{car.performance?.horsepower} HP</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-bold text-blue-500">${car.price?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="bg-white/5 hover:bg-blue-600 text-[9px] py-1 px-3 rounded border border-white/10 uppercase">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;