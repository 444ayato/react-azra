import PageHeader from '../components/PageHeader';
import patientsData from '../data/patients.json';
import { Search, User, Calendar, Activity, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPatients = patientsData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Healthy': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Critical': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Under Treatment': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Patients" 
        subtitle="Full list of your registered dental patients." 
      />
      
      {/* Search and Stats Bar - Lebih kompak */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
            <p className="text-lg font-bold text-[var(--dark-blue)] leading-tight">{patientsData.length}</p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Healthy</span>
            <p className="text-lg font-bold text-emerald-600 leading-tight">
              {patientsData.filter(p => p.status === 'Healthy').length}
            </p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Treatment</span>
            <p className="text-lg font-bold text-amber-600 leading-tight">
              {patientsData.filter(p => p.status === 'Under Treatment').length}
            </p>
          </div>
        </div>
        
        {/* Search Input - Lebih kompak */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue)] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Compact Grid Cards - Lebih padat dan tidak perlu scroll banyak */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div 
              key={patient.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:border-[var(--dark-blue)]/20 group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--dark-blue)] to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--dark-blue)] text-sm truncate">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">#{patient.id}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--dark-blue)] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{patient.lastVisit}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusColor(patient.status)} inline-flex items-center gap-1.5`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    patient.status === 'Healthy' ? 'bg-emerald-500' : 
                    patient.status === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  {patient.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <Search className="w-6 h-6 text-gray-300" />
              <p className="text-sm">No patients found</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer - Lebih kompak */}
      <div className="flex justify-between items-center text-xs text-gray-400 pt-1">
        <span>Showing {filteredPatients.length} of {patientsData.length} patients</span>
        <div className="flex gap-1">
          <button className="px-2.5 py-1 text-gray-500 hover:text-[var(--dark-blue)] hover:bg-gray-50 rounded-lg transition-all">
            Previous
          </button>
          <button className="px-2.5 py-1 bg-[var(--dark-blue)] text-white rounded-lg hover:bg-blue-800 transition-colors text-[10px]">
            1
          </button>
          <button className="px-2.5 py-1 text-gray-500 hover:text-[var(--dark-blue)] hover:bg-gray-50 rounded-lg transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}