import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function WellnessChart({
  data,
}) {
  return (
    <div className="card h-[420px]">
      <h3 className="text-xl font-semibold mb-6">
        Wellness Trends
      </h3>

      <ResponsiveContainer
        width="100%"
        height="90%"
      >
        <LineChart data={data}>
          <CartesianGrid
            stroke="#1f2937"
          />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="recoveryScore"
            stroke="#22c55e"
          />

          <Line
            type="monotone"
            dataKey="hrv"
            stroke="#06b6d4"
          />

          <Line
            type="monotone"
            dataKey="sleepHours"
            stroke="#3b82f6"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}