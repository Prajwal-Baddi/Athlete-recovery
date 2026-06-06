import DashboardLayout from '../../components/layout/DashboardLayout';
import TimelinePage from '../TimelinePage';

export default function PhysioRehab() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Rehab Programs</h1>
          <p className="text-apex-txt2 mt-2">Monitor athlete rehabilitation timelines.</p>
        </div>
        <TimelinePage />
      </div>
    </DashboardLayout>
  );
}
