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
            stroke="#27272a"
          />

          <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />

          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />

          <Tooltip 
            contentStyle={{ backgroundColor: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          />

          <Line
            type="monotone"
            dataKey="recoveryScore"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="hrv"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="sleepHours"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}