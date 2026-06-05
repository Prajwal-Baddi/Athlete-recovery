import ProgressBar from '@/components/ui/ProgressBar'

export default function WearableCard({ device }) {
  const { name, icon, status, last, battery, color } = device
  const synced = status === 'synced'
  const batColor = battery < 20 ? '#ff5f6d' : color

  return (
    <div
      className="rounded-apex p-3 transition-all duration-200 hover:-translate-y-px"
      style={{
        background:  'rgba(255,255,255,0.025)',
        border:      `1px solid ${synced ? color + '30' : 'rgba(255,255,255,0.07)'}`,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = color + '50')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = synced ? color + '30' : 'rgba(255,255,255,0.07)')}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="font-display text-[12px] font-semibold">{name}</span>
        </div>
        <span
          className={`w-2 h-2 rounded-full ${synced ? 'dot-pulse' : ''}`}
          style={{ background: synced ? '#00d4aa' : '#4a5568' }}
        />
      </div>
      <div className="text-[10px] text-apex-txt3 mb-2">Last sync: {last}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ProgressBar value={battery} color={batColor} height={4} />
        </div>
        <span className="text-[10px] text-apex-txt2 flex-shrink-0">{battery}%</span>
      </div>
    </div>
  )
}
