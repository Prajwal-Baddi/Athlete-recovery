import DashboardLayout from '../../components/layout/DashboardLayout';
import InjuryAnalyticsPage from '../InjuryAnalyticsPage';

export default function PhysioInjuries() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Injuries Management</h1>
          <p className="text-apex-txt2 mt-2">Track and analyze athlete injuries.</p>
        </div>
        <InjuryAnalyticsPage />
      </div>
    </DashboardLayout>
  );
}
