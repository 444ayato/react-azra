import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import appointmentsData from '../data/appointments.json';
import { Search, Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, Clock as ClockIcon, Filter, ChevronRight } from 'lucide-react';

export default function AppointmentPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const itemsPerPage = 12;

  // Filter data berdasarkan search dan status
  const filteredData = appointmentsData.filter(item => {
    const matchSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusConfig = (status) => {
    switch(status) {
      case 'Completed':
        return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle };
      case 'Canceled':
        return { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle };
      case 'Scheduled':
      default:
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: ClockIcon };
    }
  };

  const statusOptions = ['All', 'Scheduled', 'Completed', 'Canceled'];

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Appointments" 
        subtitle={`Review and approve patient booking requests (Total: ${appointmentsData.length}).`} 
      />
      
      {/* Search and Filter Bar - Compact */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-wrap w-full sm:w-auto">
          {/* Stats */}
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
            <p className="text-lg font-bold text-[var(--dark-blue)] leading-tight">{filteredData.length}</p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Scheduled</span>
            <p className="text-lg font-bold text-blue-600 leading-tight">
              {filteredData.filter(p => p.status === 'Scheduled' || !p.status).length}
            </p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Completed</span>
            <p className="text-lg font-bold text-emerald-600 leading-tight">
              {filteredData.filter(p => p.status === 'Completed').length}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue)] focus:border-transparent transition-all"
            />
          </div>
          
          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue)] focus:border-transparent transition-all"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Compact Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {currentAppointments.length > 0 ? (
          currentAppointments.map((item) => {
            const StatusIcon = getStatusConfig(item.status || 'Scheduled').icon;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:border-[var(--dark-blue)]/20 group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {item.patientName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--dark-blue)] text-sm truncate">
                        {item.patientName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Stethoscope className="w-3 h-3" />
                        <span className="truncate">{item.type}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--dark-blue)] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusConfig(item.status || 'Scheduled').color} inline-flex items-center gap-1.5`}>
                    <StatusIcon className="w-3 h-3" />
                    {item.status || 'Scheduled'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-8 text-center text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <Search className="w-6 h-6 text-gray-300" />
              <p className="text-sm">No appointments found</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Compact Pagination */}
      {filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400 pt-1">
          <span>
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
          </span>
          <div className="flex gap-1 items-center">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              disabled={currentPage === 1}
              className="px-2.5 py-1 text-gray-500 hover:text-[var(--dark-blue)] hover:bg-gray-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2.5 py-1 text-[10px] font-semibold text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 text-gray-500 hover:text-[var(--dark-blue)] hover:bg-gray-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}