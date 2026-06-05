import { useState } from 'react'

const ZONES = [
  { id: 'head',      cx: 185, cy: 72,  r: 20, status: 'ok',      label: 'Head'        },
  { id: 'rShoulder', cx: 148, cy: 130, r: 13, status: 'warning', label: 'R. Shoulder' },
  { id: 'lShoulder', cx: 222, cy: 130, r: 13, status: 'ok',      label: 'L. Shoulder' },
  { id: 'chest',     cx: 185, cy: 148, r: 16, status: 'ok',      label: 'Chest'       },
  { id: 'core',      cx: 185, cy: 190, r: 14, status: 'ok',      label: 'Core'        },
  { id: 'lQuad',     cx: 158, cy: 225, r: 12, status: 'injury',  label: 'L. Quad'     },
  { id: 'rQuad',     cx: 212, cy: 225, r: 12, status: 'ok',      label: 'R. Quad'     },
  { id: 'lKnee',     cx: 158, cy: 268, r: 10, status: 'warning', label: 'L. Knee'     },
  { id: 'rKnee',     cx: 212, cy: 268, r: 10, status: 'ok',      label: 'R. Knee'     },
  { id: 'lCalf',     cx: 156, cy: 308, r: 10, status: 'ok',      label: 'L. Calf'     },
  { id: 'rCalf',     cx: 214, cy: 308, r: 10, status: 'ok',      label: 'R. Calf'     },
]

const STATUS_COLOR = { ok: '#00d4aa', warning: '#ffb347', injury: '#ff5f6d' }
const LEGEND       = [['ok', 'Healthy'], ['warning', 'Monitor'], ['injury', 'Injured']]

export default function BodyMap() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="flex flex-col items-center">
      <svg width="100%" viewBox="50 50 270 310" className="cursor-pointer" style={{ maxHeight: 300 }}>
        {/* Silhouette */}
        <g opacity={0.13}>
          <ellipse cx="185" cy="72" rx="24" ry="26" fill="#8892a4" />
          <rect x="165" y="105" width="40" height="10" rx="5" fill="#8892a4" />
          <rect x="150" y="115" width="70" height="65" rx="14" fill="#8892a4" />
          <rect x="118" y="122" width="26" height="72" rx="11" fill="#8892a4" />
          <rect x="226" y="122" width="26" height="72" rx="11" fill="#8892a4" />
          <rect x="158" y="180" width="54" height="30" rx="9" fill="#8892a4" />
          <rect x="150" y="207" width="28" height="82" rx="10" fill="#8892a4" />
          <rect x="192" y="207" width="28" height="82" rx="10" fill="#8892a4" />
          <rect x="148" y="285" width="24" height="60" rx="9" fill="#8892a4" />
          <rect x="198" y="285" width="24" height="60" rx="9" fill="#8892a4" />
          <rect x="144" y="338" width="32" height="13" rx="6" fill="#8892a4" />
          <rect x="194" y="338" width="32" height="13" rx="6" fill="#8892a4" />
        </g>

        {/* Zones */}
        {ZONES.map(z => {
          const color    = STATUS_COLOR[z.status]
          const isHov    = hovered === z.id
          const isActive = z.status !== 'ok'

          return (
            <g
              key={z.id}
              onMouseEnter={() => setHovered(z.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer', transition: 'all .2s' }}
            >
              <circle
                cx={z.cx} cy={z.cy}
                r={isHov ? z.r * 1.3 : z.r}
                fill={`${color}${isHov ? '40' : '20'}`}
                stroke={color}
                strokeWidth={isHov ? 2 : 1.5}
                style={{ transition: 'all 0.2s' }}
              />
              {isActive && (
                <circle cx={z.cx} cy={z.cy} r={4} fill={color} opacity={0.9}>
                  <animate
                    attributeName="opacity"
                    values="0.9;0.3;0.9"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              {/* Tooltip */}
              {isHov && (
                <g>
                  <rect
                    x={z.cx - 36} y={z.cy - z.r - 28}
                    width={72} height={22} rx={6}
                    fill="#0f1526" stroke="rgba(255,255,255,0.1)"
                  />
                  <text
                    x={z.cx} y={z.cy - z.r - 14}
                    textAnchor="middle" fill={color}
                    fontSize={10} fontFamily="Inter" fontWeight={600}
                  >
                    {z.label}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-1">
        {LEGEND.map(([s, l]) => (
          <div key={s} className="flex items-center gap-1.5 text-[10px] text-apex-txt2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: STATUS_COLOR[s] }}
            />
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
