import { motion } from 'framer-motion';
import { useDashboardStats } from '../../../hooks/useRecovery';

const StatCard = ({ label, value, icon, color = '#3b82f6', trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
    className="bg-apex-bg2 border border-apex-border rounded-apex shadow-apex-card p-6 text-white"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/70 text-sm mb-2">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
      <div
        className="text-4xl opacity-80"
        style={{ color }}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

export default function RecoveryStats() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-apex-bg2 border border-apex-border rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Recovery Cases"
        value={stats?.totalCases || 0}
        icon="📋"
        color="#3b82f6"
      />
      <StatCard
        label="Active Recovery Plans"
        value={stats?.activePlans || 0}
        icon="⚡"
        color="#10b981"
      />
      <StatCard
        label="RTP Candidates"
        value={stats?.rtpCandidates || 0}
        icon="🎯"
        color="#f59e0b"
      />
      <StatCard
        label="Overdue Cases"
        value={stats?.overdueCases || 0}
        icon="⚠️"
        color="#ef4444"
      />
    </div>
  );
}

