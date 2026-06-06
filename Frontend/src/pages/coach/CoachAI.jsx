import DashboardLayout from '../../components/layout/DashboardLayout';
import AIReportsPage from '../AIReportsPage';

export default function CoachAI() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">AI Insights</h1>
          <p className="text-apex-txt2 mt-2">AI-driven actionable insights for your team's recovery.</p>
        </div>
        <AIReportsPage />
      </div>
    </DashboardLayout>
  );
}
