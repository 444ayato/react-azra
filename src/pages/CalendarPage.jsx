import PageHeader from '../components/PageHeader';
import scheduleData from '../data/appointments.json';

export default function CalendarPage() {
  return (
    <div>
      <PageHeader title="Calendar" subtitle="Manage your daily schedules and dental sessions." />
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-[var(--dark-blue)]">Today's Schedule</h2>
          <span className="text-sm text-primary font-medium">May 2026</span>
        </div>
        
        <div className="space-y-4">
          {scheduleData.map((event) => (
            <div key={event.id} className="flex gap-6 items-start p-4 border-l-4 border-primary bg-blue-50/30 rounded-r-xl">
              <span className="text-sm font-bold text-primary w-12">{event.time}</span>
              <div>
                <h4 className="font-bold text-[var(--dark-blue)]">{event.patientName}</h4>
                <p className="text-sm text-gray-500">{event.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}