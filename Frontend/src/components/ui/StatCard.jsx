import { motion } from 'framer-motion'

export default function StatCard({ label, value, sub, color = '#10b981', icon, trend, delay = 0 }) {
  const trendUp = trend && (trend.startsWith('+') || (!trend.startsWith('-') && !trend.startsWith('−')))

  return (
    <motion.div
      className="bg-apex-bg2 border border-apex-border rounded-apex p-5 shadow-apex-card transition-all duration-200 hover:border-apex-border2 hover:-translate-y-px"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-apex-txt2 font-semibold tracking-wide">
          {label}
        </span>
        {icon && (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ backgroundColor: `${color}1A`, color: color }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="font-display text-3xl font-bold tracking-tight text-white mb-2">
        {value}
      </div>

      <div className="flex items-center mt-3 gap-2">
        {trend && (
          <div
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: trendUp ? '#10b981' : '#ef4444' }}
          >
            {trendUp ? '↗' : '↘'} {trend}
          </div>
        )}
        {sub && <div className="text-xs text-apex-txt3">{sub}</div>}
      </div>
    </motion.div>
  )
}
