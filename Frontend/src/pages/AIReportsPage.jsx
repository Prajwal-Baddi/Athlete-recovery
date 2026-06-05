import { useState }          from 'react'
import { motion }            from 'framer-motion'
import Card, { CardHeader } from '@/components/ui/Card'
import RingScore            from '@/components/ui/RingScore'
import Tag                  from '@/components/ui/Tag'
import { AI_INSIGHTS }      from '@/data/mockData'

export default function AIReportsPage() {
  const [generating, setGenerating] = useState(false)
  const [pulse,      setPulse]      = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setPulse(true)
      setTimeout(() => setPulse(false), 800)
    }, 2000)
  }

  return (
    <div className="p-4 space-y-4">

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg font-bold text-white">AI Intelligence Reports</h1>
          <p className="text-[12px] text-apex-txt2 mt-0.5">Powered by APEX AI Engine · Updated 5 min ago</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary flex items-center gap-2 px-5 py-2.5"
        >
          {generating
            ? <><span className="animate-spin inline-block text-base">⟳</span> Generating…</>
            : <>🤖 Generate New Report</>
          }
        </button>
      </div>

      {/* ── AI summary banner ── */}
      <motion.div
        animate={pulse ? { scale: [1, 1.01, 1] } : {}}
        transition={{ duration: 0.4 }}
        className="rounded-apex-lg px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)' }}
      >
        <span className="text-2xl flex-shrink-0">🤖</span>
        <div>
          <div className="text-[12px] font-semibold text-apex-green mb-0.5">APEX AI Summary</div>
          <div className="text-[12px] text-apex-txt2 leading-relaxed">
            Overall athlete status: <span className="text-apex-green font-semibold">Good</span>. 
            Recovery trending upward. One high-risk flag requires attention. 
            Next optimal training window detected for tomorrow 06:00–10:00.
          </div>
        </div>
      </motion.div>

      {/* ── Insight cards ── */}
      <div className="grid grid-cols-2 gap-4">
        {AI_INSIGHTS.map((ins, i) => (
          <motion.div
            key={ins.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="bg-apex-bg2 border border-apex-border rounded-apex-lg p-4
              transition-all duration-200 hover:shadow-apex-card"
            onMouseEnter={e => (e.currentTarget.style.borderColor = ins.color + '40')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 mr-3">
                <h3 className="font-display text-[13px] font-bold text-white mb-2">{ins.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {ins.tags.map(t => <Tag key={t} color={ins.color}>{t}</Tag>)}
                </div>
              </div>
              <RingScore score={ins.score} size={60} />
            </div>

            {/* Summary */}
            <div
              className="rounded-apex px-3 py-2.5 mb-3"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <p className="text-[12px] text-apex-txt2 leading-relaxed">{ins.summary}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="btn-secondary flex-1 text-[11px] py-1.5"
                style={{ color: ins.color, background: `${ins.color}12`, borderColor: `${ins.color}30` }}>
                View Details
              </button>
              <button className="btn-ghost flex-1 text-[11px] py-1.5">
                Share Report
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  )
}
