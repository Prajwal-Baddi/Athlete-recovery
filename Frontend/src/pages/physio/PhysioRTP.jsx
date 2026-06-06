import DashboardLayout from '../../components/layout/DashboardLayout';
import RTPCandidates from '../../features/recovery/components/RTPCandidates';

export default function PhysioRTP() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Return To Play Evaluation</h1>
          <p className="text-apex-txt2 mt-2">Review athletes who meet RTP criteria and approve their return to play.</p>
        </div>
        <div className="mt-8">
            <RTPCandidates />
        </div>
      </div>
    </DashboardLayout>
  );
}
