import { motion } from 'framer-motion';
import { useUpdateRecoveryPhase } from '../../../hooks/useRecovery';

const PHASES = [
  'Acute Care',
  'Mobility',
  'Strength',
  'Functional Training',
  'Return To Play',
];

const PhaseIcon = ({ phase }) => {
  const icons = {
    'Acute Care': '🏥',
    'Mobility': '🔄',
    'Strength': '💪',
    'Functional Training': '🎯',
    'Return To Play': '🏃',
  };
  return icons[phase] || '📍';
};

export default function RecoveryPhaseTracker({ recoveryCase, onPhaseUpdate }) {
  const updatePhaseMutation = useUpdateRecoveryPhase();
  const currentPhaseIndex = PHASES.indexOf(recoveryCase.recoveryPhase);

  const handlePhaseUpdate = async (newPhase) => {
    const notes = prompt('Add notes for this phase change:');
    if (notes !== null) {
      try {
        await updatePhaseMutation.mutateAsync({
          id: recoveryCase._id,
          phase: newPhase,
          notes: notes,
        });
        onPhaseUpdate?.();
      } catch (error) {
        console.error('Error updating phase:', error);
      }
    }
  };

  return (
    <div className="bg-apex-bg2 border border-apex-border rounded-apex shadow-apex-card p-8">
      <h3 className="text-xl font-bold text-white mb-8">Recovery Phases</h3>

      <div className="flex items-center justify-between">
        {PHASES.map((phase, index) => {
          const isActive = index === currentPhaseIndex;
          const isCompleted = index < currentPhaseIndex;

          return (
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center flex-1"
            >
              {/* Phase Button */}
              <motion.button
                onClick={() => isActive && handlePhaseUpdate(phase)}
                whileHover={isActive ? { scale: 1.1 } : {}}
                whileTap={isActive ? { scale: 0.95 } : {}}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3
                  transition-all duration-300 font-bold text-lg
                  ${isCompleted ? 'bg-green-500/30 text-green-400 ring-2 ring-green-500' : ''}
                  ${isActive ? 'bg-blue-500/30 text-blue-400 ring-2 ring-blue-500 shadow-lg shadow-blue-500/50' : ''}
                  ${!isActive && !isCompleted ? 'bg-apex-bg3 border-apex-border text-white/50' : ''}
                `}
                disabled={!isActive}
              >
                {isActive ? (
                  <PhaseIcon phase={phase} />
                ) : isCompleted ? (
                  '✓'
                ) : (
                  index + 1
                )}
              </motion.button>

              {/* Phase Name */}
              <p
                className={`
                  text-xs text-center font-semibold max-w-20
                  ${isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-white/50'}
                `}
              >
                {phase}
              </p>

              {/* Connector Line */}
              {index < PHASES.length - 1 && (
                <div className="absolute left-1/2 top-8 -translate-x-1/2 w-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className={`
                      h-1 transition-all
                      ${isCompleted ? 'bg-green-500' : 'bg-apex-bg3 border-apex-border'}
                    `}
                    style={{ marginTop: '-32px', marginLeft: '68px' }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Phase History */}
      {recoveryCase.phaseHistory?.length > 0 && (
        <div className="mt-8 pt-8 border-t border-apex-border">
          <h4 className="text-white/70 text-sm font-semibold mb-4">Phase History</h4>
          <div className="space-y-3">
            {[...recoveryCase.phaseHistory].reverse().map((history, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 px-4 py-3 bg-white/5 rounded-lg"
              >
                <PhaseIcon phase={history.phase} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{history.phase}</p>
                  <p className="text-white/50 text-xs">
                    {new Date(history.startDate).toLocaleDateString()}
                    {history.endDate && ` - ${new Date(history.endDate).toLocaleDateString()}`}
                  </p>
                  {history.notes && <p className="text-white/70 text-xs mt-1">{history.notes}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

