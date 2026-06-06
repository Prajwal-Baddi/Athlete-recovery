import { usePainTrend } from '../../../hooks/useRecovery';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function PainTrendChart({ caseId }) {
  const { data: trend = [], isLoading } = usePainTrend(caseId, 30);

  if (isLoading) {
    return (
      <div className="h-80 bg-apex-bg2 border border-apex-border rounded-apex animate-pulse" />
    );
  }

  const chartData = trend.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pain: entry.painScore,
  }));

  const currentPain = chartData[chartData.length - 1]?.pain ?? 0;
  const previousPain = chartData[0]?.pain ?? 0;
  const improvement = previousPain - currentPain;
  const improvementPercent = previousPain !== 0 ? Math.round((improvement / previousPain) * 100) : 0;

  const getPainStatus = () => {
    if (improvementPercent > 10) return { text: 'Improving', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (improvementPercent > -10) return { text: 'Stable', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { text: 'Worsening', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const status = getPainStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-apex-bg2 border border-apex-border rounded-apex p-6 shadow-apex-card"
    >
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Pain Trend</h3>
            <p className="text-apex-txt2 text-sm mt-1">Last 30 days</p>
          </div>
          <div className={`px-3 py-1 rounded-full font-semibold text-xs border border-transparent ${status.bg} ${status.color}`}>
            {status.text}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-apex-txt2 text-xs mb-1 font-semibold tracking-wide">CURRENT PAIN</p>
            <p className="text-2xl font-bold text-white">{currentPain}/10</p>
          </div>
          <div>
            <p className="text-apex-txt2 text-xs mb-1 font-semibold tracking-wide">PREVIOUS</p>
            <p className="text-2xl font-bold text-apex-txt2">{previousPain}/10</p>
          </div>
          <div>
            <p className="text-apex-txt2 text-xs mb-1 font-semibold tracking-wide">IMPROVEMENT</p>
            <p className={`text-2xl font-bold ${improvementPercent > 0 ? 'text-emerald-400' : improvementPercent < 0 ? 'text-red-400' : 'text-apex-txt2'}`}>
              {improvementPercent > 0 ? '+' : ''}{improvementPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#a1a1aa"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#a1a1aa"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#121214',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value) => [`${value}/10`, 'Pain Score']}
            />
            <Line
              type="monotone"
              dataKey="pain"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6' }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center">
          <p className="text-apex-txt3">No pain data available</p>
        </div>
      )}
    </motion.div>
  );
}
