import DashboardLayout from '../../components/layout/DashboardLayout';
import WellnessPage from '../WellnessPage';

export default function PhysioPain() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Pain & Wellness Tracking</h1>
          <p className="text-apex-txt2 mt-2">Monitor daily wellness and pain levels.</p>
        </div>
        <WellnessPage />
      </div>
    </DashboardLayout>
  );
}
