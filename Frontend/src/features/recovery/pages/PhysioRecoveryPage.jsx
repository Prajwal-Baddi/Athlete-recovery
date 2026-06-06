import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import RecoveryStats from '../components/RecoveryStats';
import RecoveryCasesTable from '../components/RecoveryCasesTable';
import RecoveryAlerts from '../components/RecoveryAlerts';
import RTPCandidates from '../components/RTPCandidates';

export default function PhysioRecoveryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-white">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'cases', label: 'Recovery Cases', icon: '📋' },
    { id: 'rtp', label: 'RTP Evaluation', icon: '🎯' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Recovery Management</h1>
          <p className="text-white/70">
            Welcome, {user?.name}. Manage athlete recovery cases and track progress.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                  : 'bg-apex-bg3 border-apex-border text-white/70 border border-apex-border hover:bg-white/20'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <RecoveryStats />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Large alerts section */}
                <div className="lg:col-span-2">
                  <RecoveryAlerts />
                </div>

                {/* RTP Candidates */}
                <div className="lg:col-span-1">
                  <RTPCandidates />
                </div>
              </div>

              {/* Recent Recovery Cases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-apex-bg2 border border-apex-border rounded-apex shadow-apex-card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">Recent Recovery Cases</h3>
                <RecoveryCasesTable />
              </motion.div>
            </>
          )}

          {activeTab === 'cases' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-apex-bg2 border border-apex-border rounded-apex shadow-apex-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Recovery Cases Management</h3>
              <RecoveryCasesTable />
            </motion.div>
          )}

          {activeTab === 'rtp' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-apex-bg2 border border-apex-green rounded-apex shadow-apex-card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">Return To Play Evaluation</h3>
                <p className="text-white/70">
                  Review athletes who meet RTP criteria and approve their return to play.
                </p>
              </motion.div>
              <RTPCandidates />
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <RecoveryAlerts />
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

