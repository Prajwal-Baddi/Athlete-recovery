import { scoreColor } from '@/utils/helpers'

export default function RingScore({ score, size = 80, label }) {
  const r    = size / 2 - 7
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = scoreColor(score)
  const fs    = size * 0.22

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash.toFixed(1)} ${circ.toFixed(1)}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dasharray 1s ease, stroke 0.5s',
            filter: `drop-shadow(0 0 6px ${color}60)`,
          }}
        />
        <text
          x={size / 2} y={size / 2 + 1}
          textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize={fs}
          fontFamily="Space Grotesk" fontWeight={700}
        >
          {score}
        </text>
      </svg>
      {label && (
        <span className="text-[10px] text-apex-txt2 text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  )
}
