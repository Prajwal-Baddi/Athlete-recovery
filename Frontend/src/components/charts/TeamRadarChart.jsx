import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer,
} from 'recharts'
import { RADAR_DATA } from '@/data/mockData'

export default function TeamRadarChart({ data = RADAR_DATA, height = 220 }) {
  return (
    <>
      <div className="flex gap-4 mb-2">
        {[['Your Team', '#00d4aa'], ['League Avg', '#4a9eff']].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1.5 text-[11px] text-apex-txt2">
            <div className="w-2 h-2 rounded-[2px]" style={{ background: c }} />
            {l}
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} margin={{ top: 4, right: 10, left: 10, bottom: 4 }}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#8892a4', fontSize: 11 }}
          />
          <PolarRadiusAxis
            tick={{ fill: '#4a5568', fontSize: 9 }}
            domain={[0, 100]}
            tickCount={4}
            axisLine={false}
          />
          <Radar
            name="Team" dataKey="team"
            stroke="#00d4aa" fill="#00d4aa" fillOpacity={0.12} strokeWidth={2}
          />
          <Radar
            name="League" dataKey="league"
            stroke="#4a9eff" fill="#4a9eff" fillOpacity={0.08} strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        </RadarChart>
      </ResponsiveContainer>
    </>
  )
}
