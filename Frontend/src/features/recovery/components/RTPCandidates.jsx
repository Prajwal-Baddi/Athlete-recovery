import { motion } from 'framer-motion';
import { useRTPCandidates, useApproveRTP } from '../../../hooks/useRecovery';

export default function RTPCandidates() {
  const { data: candidates = [], isLoading } = useRTPCandidates();
  const approveMutation = useApproveRTP();

  const handleApproveRTP = async (caseId) => {
    const notes = prompt('Enter RTP approval notes:');
    if (notes !== null) {
      try {
        await approveMutation.mutateAsync({
          id: caseId,
          notes: notes,
        });
      } catch (error) {
        console.error('Error approving RTP:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-apex-bg2 border border-apex-border rounded-lg animate-pulse" />
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
          <h3 className="text-xl font-bold text-white">Return To Play Candidates</h3>
          <p className="text-white/70 text-sm">{candidates.length} athletes eligible</p>
        </div>
        <span className="text-3xl">🎯</span>
      </div>

      {candidates.length === 0 ? (
        <p className="text-white/50 text-center py-8">No RTP candidates at this time</p>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => {
            const { eligibilityScore, rtpStatus } = candidate;
            const isReady = rtpStatus === 'Ready';
            const statusColor = isReady
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400';

            return (
              <motion.div
                key={candidate._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border transition-all ${
                  isReady ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-500/30 bg-yellow-500/5'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{candidate.athleteId?.name}</h4>
                    <p className="text-white/60 text-sm">{candidate.injury}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                    {rtpStatus}
                  </span>
                </div>

                {/* Eligibility Criteria */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`text-lg ${eligibilityScore.pain ? '✓' : '✗'}`}>
                      {eligibilityScore.pain ? '✓' : '✗'}
                    </span>
                    <span className={eligibilityScore.pain ? 'text-green-400' : 'text-red-400'}>
                      Pain Score ≤ 2 ({candidate.painScore}/10)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`text-lg ${eligibilityScore.compliance ? '✓' : '✗'}`}>
                      {eligibilityScore.compliance ? '✓' : '✗'}
                    </span>
                    <span className={eligibilityScore.compliance ? 'text-green-400' : 'text-red-400'}>
                      Compliance ≥ 85% ({candidate.compliancePercentage}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`text-lg ${eligibilityScore.readiness ? '✓' : '✗'}`}>
                      {eligibilityScore.readiness ? '✓' : '✗'}
                    </span>
                    <span className={eligibilityScore.readiness ? 'text-green-400' : 'text-red-400'}>
                      Readiness ≥ 80% ({candidate.readinessScore}%)
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                {isReady && !candidate.rtpApproved && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleApproveRTP(candidate._id)}
                    disabled={approveMutation.isPending}
                    className="w-full py-2 bg-green-500/30 text-green-400 rounded-lg border border-green-500/50 hover:bg-green-500/40 transition-colors disabled:opacity-50"
                  >
                    {approveMutation.isPending ? 'Approving...' : 'Approve RTP'}
                  </motion.button>
                )}

                {candidate.rtpApproved && (
                  <div className="py-2 text-center text-green-400 text-sm font-semibold">
                    ✓ RTP Approved
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

