import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Card, { CardHeader } from '@/components/ui/Card'
import ProgressBar          from '@/components/ui/ProgressBar'
import ChartTooltip         from '@/components/charts/ChartTooltip'
import { WELLNESS_METRICS, RECOVERY_TREND } from '@/data/mockData'
import { scoreColor } from '@/utils/helpers'

export default function WellnessPage() {
  return (
    <div className="p-4 space-y-4">

      {/* ── Metric grid ── */}
      <Card delay={0}>
        <CardHeader title="Wellness Metrics Overview" sub="Today's holistic snapshot" />
        <div className="grid grid-cols-3 gap-3">
          {WELLNESS_METRICS.map((m, i) => {
            const c    = scoreColor(m.value)
            const tUp  = m.trendUp
            return (
              <div
                key={m.metric}
                className="rounded-apex p-4 transition-all duration-150 hover:-translate-y-px"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-apex-txt2">{m.metric}</span>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: tUp ? '#00d4aa' : '#ff5f6d' }}
                  >
                    {m.trend}
                  </span>
                </div>
                <div
                  className="font-display text-[26px] font-bold mb-2 leading-none"
                  style={{ color: c }}
                >
                  {m.value}%
                </div>
                <ProgressBar value={m.value} color={c} height={5} />
              </div>
            )
          })}
        </div>
      </Card>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-2 gap-4">
        <Card delay={0.1}>
          <CardHeader title="Sleep Analysis" sub="Hours per night" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={RECOVERY_TREND} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[5, 10]} tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="sleep" name="Hours"
                fill="rgba(167,139,250,0.75)" radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card delay={0.15}>
          <CardHeader title="HRV Trend" sub="Heart Rate Variability (ms)" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={RECOVERY_TREND} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone" dataKey="hrv" name="HRV (ms)"
                stroke="#4a9eff" strokeWidth={2.5}
                dot={{ fill: '#4a9eff', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Score trend ── */}
      <Card delay={0.2}>
        <CardHeader title="Daily Recovery Score — 7 Days" />
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={RECOVERY_TREND} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00d4aa" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[50, 100]} tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone" dataKey="score" name="Score"
              stroke="#00d4aa" strokeWidth={2.5}
              dot={{ fill: '#00d4aa', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

    </div>
  )
}
