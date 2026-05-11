import React from 'react';
import PageHeader from '../components/PageHeader';
import dashboardData from '../data/dashboard.json'; // Panggil file spesifik

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard Overview" subtitle="Real-time clinic statistics." />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardData.stats.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm font-medium">{item.label}</p>
            <div className="flex justify-between items-end mt-2">
              <h3 className="text-3xl font-bold text-[var(--dark-blue)]">{item.value}</h3>
              <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}