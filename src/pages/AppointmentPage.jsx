import PageHeader from '../components/PageHeader';
import appointmentsData from '../data/appointments.json';

export default function AppointmentPage() {
  return (
    <div>
      <PageHeader title="Appointments" subtitle="Review and approve patient booking requests." />
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
            {appointmentsData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-[var(--dark-blue)]">{item.patientName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date} | {item.time}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-primary">
                    {item.status || 'Scheduled'}
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