import { motion } from 'framer-motion'

export default function StatCard({ label, value, sub, color = '#00d4aa', icon, trend, delay = 0 }) {
  const trendUp = trend && (trend.startsWith('+') || (!trend.startsWith('-') && !trend.startsWith('−')))

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-apex-txt2 font-medium uppercase tracking-wide">
          {label}
        </span>
        {icon && <span className="text-base">{icon}</span>}
      </div>

      <div
        className="font-display text-2xl font-bold leading-none"
        style={{ color }}
      >
        {value}
      </div>

      <div className="flex items-center justify-between mt-1.5 gap-2">
        {sub && <div className="text-[11px] text-apex-txt3">{sub}</div>}
        {trend && (
          <div
            className="text-[11px] font-semibold ml-auto"
            style={{ color: trendUp ? '#00d4aa' : '#ff5f6d' }}
          >
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  )
}
