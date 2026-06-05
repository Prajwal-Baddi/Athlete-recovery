import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FIELDS = [
  { key: 'sleep',    label: 'Sleep Quality', default: 8 },
  { key: 'energy',   label: 'Energy Level',  default: 7 },
  { key: 'stress',   label: 'Stress',        default: 3 },
  { key: 'soreness', label: 'Soreness',      default: 4 },
]

export default function WellnessCheckin() {
  const [done,    setDone]    = useState(false)
  const [values,  setValues]  = useState(
    Object.fromEntries(FIELDS.map(f => [f.key, f.default]))
  )

  const handleSubmit = () => setDone(true)
  const handleReset  = () => { setDone(false); setValues(Object.fromEntries(FIELDS.map(f => [f.key, f.default]))) }

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-6 gap-3"
        >
          <div className="text-4xl">✅</div>
          <div className="font-display text-sm font-bold text-apex-green">Check-in Complete!</div>
          <div className="text-[11px] text-apex-txt2">AI is processing your wellness data…</div>
          <button onClick={handleReset} className="btn-ghost text-[11px] mt-1">Reset</button>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-2.5">
            {FIELDS.map(f => (
              <div
                key={f.key}
                className="bg-apex-bg3 rounded-apex px-3 py-2.5"
              >
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-apex-txt2">{f.label}</span>
                  <span className="text-apex-green font-semibold">{values[f.key]}/10</span>
                </div>
                <input
                  type="range" min={1} max={10} step={1}
                  value={values[f.key]}
                  onChange={e => setValues(v => ({ ...v, [f.key]: +e.target.value }))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} className="btn-primary w-full">
            Submit Check-in
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
