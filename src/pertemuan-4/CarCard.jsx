import React from 'react';

const CarCard = ({ car }) => {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-500 shadow-2xl group">
      <div className="h-56 overflow-hidden relative">
        <img 
          src={car.image} 
          alt={car.model} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-20"></div>
        <span className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-blue-400">
          {car.year}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
          {car.brand} {car.model}
        </h3>
        <p className="text-blue-500 font-mono font-bold text-lg mb-4">
          ${car.price.toLocaleString()}
        </p>
        
        <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
          <div className="space-y-1">
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Engine</p>
            <p className="text-xs text-gray-300">{car.engine.type}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Power</p>
            <p className="text-xs text-gray-300">{car.performance.horsepower} HP</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Origin</p>
            <p className="text-xs text-gray-300">{car.location.country}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Top Speed</p>
            <p className="text-xs text-gray-300">{car.performance.topSpeed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;