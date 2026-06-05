import { useAthletes } from '../../services/athleteService';
import { useAuth } from '../../context/AuthContext';

const READINESS_COLOR = (score) => {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

export default function CoachDashboard() {
  const { user } = useAuth();
  const { data: athletes, isLoading, isError } = useAthletes();

  if (isLoading) return <LoadingState />;
  if (isError)   return <ErrorState />;

  const totalAthletes = athletes?.length ?? 0;
  const avgReadiness  = totalAthletes
    ? Math.round(athletes.reduce((acc, a) => acc + (a.readinessScore ?? 0), 0) / totalAthletes)
    : 0;
  const totalInjured  = athletes?.filter((a) => (a.injuries ?? []).some((i) => i.status !== 'resolved')).length ?? 0;

  return (
    <div className="dash">
      <header className="dash-header">
        <h1>Coach Dashboard</h1>
        <p className="subtitle">Welcome, {user?.firstName || user?.name || 'Coach'}</p>
      </header>

      {/* Summary */}
      <div className="cards">
        <StatCard label="Total Athletes"    value={totalAthletes} color="#0ea5e9" icon="👥" />
        <StatCard label="Avg Readiness"     value={`${avgReadiness}%`} color={READINESS_COLOR(avgReadiness)} icon="⚡" />
        <StatCard label="Athletes Injured"  value={totalInjured} color="#ef4444" icon="🩹" />
        <StatCard label="Fully Ready"       value={athletes?.filter(a => (a.readinessScore ?? 0) >= 80).length ?? 0} color="#22c55e" icon="✅" />
      </div>

      {/* Athletes table */}
      <section className="section">
        <h2>Athlete Roster</h2>
        {totalAthletes === 0 ? (
          <p className="empty">No athletes found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sport</th>
                <th>Position</th>
                <th>Readiness</th>
                <th>Active Injuries</th>
                <th>Recovery Status</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map((athlete) => {
                const activeInj = (athlete.injuries ?? []).filter((i) => i.status !== 'resolved');
                const r = athlete.readinessScore ?? 0;
                const rc = READINESS_COLOR(r);
                const status = activeInj.length > 0 ? 'Injured' : r >= 80 ? 'Ready' : 'Recovering';
                const statusColor = activeInj.length > 0 ? '#ef4444' : r >= 80 ? '#22c55e' : '#f59e0b';
                const name = `${athlete.user?.firstName ?? athlete.firstName ?? ''} ${athlete.user?.lastName ?? athlete.lastName ?? ''}`.trim() || athlete._id;
                return (
                  <tr key={athlete._id}>
                    <td className="name-cell">{name}</td>
                    <td>{athlete.sport ?? '—'}</td>
                    <td>{athlete.position ?? '—'}</td>
                    <td>
                      <div className="readiness-bar-wrap">
                        <div className="readiness-bar" style={{ width: `${r}%`, background: rc }} />
                        <span style={{ color: rc }}>{r}%</span>
                      </div>
                    </td>
                    <td>{activeInj.length}</td>
                    <td><span className="badge" style={{ background: statusColor + '22', color: statusColor }}>{status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Coming Soon */}
      <section className="section">
        <h2>Advanced Analytics</h2>
        <div className="coming-soon-grid">
          <ComingSoon title="Recovery Plans"    icon="📅" />
          <ComingSoon title="Wellness Reports"  icon="📊" />
          <ComingSoon title="AI Insights"       icon="🤖" />
          <ComingSoon title="Team Reports"      icon="📄" />
        </div>
      </section>

      <DashStyles />
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + '22', color }}>{icon}</div>
      <div>
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function ComingSoon({ title, icon }) {
  return (
    <div className="coming-soon-card">
      <span className="cs-icon">{icon}</span>
      <span className="cs-title">{title}</span>
      <span className="cs-tag">Coming Soon</span>
    </div>
  );
}

function LoadingState() {
  return <div className="dash-loading"><div className="spinner" /><DashStyles /></div>;
}
function ErrorState() {
  return <div className="dash-error"><p>Failed to load athletes. Please refresh.</p><DashStyles /></div>;
}

function DashStyles() {
  return (
    <style>{`
      .dash { padding: 2rem; background: #0f172a; min-height: 100vh; font-family: 'Inter', system-ui, sans-serif; color: #f1f5f9; }
      .dash-header { margin-bottom: 2rem; }
      .dash-header h1 { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.25rem; letter-spacing: -0.025em; }
      .subtitle { color: #64748b; font-size: 0.9rem; margin: 0; }
      .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
      .stat-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.25rem; display: flex; gap: 1rem; align-items: center; }
      .stat-icon { font-size: 1.5rem; width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .stat-value { font-size: 1.5rem; font-weight: 700; line-height: 1; }
      .stat-label { font-size: 0.75rem; color: #64748b; margin-top: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .section { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
      .section h2 { font-size: 1rem; font-weight: 600; margin: 0 0 1rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
      .empty { color: #475569; font-size: 0.875rem; }
      .table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
      .table th { text-align: left; color: #64748b; padding: 0.5rem 0.75rem; border-bottom: 1px solid #334155; font-weight: 500; }
      .table td { padding: 0.75rem; border-bottom: 1px solid #1e293b; color: #cbd5e1; }
      .table tr:last-child td { border-bottom: none; }
      .name-cell { font-weight: 500; color: #f1f5f9; }
      .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
      .readiness-bar-wrap { display: flex; align-items: center; gap: 0.5rem; }
      .readiness-bar { height: 6px; border-radius: 999px; min-width: 4px; max-width: 80px; }
      .coming-soon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
      .coming-soon-card { background: #0f172a; border: 1px dashed #334155; border-radius: 10px; padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; opacity: 0.7; }
      .cs-icon { font-size: 1.75rem; }
      .cs-title { font-size: 0.875rem; font-weight: 600; color: #64748b; }
      .cs-tag { font-size: 0.7rem; background: #334155; color: #94a3b8; padding: 0.2rem 0.6rem; border-radius: 999px; }
      .dash-loading, .dash-error { min-height: 60vh; display: flex; align-items: center; justify-content: center; background: #0f172a; }
      .spinner { width: 32px; height: 32px; border: 3px solid #334155; border-top-color: #0ea5e9; border-radius: 50%; animation: spin 0.7s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  );
}
