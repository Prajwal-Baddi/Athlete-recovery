import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import Card, { CardHeader } from '@/components/ui/Card'
import StatCard             from '@/components/ui/StatCard'
import InjuryPieChart       from '@/components/charts/InjuryPieChart'
import ChartTooltip         from '@/components/charts/ChartTooltip'
import { MONTHLY_INJURY }   from '@/data/mockData'

const STATS = [
  { label: 'Total Injuries',   value: '7',    sub: 'Season to date',     color: '#ff5f6d', icon: '🦴', trend: ''    },
  { label: 'Resolved',         value: '4',    sub: 'Fully cleared',      color: '#00d4aa', icon: '✓',  trend: '+1'  },
  { label: 'Avg Recovery',     value: '9.4d', sub: 'Days to RTP',        color: '#4a9eff', icon: '📅', trend: '-0.8d' },
  { label: 'Recurrence Rate',  value: '12%',  sub: 'Below 15% target',   color: '#00d4aa', icon: '📊', trend: '-2%' },
]

export default function InjuryAnalyticsPage() {
  return (
    <div className="p-4 space-y-4">

      <div className="grid grid-cols-4 gap-3">
        {STATS.map((s, i) => <StatCard key={s.label} delay={i * 0.05} {...s} />)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card delay={0.1}>
          <CardHeader title="Injury by Type" sub="Season breakdown" />
          <InjuryPieChart height={200} />
        </Card>

        <Card delay={0.15}>
          <CardHeader title="Monthly Injury Trend" sub="New vs resolved" />
          <div className="flex gap-4 mb-3">
            {[['New', '#ff5f6d'], ['Resolved', '#00d4aa']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[11px] text-apex-txt2">
                <div className="w-2 h-2 rounded-[2px]" style={{ background: c }} />
                {l}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_INJURY} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="new"      name="New"      fill="rgba(255,95,109,0.75)"  radius={[4,4,0,0]} />
              <Bar dataKey="resolved" name="Resolved" fill="rgba(0,212,170,0.72)"   radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

    </div>
  )
}
