import DashboardLayout from '../../components/layout/DashboardLayout';
import { useWellnessLogs } from '../../services/wellnessService';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AthleteWellness() {
  const {
    data = [],
    isLoading,
  } = useWellnessLogs();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-white">
          Loading Wellness...
        </div>
      </DashboardLayout>
    );
  }

  const latest = data[0];

  const chartData = [...data]
    .reverse()
    .map((item) => ({
      date: new Date(
        item.createdAt || item.date
      ).toLocaleDateString(),
      recovery: item.recoveryScore,
      hrv: item.hrv,
      sleep: item.sleepHours,
    }));

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">

        {/* Header */}

        <div>
          <h1 className="text-4xl font-bold text-white">
            Wellness Dashboard
          </h1>

          <p className="text-apex-txt2 mt-2">
            Track recovery, sleep,
            readiness and wearable data
          </p>
        </div>

        {/* Metric Cards */}

        {latest && (
          <div className="grid lg:grid-cols-5 gap-5">

            <MetricCard
              title="Sleep"
              value={`${latest.sleepHours} hrs`}
              icon="🌙"
              glow="shadow-blue-500/20"
            />

            <MetricCard
              title="HRV"
              value={`${latest.hrv} ms`}
              icon="💚"
              glow="shadow-emerald-500/20"
            />

            <MetricCard
              title="Heart Rate"
              value={`${latest.restingHeartRate} bpm`}
              icon="❤️"
              glow="shadow-purple-500/20"
            />

            <MetricCard
              title="Calories"
              value={latest.caloriesBurned}
              icon="🔥"
              glow="shadow-orange-500/20"
            />

            <MetricCard
              title="Recovery"
              value={`${latest.recoveryScore}%`}
              icon="⚡"
              glow="shadow-green-500/20"
            />
          </div>
        )}

        {/* Main Section */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Chart */}

          <div className="lg:col-span-2 card h-[420px]">

            <h2 className="text-xl font-semibold mb-5">
              Wellness Trends
            </h2>

            <ResponsiveContainer
              width="100%"
              height="90%"
            >
              <LineChart data={chartData}>
                <CartesianGrid
                  stroke="#1f2937"
                />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="recovery"
                  stroke="#22c55e"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="hrv"
                  stroke="#06b6d4"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* Readiness */}

          <div className="card">

            <h2 className="text-xl font-semibold mb-6">
              Readiness Today
            </h2>

            <div className="flex justify-center">

              <div
                className="
                w-44
                h-44
                rounded-full
                border-[12px]
                border-green-500
                flex
                items-center
                justify-center
                text-5xl
                font-bold
                text-green-400
                shadow-lg
                shadow-green-500/30
              "
              >
                {latest?.recoveryScore || 0}%
              </div>

            </div>

            <p className="text-center mt-6 text-green-400">
              Ready For Training
            </p>

            <div className="mt-8 space-y-3">

              <InsightRow
                label="Sleep Quality"
                value="Excellent"
              />

              <InsightRow
                label="Recovery"
                value="High"
              />

              <InsightRow
                label="HRV Balance"
                value="Optimal"
              />

              <InsightRow
                label="Injury Risk"
                value="Low"
              />

            </div>

          </div>
        </div>

        {/* Bottom */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Logs */}

          <div className="lg:col-span-2 card">

            <h2 className="text-xl font-semibold mb-5">
              Recent Wellness Logs
            </h2>

            <table className="w-full">
              <thead>
                <tr className="text-apex-txt2">
                  <th className="text-left p-3">
                    Provider
                  </th>

                  <th className="text-left p-3">
                    Sleep
                  </th>

                  <th className="text-left p-3">
                    HRV
                  </th>

                  <th className="text-left p-3">
                    HR
                  </th>

                  <th className="text-left p-3">
                    Recovery
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((log) => (
                  <tr
                    key={log._id}
                    className="border-t border-apex-border"
                  >
                    <td className="p-3">
                      {log.wearableProvider}
                    </td>

                    <td className="p-3">
                      {log.sleepHours}
                    </td>

                    <td className="p-3">
                      {log.hrv}
                    </td>

                    <td className="p-3">
                      {log.restingHeartRate}
                    </td>

                    <td className="p-3 text-green-400">
                      {log.recoveryScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          {/* AI Insights */}

          <div className="card">

            <h2 className="text-xl font-semibold mb-5">
              AI Recovery Insights
            </h2>

            <div className="space-y-4">

              <InsightCard
                title="Great Recovery"
                text="Your HRV is above your weekly average."
              />

              <InsightCard
                title="Sleep Consistency"
                text="Sleep has improved over the last week."
              />

              <InsightCard
                title="Low Injury Risk"
                text="Recovery indicators suggest low injury risk."
              />

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

function MetricCard({
  title,
  value,
  icon,
  glow,
}) {
  return (
    <div
      className={`card shadow-lg ${glow}`}
    >
      <div className="text-3xl mb-3">
        {icon}
      </div>

      <div className="text-apex-txt2 text-sm">
        {title}
      </div>

      <div className="text-3xl font-bold mt-2">
        {value}
      </div>
    </div>
  );
}

function InsightRow({
  label,
  value,
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>

      <span className="text-green-400">
        {value}
      </span>
    </div>
  );
}

function InsightCard({
  title,
  text,
}) {
  return (
    <div className="bg-apex-bg3 rounded-xl p-4">
      <h4 className="font-semibold">
        {title}
      </h4>

      <p className="text-sm text-apex-txt2 mt-2">
        {text}
      </p>
    </div>
  );
}