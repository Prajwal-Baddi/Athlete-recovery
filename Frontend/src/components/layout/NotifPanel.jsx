import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '@/context/AppContext'
import { NOTIFICATIONS } from '@/data/mockData'

const TYPE_COLOR = {
  alert:   '#ff5f6d',
  ai:      '#a78bfa',
  success: '#00d4aa',
  info:    '#4a9eff',
}

export default function NotifPanel() {
  const { notifOpen, setNotifOpen } = useAppContext()

  return (
    <AnimatePresence>
      {notifOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setNotifOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: -8,  scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 right-3 w-[300px] z-50 rounded-apex-lg overflow-hidden
              border border-apex-border2 shadow-apex-modal"
            style={{ background: '#0f1526' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-apex-border">
              <span className="font-display text-[13px] font-bold text-white">Notifications</span>
              <div className="flex items-center gap-2">
                <button
                  className="text-[11px] text-apex-green hover:underline"
                  onClick={() => setNotifOpen(false)}
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-apex-txt2 hover:text-apex-txt text-base leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Items */}
            {NOTIFICATIONS.map((n, i) => (
              <div
                key={n.id}
                className={`flex gap-3 items-start px-4 py-3 cursor-pointer transition-colors duration-150
                  hover:bg-apex-bg3 ${i < NOTIFICATIONS.length - 1 ? 'border-b border-apex-border' : ''}`}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${n.type === 'alert' ? 'dot-pulse' : ''}`}
                  style={{ background: TYPE_COLOR[n.type] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] leading-snug text-apex-txt">{n.msg}</div>
                  <div className="text-[10px] text-apex-txt3 mt-1">{n.time}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
