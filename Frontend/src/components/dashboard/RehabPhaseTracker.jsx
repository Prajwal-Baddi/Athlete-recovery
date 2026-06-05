import { REHAB_PHASES } from '@/data/mockData'

export default function RehabPhaseTracker({ phases = REHAB_PHASES }) {
  return (
    <div className="flex items-start">
      {phases.map((p, i) => {
        const color = p.complete ? '#00d4aa' : p.current ? '#ffb347' : '#4a5568'
        const bg    = p.complete ? 'rgba(0,212,170,0.18)' : p.current ? 'rgba(255,179,71,0.18)' : 'rgba(255,255,255,0.04)'
        return (
          <div key={p.phase} className="flex items-center flex-1">
            {i > 0 && (
              <div
                className="flex-1 h-0.5"
                style={{ background: phases[i - 1].complete ? '#00d4aa' : 'rgba(255,255,255,0.06)' }}
              />
            )}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: bg, border: `2px solid ${color}`, color }}
              >
                {p.complete ? '✓' : i + 1}
              </div>
              <div
                className="text-[9px] mt-1 font-medium text-center"
                style={{ color }}
              >
                {p.phase}
              </div>
              <div className="text-[9px] text-apex-txt3">{p.days}d</div>
            </div>
            {i < phases.length - 1 && (
              <div
                className="flex-1 h-0.5"
                style={{ background: p.complete ? '#00d4aa' : 'rgba(255,255,255,0.06)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
