import { useMyAthleteProfile } from '../../services/athleteService';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

const READINESS_COLOR = (score) => {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

export default function AthleteDashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading, isError } = useMyAthleteProfile();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  const readiness =
    profile?.readinessScore?.value ?? 0;

  const injuries =
    profile?.injuries ?? [];

  const activeInjuries =
    injuries.filter((inj) => inj.isActive);

  const assignedPhysio =
    profile?.assignedPhysio;

  const assignedCoach =
    profile?.assignedCoach;

  return (
    <DashboardLayout>
      <div className="dash">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h1>
              Welcome back, {user?.name || 'Athlete'}
            </h1>

            <p className="subtitle">
              {profile?.sport || 'Unknown Sport'}
              {' • '}
              {profile?.team || 'No Team'}
              {' • '}
              {profile?.position || 'No Position'}
            </p>
          </div>
        </header>

        {/* Stats */}
        <div className="cards">
          <StatCard
            label="Readiness Score"
            value={`${readiness}%`}
            color={READINESS_COLOR(readiness)}
            icon="⚡"
          />

          <StatCard
            label="Active Injuries"
            value={activeInjuries.length}
            color="#f59e0b"
            icon="🩹"
          />

          <StatCard
            label="Total Injuries"
            value={injuries.length}
            color="#94a3b8"
            icon="📋"
          />

          <StatCard
            label="Assigned Physio"
            value={
              assignedPhysio?.name ||
              'Unassigned'
            }
            color={
              assignedPhysio
                ? '#22c55e'
                : '#64748b'
            }
            icon="🏥"
          />
        </div>

        {/* Injury Log */}
        <section className="section">
          <h2>Injury Log</h2>

          {injuries.length === 0 ? (
            <p className="empty">
              No injuries recorded.
            </p>
          ) : (
            <table className="injury-table">
              <thead>
                <tr>
                  <th>Body Part</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>
                {injuries.map((injury) => (
                  <tr key={injury._id}>
                    <td>{injury.bodyPart}</td>

                    <td>{injury.severity}</td>

                    <td>
                      <span
                        className="badge"
                        style={{
                          background: injury.isActive
                            ? '#f59e0b22'
                            : '#22c55e22',

                          color: injury.isActive
                            ? '#f59e0b'
                            : '#22c55e',
                        }}
                      >
                        {injury.isActive
                          ? 'Active'
                          : 'Resolved'}
                      </span>
                    </td>

                    <td>
                      {injury.dateOccurred
                        ? new Date(
                            injury.dateOccurred
                          ).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="notes-cell">
                      {injury.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Care Team */}
        <section className="section">
          <h2>Care Team</h2>

          <div className="care-team">
            <CareCard
              role="Coach"
              person={assignedCoach}
            />

            <CareCard
              role="Physiotherapist"
              person={assignedPhysio}
            />
          </div>
        </section>

        {/* Future Modules */}
        <section className="section">
          <h2>Analytics</h2>

          <div className="coming-soon-grid">
            <ComingSoon
              title="Recovery Plans"
              icon="📅"
            />

            <ComingSoon
              title="Wellness Logs"
              icon="📊"
            />

            <ComingSoon
              title="AI Insights"
              icon="🤖"
            />

            <ComingSoon
              title="Reports"
              icon="📄"
            />
          </div>
        </section>

        <DashStyles />
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  label,
  value,
  color,
  icon,
}) {
  return (
    <div className="stat-card">
      <div
        className="stat-icon"
        style={{
          background: `${color}22`,
          color,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          className="stat-value"
          style={{ color }}
        >
          {value}
        </div>

        <div className="stat-label">
          {label}
        </div>
      </div>
    </div>
  );
}

function CareCard({ role, person }) {
  const name =
    person?.name || 'Unassigned';

  return (
    <div className="care-card">
      <div className="care-role">
        {role}
      </div>

      <div className="care-name">
        {name}
      </div>

      {person?.email && (
        <div className="care-email">
          {person.email}
        </div>
      )}
    </div>
  );
}

function ComingSoon({
  title,
  icon,
}) {
  return (
    <div className="coming-soon-card">
      <span className="cs-icon">
        {icon}
      </span>

      <span className="cs-title">
        {title}
      </span>

      <span className="cs-tag">
        Coming Soon
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="dash-loading">
      <div className="spinner" />
      <DashStyles />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="dash-error">
      <p>
        Failed to load athlete profile.
        Please refresh.
      </p>

      <DashStyles />
    </div>
  );
}

function DashStyles() {
  return (
    <style>{`
      .dash {
        padding: 24px;
        color: #f4f4f5;
      }

      .dash-header {
        margin-bottom: 24px;
      }

      .dash-header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.025em;
      }

      .subtitle {
        margin-top: 8px;
        color: #71717a;
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .stat-card {
        background: #121214;
        border: 1px solid #27272a;
        border-radius: 12px;
        padding: 18px;
        display: flex;
        gap: 14px;
        align-items: center;
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .stat-value {
        font-size: 26px;
        font-weight: 700;
      }

      .stat-label {
        color: #71717a;
        font-size: 11px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.05em;
      }

      .section {
        background: #121214;
        border: 1px solid #27272a;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .section h2 {
        margin-top: 0;
        margin-bottom: 16px;
        color: #a1a1aa;
        font-size: 16px;
        font-weight: 600;
      }

      .empty {
        color: #71717a;
      }

      .injury-table {
        width: 100%;
        border-collapse: collapse;
      }

      .injury-table th {
        text-align: left;
        padding: 12px;
        border-bottom: 1px solid #27272a;
        color: #71717a;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .injury-table td {
        padding: 12px;
        border-bottom: 1px solid #27272a;
      }

      .badge {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
      }

      .notes-cell {
        max-width: 250px;
        color: #a1a1aa;
      }

      .care-team {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
        gap: 16px;
      }

      .care-card {
        background: #0a0a0b;
        border: 1px solid #27272a;
        border-radius: 10px;
        padding: 16px;
      }

      .care-role {
        color: #71717a;
        font-size: 11px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.05em;
      }

      .care-name {
        margin-top: 6px;
        font-size: 16px;
        font-weight: 600;
      }

      .care-email {
        margin-top: 6px;
        color: #71717a;
        font-size: 13px;
      }

      .coming-soon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
        gap: 16px;
      }

      .coming-soon-card {
        background: #0a0a0b;
        border: 1px dashed #27272a;
        border-radius: 10px;
        padding: 18px;
        text-align: center;
      }

      .cs-icon {
        display: block;
        font-size: 28px;
        margin-bottom: 8px;
      }

      .cs-title {
        display: block;
        font-weight: 600;
      }

      .cs-tag {
        display: inline-block;
        margin-top: 8px;
        padding: 4px 10px;
        border-radius: 999px;
        background: #27272a;
        color: #a1a1aa;
        font-size: 11px;
        font-weight: 500;
      }

      .dash-loading,
      .dash-error {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #27272a;
        border-top-color: #10b981;
        border-radius: 50%;
        animation: spin .8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  );
}