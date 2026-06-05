import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line,
} from 'recharts'
import ChartTooltip from './ChartTooltip'
import { RECOVERY_TREND } from '@/data/mockData'

const CHART_COLORS = {
  score: '#00d4aa',
  hrv:   '#4a9eff',
  load:  '#ffb347',
}

export default function RecoveryTrendChart({ data = RECOVERY_TREND, height = 160 }) {
  return (
    <>
      {/* Legend */}
      <div className="flex gap-4 mb-3">
        {Object.entries({ Score: 'score', HRV: 'hrv', Load: 'load' }).map(([l, k]) => (
          <div key={k} className="flex items-center gap-1.5 text-[11px] text-apex-txt2">
            <div className="w-2 h-2 rounded-[2px]" style={{ background: CHART_COLORS[k] }} />
            {l}
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#00d4aa" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="gradHrv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4a9eff" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#4a9eff" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="day"
            tick={{ fill: '#8892a4', fontSize: 11 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8892a4', fontSize: 11 }}
            axisLine={false} tickLine={false}
            domain={[40, 100]}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone" dataKey="score" name="Score"
            stroke={CHART_COLORS.score} fill="url(#gradScore)"
            strokeWidth={2} dot={false}
          />
          <Area
            type="monotone" dataKey="hrv" name="HRV"
            stroke={CHART_COLORS.hrv} fill="url(#gradHrv)"
            strokeWidth={2} dot={false}
          />
          <Line
            type="monotone" dataKey="load" name="Load"
            stroke={CHART_COLORS.load} strokeWidth={1.5}
            strokeDasharray="4 3" dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
}
