import { motion } from 'framer-motion';

const eventIcons = {
  'Injury Created': '🔴',
  'Rehab Started': '⚡',
  'Pain Reduced': '💚',
  'Phase Updated': '📈',
  'RTP Approved': '🎉',
  'Recovery Delayed': '⚠️',
  'Milestone Achieved': '🏆',
};

export default function RecoveryTimeline({ phaseHistory = [] }) {
  const timelineEvents = phaseHistory.map((phase, idx) => ({
    id: idx,
    date: phase.startDate,
    title: `${phase.phase} Started`,
    description: phase.notes || `Recovery phase: ${phase.phase}`,
    type: 'Phase Updated',
  }));

  if (timelineEvents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-apex-bg2 border border-apex-border rounded-apex shadow-apex-card p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Recovery Timeline</h3>
        <p className="text-white/50 text-center py-8">No timeline events yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-apex-bg2 border border-apex-border rounded-apex shadow-apex-card p-6"
    >
      <h3 className="text-xl font-bold text-white mb-6">Recovery Timeline</h3>

      <div className="relative space-y-8">
        {/* Timeline Line */}
        <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />

        {/* Timeline Events */}
        {timelineEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-20"
          >
            {/* Event Dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="absolute left-0 w-12 h-12 rounded-full bg-apex-bg3 border-apex-border border-2 border-blue-500 flex items-center justify-center text-xl -translate-x-1.5"
            >
              {eventIcons[event.type] || '📍'}
            </motion.div>

            {/* Event Content */}
            <div className="bg-white/5 border border-apex-border rounded-lg p-4 hover:bg-apex-bg3 border-apex-border transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{event.title}</h4>
                <span className="text-xs text-white/50">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-white/70 text-sm">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

