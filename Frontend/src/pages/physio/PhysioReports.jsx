import DashboardLayout from '../../components/layout/DashboardLayout';
import ReportsPage from '../ReportsPage';

export default function PhysioReports() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Reports</h1>
          <p className="text-apex-txt2 mt-2">Generate and view detailed recovery reports.</p>
        </div>
        <ReportsPage />
      </div>
    </DashboardLayout>
  );
}
