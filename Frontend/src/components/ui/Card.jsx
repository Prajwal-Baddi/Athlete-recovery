import { motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

export default function Card({
  children,
  className = '',
  style = {},
  delay = 0,
  hover = true,
  glow = false,
}) {
  return (
    <motion.div
      className={cn(
        'bg-apex-bg2 border border-apex-border rounded-apex-lg p-4 transition-colors duration-200',
        hover && 'hover:border-apex-border2',
        glow && 'animate-glow-pulse',
        className,
      )}
      style={style}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ title, sub, right }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-display text-[13px] font-semibold text-white">{title}</h3>
        {sub && <p className="text-[11px] text-apex-txt2 mt-0.5">{sub}</p>}
      </div>
      {right && <div className="flex-shrink-0 ml-2">{right}</div>}
    </div>
  )
}
