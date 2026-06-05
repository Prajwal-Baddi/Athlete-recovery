import { useWellnessLogs } from '../../services/wellnessService';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function WellnessPage() {
  const {
    data: logs,
    isLoading,
    isError,
  } = useWellnessLogs();

  if (isLoading)
    return <h2>Loading wellness data...</h2>;

  if (isError)
    return <h2>Failed to load wellness data</h2>;

  const latest = logs?.[0];

  return (
    <DashboardLayout>
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Wellness Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <Card
          title="Sleep"
          value={`${latest?.sleepHours ?? 0} hrs`}
        />

        <Card
          title="HRV"
          value={latest?.hrv ?? 0}
        />

        <Card
          title="Calories"
          value={latest?.caloriesBurned ?? 0}
        />

        <Card
          title="Recovery"
          value={`${latest?.recoveryScore ?? 0}%`}
        />
      </div>

      <div className="mt-8 bg-slate-900 rounded-xl p-4">
        <h2 className="font-bold mb-4">
          Wellness History
        </h2>

        <table className="w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sleep</th>
              <th>HRV</th>
              <th>Calories</th>
              <th>Provider</th>
            </tr>
          </thead>

          <tbody>
            {logs?.map((log) => (
              <tr key={log._id}>
                <td>
                  {new Date(
                    log.date
                  ).toLocaleDateString()}
                </td>

                <td>{log.sleepHours}</td>

                <td>{log.hrv}</td>

                <td>{log.caloriesBurned}</td>

                <td>
                  {log.wearableProvider}
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

function Card({ title, value }) {
  return (
    <div className="bg-slate-900 rounded-xl p-4">
      <p className="text-slate-400">
        {title}
      </p>

      <h2 className="text-2xl font-bold">
        {value}
      </h2>
    </div>
  );
}