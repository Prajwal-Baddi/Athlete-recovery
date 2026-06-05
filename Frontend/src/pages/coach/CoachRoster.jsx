import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAthletes } from '../../services/athleteService';

export default function CoachRoster() {
  const {
    data: athletes = [],
    isLoading,
  } = useAthletes();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-white">
          Loading athletes...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">
          Athlete Roster
        </h1>

        <div className="bg-slate-900 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Sport</th>
                <th className="p-4 text-left">Position</th>
                <th className="p-4 text-left">Readiness</th>
                <th className="p-4 text-left">Injuries</th>
                <th className="p-4 text-left">Physio</th>
              </tr>
            </thead>

            <tbody>
              {athletes.map((athlete) => (
                <tr
                  key={athlete._id}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {athlete.athleteName}
                  </td>

                  <td className="p-4">
                    {athlete.sport}
                  </td>

                  <td className="p-4">
                    {athlete.position}
                  </td>

                  <td className="p-4">
                    {athlete.readinessScore?.value ?? 0}%
                  </td>

                  <td className="p-4">
                    {athlete.activeInjuryCount}
                  </td>

                  <td className="p-4">
                    {athlete.assignedPhysio?.name ??
                      'Unassigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}