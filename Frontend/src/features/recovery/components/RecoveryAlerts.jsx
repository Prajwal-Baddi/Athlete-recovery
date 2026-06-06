import { motion, AnimatePresence } from 'framer-motion';
import { useRecoveryAlerts } from '../../../hooks/useRecovery';

const AlertIcon = {
  'Pain Increased': '📈',
  'Missed Exercises': '⏭️',
  'No Recovery Updates': '⏱️',
  'Recovery Delayed': '⏰',
};

export default function RecoveryAlerts() {
  const { data: alerts = [], isLoading } = useRecoveryAlerts();

  const priorityOrder = { Critical: 0, Warning: 1, Info: 2 };
  const sortedAlerts = [...alerts].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const getPriorityColor = (priority) => {
    const colors = {
      Critical: 'bg-red-500/20 border-red-500/30 text-red-400',
      Warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
      Info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    };
    return colors[priority] || colors.Info;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-apex-bg2 border border-apex-border rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-apex-bg2 border border-apex-border rounded-apex shadow-apex-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Alerts</h3>
          <p className="text-white/70 text-sm">{alerts.length} active alerts</p>
        </div>
        <span className="text-3xl">🔔</span>
      </div>

      {alerts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-green-400 text-lg font-semibold">✓ All Clear!</p>
          <p className="text-white/50 text-sm mt-2">No alerts at this time</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sortedAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-lg border flex items-start gap-4 ${getPriorityColor(
                  alert.priority
                )}`}
              >
                <div className="text-2xl flex-shrink-0 mt-1">
                  {AlertIcon[alert.type] || '⚠️'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold">{alert.type}</h4>
                    <span className="text-xs opacity-70 flex-shrink-0">
                      {new Date(alert.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-sm opacity-90">{alert.message}</p>

                  {alert.athleteName && (
                    <p className="text-xs opacity-70 mt-2">
                      Athlete: {alert.athleteName}
                    </p>
                  )}
                </div>

                {/* Priority Badge */}
                <div className="flex-shrink-0">
                  <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-apex-bg3 border-apex-border">
                    {alert.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Alert Stats */}
      {alerts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-apex-border grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-red-400 text-2xl font-bold">
              {alerts.filter((a) => a.priority === 'Critical').length}
            </p>
            <p className="text-white/50 text-xs">Critical</p>
          </div>
          <div>
            <p className="text-yellow-400 text-2xl font-bold">
              {alerts.filter((a) => a.priority === 'Warning').length}
            </p>
            <p className="text-white/50 text-xs">Warnings</p>
          </div>
          <div>
            <p className="text-blue-400 text-2xl font-bold">
              {alerts.filter((a) => a.priority === 'Info').length}
            </p>
            <p className="text-white/50 text-xs">Info</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

