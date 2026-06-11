import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import appointmentsData from '../data/appointments.json';

export default function AppointmentPage() {
  // Tambahan state untuk kontrol halaman data
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Menampilkan 12 janji temu per halaman

  // Hitung pembatasan index data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointmentsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appointmentsData.length / itemsPerPage);

  return (
    <div>
      <PageHeader title="Appointments" subtitle={`Review and approve patient booking requests (Total: ${appointmentsData.length}).`} />
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Patient</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date & Time</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Service Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentAppointments.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-[var(--dark-blue)]">{item.patientName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date} | {item.time}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'Completed' ? 'bg-green-50 text-green-600' :
                    item.status === 'Canceled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-primary'
                  }`}>
                    {item.status || 'Scheduled'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tombol navigasi halaman bawah tabel */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600">
          <div>
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, appointmentsData.length)} of {appointmentsData.length} entries
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50 text-xs font-medium"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-xs font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50 text-xs font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}