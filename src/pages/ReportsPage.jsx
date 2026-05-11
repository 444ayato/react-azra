import PageHeader from '../components/PageHeader';
import reportsData from '../data/reports.json';

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Analyze clinic performance and financial growth." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-400 font-medium mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-bold text-green-600">{reportsData.monthlyRevenue}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Patient Growth</span>
              <span className="font-bold text-primary">{reportsData.patientGrowth}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-400 font-medium mb-4">Top Performed Service</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center font-bold">1</div>
            <p className="text-xl font-bold text-[var(--dark-blue)]">{reportsData.topService}</p>
          </div>
        </div>
      </div>
    </div>
  );
}