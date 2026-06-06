import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoveryCases, useUpdateRecoveryCase } from '../../../hooks/useRecovery';

export default function RecoveryCasesTable() {
  const { data: cases = [], isLoading } = useRecoveryCases();
  const updateMutation = useUpdateRecoveryCase();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ phase: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.injury?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.athleteId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = !filters.phase || c.recoveryPhase === filters.phase;
    const matchesStatus = !filters.status || c.recoveryStatus === filters.status;
    return matchesSearch && matchesPhase && matchesStatus;
  });

  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);

  const getPhaseColor = (phase) => {
    const colors = {
      'Acute Care': 'bg-red-500/20 text-red-400',
      'Mobility': 'bg-orange-500/20 text-orange-400',
      'Strength': 'bg-yellow-500/20 text-yellow-400',
      'Functional Training': 'bg-blue-500/20 text-blue-400',
      'Return To Play': 'bg-green-500/20 text-green-400',
    };
    return colors[phase] || 'bg-gray-500/20 text-gray-400';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Not Started': 'bg-gray-500/20 text-gray-400',
      'In Progress': 'bg-blue-500/20 text-blue-400',
      'On Hold': 'bg-yellow-500/20 text-yellow-400',
      'Completed': 'bg-green-500/20 text-green-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getPainColor = (score) => {
    if (score <= 2) return 'text-green-400';
    if (score <= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getReadinessColor = (score) => {
    if (score >= 80) return 'bg-green-500/30 text-green-400';
    if (score >= 50) return 'bg-yellow-500/30 text-yellow-400';
    return 'bg-red-500/30 text-red-400';
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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search athlete or injury..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-4 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded-lg text-white placeholder-apex-txt3 focus:outline-none focus:border-apex-green"
        />
        
        <select
          value={filters.phase}
          onChange={(e) => {
            setFilters({ ...filters, phase: e.target.value });
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded-lg text-white focus:outline-none focus:border-apex-green"
        >
          <option value="">All Phases</option>
          <option value="Acute Care">Acute Care</option>
          <option value="Mobility">Mobility</option>
          <option value="Strength">Strength</option>
          <option value="Functional Training">Functional Training</option>
          <option value="Return To Play">Return To Play</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded-lg text-white focus:outline-none focus:border-apex-green"
        >
          <option value="">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-apex-border">
              <th className="text-left px-4 py-3 text-white/70 text-sm">Athlete</th>
              <th className="text-left px-4 py-3 text-white/70 text-sm">Injury</th>
              <th className="text-left px-4 py-3 text-white/70 text-sm">Phase</th>
              <th className="text-left px-4 py-3 text-white/70 text-sm">Pain</th>
              <th className="text-left px-4 py-3 text-white/70 text-sm">Status</th>
              <th className="text-left px-4 py-3 text-white/70 text-sm">Readiness</th>
              <th className="text-left px-4 py-3 text-white/70 text-sm">Updated</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedCases.map((recoveryCase, index) => (
                <motion.tr
                  key={recoveryCase._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-apex-border hover:bg-apex-bg3 transition-colors"
                >
                  <td className="px-4 py-4 text-white font-medium">
                    {recoveryCase.athleteId?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-4 text-white/80">{recoveryCase.injury}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPhaseColor(recoveryCase.recoveryPhase)}`}>
                      {recoveryCase.recoveryPhase}
                    </span>
                  </td>
                  <td className={`px-4 py-4 font-semibold ${getPainColor(recoveryCase.painScore)}`}>
                    {recoveryCase.painScore}/10
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(recoveryCase.recoveryStatus)}`}>
                      {recoveryCase.recoveryStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getReadinessColor(recoveryCase.readinessScore)}`}>
                      {recoveryCase.readinessScore}%
                    </div>
                  </td>
                  <td className="px-4 py-4 text-white/60 text-sm">
                    {new Date(recoveryCase.updatedAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded-lg text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white/70">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-apex-bg3 border-apex-border border border-apex-border rounded-lg text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50">No recovery cases found</p>
        </div>
      )}
    </div>
  );
}

