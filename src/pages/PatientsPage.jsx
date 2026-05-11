import PageHeader from '../components/PageHeader';
import patientsData from '../data/patients.json';

export default function PatientsPage() {
  return (
    <div>
      <PageHeader title="Patients" subtitle="Full list of your registered dental patients." />
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Patient Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Last Visit</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Health Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patientsData.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-400 font-mono">{patient.id}</td>
                <td className="px-6 py-4 font-bold text-[var(--dark-blue)]">{patient.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{patient.lastVisit}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    patient.status === 'Healthy' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}