import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useExercises,
  useCreateExercise,
  useDeleteExercise,
  useCompleteExercise,
} from '../../../hooks/useRecovery';

export default function ExerciseManager({ caseId }) {
  const { data: exercises = [], isLoading } = useExercises(caseId);
  const createExerciseMutation = useCreateExercise();
  const deleteExerciseMutation = useDeleteExercise();
  const completeExerciseMutation = useCompleteExercise();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'strengthening',
    sets: 3,
    reps: 10,
    duration: 30,
    instructions: '',
  });

  const handleCreateExercise = async () => {
    if (!formData.name.trim()) {
      alert('Exercise name is required');
      return;
    }

    try {
      await createExerciseMutation.mutateAsync({
        caseId,
        data: formData,
      });
      setFormData({
        name: '',
        type: 'strengthening',
        sets: 3,
        reps: 10,
        duration: 30,
        instructions: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating exercise:', error);
    }
  };

  const handleCompleteExercise = async (exerciseId) => {
    const painScore = prompt('Pain during exercise (0-10):', '0');
    if (painScore !== null) {
      try {
        await completeExerciseMutation.mutateAsync({
          exerciseId,
          data: {
            painDuringExercise: parseInt(painScore),
          },
        });
      } catch (error) {
        console.error('Error completing exercise:', error);
      }
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await deleteExerciseMutation.mutateAsync(exerciseId);
      } catch (error) {
        console.error('Error deleting exercise:', error);
      }
    }
  };

  const completedCount = exercises.filter((e) => e.completed).length;
  const compliancePercent = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;

  const typeColors = {
    stretch: 'bg-blue-500/30 text-blue-400',
    strengthening: 'bg-red-500/30 text-red-400',
    cardio: 'bg-orange-500/30 text-orange-400',
    mobility: 'bg-purple-500/30 text-purple-400',
    balance: 'bg-green-500/30 text-green-400',
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
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
          <h3 className="text-xl font-bold text-white">Exercise Compliance</h3>
          <p className="text-white/70 text-sm">
            {completedCount} of {exercises.length} completed
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/50 hover:bg-blue-500/40 transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Exercise'}
        </motion.button>
      </div>

      {/* Compliance Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-sm">Compliance Rate</span>
          <span className="text-white font-semibold">{compliancePercent}%</span>
        </div>
        <div className="w-full h-2 bg-apex-bg3 border-apex-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${compliancePercent}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full transition-all ${
              compliancePercent >= 85
                ? 'bg-green-500'
                : compliancePercent >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          />
        </div>
      </div>

      {/* Create Exercise Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-white/5 border border-apex-border rounded-lg space-y-4"
          >
            <input
              type="text"
              placeholder="Exercise name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded text-white placeholder-apex-txt3 focus:outline-none focus:border-apex-green"
            />

            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded text-white focus:outline-none focus:border-apex-green"
            >
              <option value="stretch">Stretch</option>
              <option value="strengthening">Strengthening</option>
              <option value="cardio">Cardio</option>
              <option value="mobility">Mobility</option>
              <option value="balance">Balance</option>
            </select>

            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Sets"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) })}
                className="px-3 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded text-white placeholder-apex-txt3 focus:outline-none focus:border-apex-green"
              />
              <input
                type="number"
                placeholder="Reps"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) })}
                className="px-3 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded text-white placeholder-apex-txt3 focus:outline-none focus:border-apex-green"
              />
              <input
                type="number"
                placeholder="Duration (min)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="px-3 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded text-white placeholder-apex-txt3 focus:outline-none focus:border-apex-green"
              />
            </div>

            <textarea
              placeholder="Instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-3 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded text-white placeholder-apex-txt3 focus:outline-none focus:border-apex-green resize-none"
              rows="3"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateExercise}
              disabled={createExerciseMutation.isPending}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {createExerciseMutation.isPending ? 'Creating...' : 'Create Exercise'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercises List */}
      <div className="space-y-3">
        <AnimatePresence>
          {exercises.length === 0 ? (
            <motion.p className="text-white/50 text-center py-8">
              No exercises assigned yet
            </motion.p>
          ) : (
            exercises.map((exercise) => (
              <motion.div
                key={exercise._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-lg border transition-all ${
                  exercise.completed
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-white/5 border-apex-border hover:bg-apex-bg3 border-apex-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-semibold ${exercise.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                        {exercise.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold ${
                          typeColors[exercise.type] || 'bg-gray-500/30 text-gray-400'
                        }`}
                      >
                        {exercise.type}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-2">
                      {exercise.sets} sets × {exercise.reps} reps • {exercise.duration} min
                    </p>
                    {exercise.instructions && (
                      <p className="text-white/50 text-xs">{exercise.instructions}</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {!exercise.completed && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCompleteExercise(exercise._id)}
                        className="px-3 py-2 bg-green-500/30 text-green-400 rounded text-xs hover:bg-green-500/40 transition-colors"
                      >
                        ✓ Complete
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteExercise(exercise._id)}
                      className="px-3 py-2 bg-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/40 transition-colors"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

