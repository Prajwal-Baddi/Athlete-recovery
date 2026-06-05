import { motion }            from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card, { CardHeader } from '@/components/ui/Card'
import ChartTooltip         from '@/components/charts/ChartTooltip'
import { TIMELINE_EVENTS, STREAK_STATS, RECOVERY_TREND } from '@/data/mockData'

export default function TimelinePage() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">

        {/* ── Timeline events ── */}
        <Card delay={0} className="col-span-2">
          <CardHeader title="Recovery Timeline" sub="Activity log" />

          <div className="relative pl-6">
            {/* Vertical line */}
            <div
              className="absolute left-2 top-0 bottom-0 w-0.5"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            />

            {TIMELINE_EVENTS.map((ev, i) => (
              <motion.div
                key={i}
                className="relative mb-4 last:mb-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              >
                {/* Dot */}
                <div
                  className="absolute -left-[18px] top-1 w-3 h-3 rounded-full border-2"
                  style={{
                    background:   ev.color,
                    borderColor:  '#0a0e1a',
                    boxShadow:    `0 0 8px ${ev.color}60`,
                  }}
                />

                {/* Card */}
                <div
                  className="rounded-apex px-3 py-2.5 transition-all duration-150"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = ev.color + '40')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold text-white">{ev.title}</span>
                    <span className="text-[10px] text-apex-txt3">{ev.date}</span>
                  </div>
                  <p className="text-[11px] text-apex-txt2">{ev.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* ── Sidebar: streak stats + mini chart ── */}
        <div className="flex flex-col gap-4">
          <Card delay={0.1}>
            <CardHeader title="Streak Stats" />
            <div className="divide-y divide-apex-border">
              {STREAK_STATS.map(s => (
                <div key={s.label} className="flex items-center justify-between py-2.5">
                  <span className="text-[12px] text-apex-txt2">{s.label}</span>
                  <span
                    className="font-display text-[13px] font-bold"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card delay={0.15}>
            <CardHeader title="Weekly Scores" />
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={RECOVERY_TREND} margin={{ top: 4, right: 0, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="tlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00d4aa" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day"  tick={{ fill: '#8892a4', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fill: '#8892a4', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone" dataKey="score" name="Score"
                  stroke="#00d4aa" strokeWidth={2}
                  dot={{ fill: '#00d4aa', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

      </div>
    </div>
  )
}
