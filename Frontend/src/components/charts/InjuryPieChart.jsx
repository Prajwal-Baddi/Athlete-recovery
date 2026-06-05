import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { INJURY_TYPES } from '@/data/mockData'

export default function InjuryPieChart({ data = INJURY_TYPES, height = 200 }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={80}
            paddingAngle={3} dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val, name) => [`${val}%`, name]}
            contentStyle={{
              background: '#131d32',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              fontSize: 12,
              color: '#e8edf7',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-1.5 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-[2px] flex-shrink-0" style={{ background: d.color }} />
            <span className="text-[11px] text-apex-txt2 flex-1">{d.name}</span>
            <span className="text-[11px] font-semibold" style={{ color: d.color }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </>
  )
}
