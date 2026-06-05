import { motion } from 'framer-motion'
import Avatar      from '@/components/ui/Avatar'
import RingScore   from '@/components/ui/RingScore'
import Tag         from '@/components/ui/Tag'
import ProgressBar from '@/components/ui/ProgressBar'
import { riskColor } from '@/utils/helpers'

export default function AthleteRow({ athlete, delay = 0 }) {
  const rc = riskColor(athlete.risk)

  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2.5 rounded-apex border cursor-pointer
        transition-all duration-150 hover:bg-apex-bg4"
      style={{ background: 'rgba(255,255,255,0.025)', borderColor: `${rc}20` }}
      onHoverStart={e => e.target.style?.borderColor}
      whileHover={{ borderColor: `${rc}40` }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay }}
    >
      <Avatar initials={athlete.avatar} size={38} color={rc} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <div className="text-[13px] font-semibold text-white truncate">{athlete.name}</div>
            <div className="text-[10px] text-apex-txt2">
              {athlete.pos}
              {athlete.injury && <span className="ml-1 text-apex-red">· {athlete.injury}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Tag color={rc}>{athlete.risk} risk</Tag>
            <RingScore score={athlete.readiness} size={42} />
          </div>
        </div>
        <ProgressBar value={athlete.readiness} color={rc} height={4} />
      </div>
    </motion.div>
  )
}
