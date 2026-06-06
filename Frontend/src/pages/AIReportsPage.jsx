import { useState }          from 'react'
import { motion }            from 'framer-motion'
import Card, { CardHeader } from '@/components/ui/Card'
import RingScore            from '@/components/ui/RingScore'
import Tag                  from '@/components/ui/Tag'
import { TEAM_ATHLETES } from '@/data/mockData'
import { useAIInsights } from '@/services/insightService'

export default function AIReportsPage() {
  const [generating, setGenerating] = useState(false)
  const [pulse,      setPulse]      = useState(false)
  const [selectedAthlete, setSelectedAthlete] = useState('team')
  const [activeModal, setActiveModal] = useState(null)
  const [toast, setToast] = useState(null)

  // Fetch real AI insights from backend
  const { data: insightsData = [], isLoading, isError } = useAIInsights();
  
  // Local state for generated insights if we want to simulate generation 
  // before the backend endpoint is fully ready to generate them live
  const [localInsights, setLocalInsights] = useState(null);

  const displayInsights = localInsights || insightsData;

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleShare = (title) => {
    navigator.clipboard?.writeText(`Check out this AI Insight: ${title}`)
    showToast(`Shared "${title}" report link to clipboard!`)
  }

  const downloadCSV = () => {
    const headers = ['ID', 'Title', 'Score', 'Summary', 'Tags'];
    const rows = displayInsights.map(ins => [
      ins.id || ins._id,
      `"${ins.title}"`,
      ins.score,
      `"${ins.summary?.replace(/"/g, '""')}"`,
      `"${(ins.tags || []).join(', ')}"`
    ]);
    const csvString = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AI_Insights_${selectedAthlete}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("CSV downloaded successfully!");
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      // Simulate generating new insights with slightly randomized scores based on current data
      setLocalInsights(
        displayInsights.map((ins) => ({
          ...ins,
          score: Math.min(100, Math.max(0, (ins.score || 80) + Math.floor(Math.random() * 20 - 10)))
        }))
      )
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
          <p className="text-[12px] text-apex-txt2 mt-0.5">Powered by APEX AI Engine · Real-time Sync</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="bg-apex-bg3 border border-apex-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="team">Whole Team Overview</option>
            {/* Ideally replace TEAM_ATHLETES with useAthletes hook later */}
            {TEAM_ATHLETES.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <button
            onClick={downloadCSV}
            className="btn-secondary flex items-center gap-2 px-4 py-2.5"
          >
            ↓ Export CSV
          </button>

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
            Connected to Live DB. Analyzing live readiness streams.
          </div>
        </div>
      </motion.div>

      {/* ── Insight cards ── */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-apex-txt2 gap-2">
          <span className="animate-spin text-apex-green">⟳</span>
          Loading AI Insights from database...
        </div>
      ) : isError ? (
        <div className="py-12 text-center text-red-400">
          Failed to load AI Insights. Please ensure the backend server is running.
        </div>
      ) : displayInsights.length === 0 ? (
        <div className="py-12 text-center text-apex-txt3">
          No AI Insights found in the database.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {displayInsights.map((ins, i) => (
            <motion.div
              key={ins.id || ins._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="bg-apex-bg2 border border-apex-border rounded-apex-lg p-4
                transition-all duration-200 hover:shadow-apex-card"
              onMouseEnter={e => (e.currentTarget.style.borderColor = (ins.color || '#00d4aa') + '40')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 mr-3">
                  <h3 className="font-display text-[13px] font-bold text-white mb-2">{ins.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(ins.tags || []).map(t => <Tag key={t} color={ins.color || '#00d4aa'}>{t}</Tag>)}
                  </div>
                </div>
                <RingScore score={ins.score || 0} size={60} />
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
                <button 
                  onClick={() => setActiveModal(ins)}
                  className="btn-secondary flex-1 text-[11px] py-1.5"
                  style={{ color: ins.color || '#00d4aa', background: `${ins.color || '#00d4aa'}12`, borderColor: `${ins.color || '#00d4aa'}30` }}>
                  View Details
                </button>
                <button 
                  onClick={() => handleShare(ins.title)}
                  className="btn-ghost flex-1 text-[11px] py-1.5">
                  Share Report
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Modals and Toasts ── */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-4 right-4 bg-apex-bg3 border border-apex-border text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2"
        >
          <span className="text-apex-green">✓</span> {toast}
        </motion.div>
      )}

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-apex-bg2 border border-apex-border rounded-xl p-6 max-w-lg w-full shadow-2xl relative"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-apex-txt2 hover:text-white"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <RingScore score={activeModal.score || 0} size={70} />
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{activeModal.title}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {(activeModal.tags || []).map(t => <Tag key={t} color={activeModal.color || '#00d4aa'}>{t}</Tag>)}
                </div>
              </div>
            </div>

            <div className="bg-apex-bg3 rounded-lg p-4 mb-6 border border-apex-border">
              <h3 className="text-sm font-semibold text-white mb-2">AI Detailed Analysis</h3>
              <p className="text-sm text-apex-txt2 leading-relaxed">
                {activeModal.summary}
                <br/><br/>
                Based on continuous live monitoring from the backend API, the APEX AI has flagged this specific metric.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => handleShare(activeModal.title)}
                className="btn-ghost px-4 py-2 text-sm"
              >
                Share
              </button>
              <button 
                onClick={() => setActiveModal(null)}
                className="btn-primary px-6 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  )
}
