import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import ChartTooltip from './ChartTooltip'
import { WEEKLY_LOAD } from '@/data/mockData'

export default function LoadChart({ data = WEEKLY_LOAD, height = 150 }) {
  return (
    <>
      <div className="flex gap-4 mb-3">
        {[['Load', '#4a9eff'], ['Recovery', '#00d4aa']].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1.5 text-[11px] text-apex-txt2">
            <div className="w-2 h-2 rounded-[2px]" style={{ background: c }} />
            {l}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-[11px] text-apex-txt2">
          <div className="w-4 h-0.5 rounded" style={{ background: '#ffb347' }} />
          Optimal
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="week" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="load"     name="Load"     fill="rgba(74,158,255,0.75)"  radius={[4,4,0,0]} />
          <Bar dataKey="recovery" name="Recovery" fill="rgba(0,212,170,0.7)"   radius={[4,4,0,0]} />
          <Line dataKey="optimal" name="Optimal"  stroke="#ffb347" strokeWidth={2}
            strokeDasharray="4 3" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}
