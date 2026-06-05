import { useAthletes } from '../../services/athleteService';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

const SEVERITY_COLOR = {
  minor: '#22c55e',
  moderate: '#f59e0b',
  severe: '#ef4444',
};

export default function PhysioDashboard() {
  const { user } = useAuth();
  const { data: athletes, isLoading, isError } = useAthletes();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  const totalAthletes = athletes?.length ?? 0;

  const allActiveInjuries =
    athletes?.flatMap((athlete) =>
      (athlete.injuries ?? [])
        .filter((injury) => injury.isActive)
        .map((injury) => ({
          ...injury,
          athleteName:
            athlete?.userId?.name ||
            athlete?.name ||
            'Unknown Athlete',
        }))
    ) ?? [];

  const injuryFreeAthletes =
    athletes?.filter(
      (athlete) =>
        !(athlete.injuries ?? []).some((injury) => injury.isActive)
    ).length ?? 0;

  return (
    <DashboardLayout>
    <div className="dash">
      <header className="dash-header">
        <h1>Physiotherapist Dashboard</h1>
        <p className="subtitle">
          Welcome, {user?.name || 'Physiotherapist'}
        </p>
      </header>

      <div className="cards">
        <StatCard
          label="Athletes Under Care"
          value={totalAthletes}
          color="#0ea5e9"
          icon="👥"
        />

        <StatCard
          label="Active Injuries"
          value={allActiveInjuries.length}
          color="#ef4444"
          icon="🩹"
        />

        <StatCard
          label="Injury Free"
          value={injuryFreeAthletes}
          color="#22c55e"
          icon="✅"
        />
      </div>

      <section className="section">
        <h2>Active Injuries</h2>

        {allActiveInjuries.length === 0 ? (
          <p className="empty">
            No active injuries recorded.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Athlete</th>
                <th>Body Part</th>
                <th>Severity</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
              {allActiveInjuries.map((injury) => {
                const color =
                  SEVERITY_COLOR[injury.severity] ||
                  '#94a3b8';

                return (
                  <tr key={injury._id}>
                    <td>{injury.athleteName}</td>

                    <td>
                      {injury.bodyPart || 'N/A'}
                    </td>

                    <td>
                      <span
                        className="badge"
                        style={{
                          background:
                            color + '22',
                          color,
                        }}
                      >
                        {injury.severity}
                      </span>
                    </td>

                    <td>
                      {injury.description ||
                        'No description'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="section">
        <h2>Athlete Overview</h2>

        <div className="athlete-grid">
          {athletes?.map((athlete) => {
            const name =
              athlete?.userId?.name ||
              athlete?.name ||
              'Unknown Athlete';

              const r =
  typeof athlete.readinessScore === 'object'
    ? athlete.readinessScore?.value ?? 0
    : athlete.readinessScore ?? 0;

            const readiness =
              athlete?.readinessScore?.value ?? 0;

            const activeInjuries =
              athlete?.injuries?.filter(
                (injury) => injury.isActive
              ) ?? [];

            return (
              <div
                key={athlete._id}
                className="athlete-card"
              >
                <div className="a-name">
                  {name}
                </div>

                <div className="a-meta">
                  {athlete?.sport || 'Unknown Sport'}
                  {' • '}
                  {athlete?.position || 'No Position'}
                </div>

                <div className="a-stats">
                  <span>
                    Readiness:{' '}
                    <strong
                      style={{
                        color:
                          readiness >= 80
                            ? '#22c55e'
                            : readiness >= 50
                            ? '#f59e0b'
                            : '#ef4444',
                      }}
                    >
                      {readiness}%
                    </strong>
                  </span>

                  <span>
                    Active Injuries:{' '}
                    <strong
                      style={{
                        color:
                          activeInjuries.length > 0
                            ? '#ef4444'
                            : '#22c55e',
                      }}
                    >
                      {activeInjuries.length}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
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
          background: color + '22',
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

function LoadingState() {
  return (
    <div className="dash-loading">
      Loading physiotherapist dashboard...
    </div>
  );
}

function ErrorState() {
  return (
    <div className="dash-error">
      Failed to load athletes.
    </div>
  );
}

function DashStyles() {
  return (
    <style>{`
      .dash {
        padding: 2rem;
        background: #0f172a;
        min-height: 100vh;
        color: white;
      }

      .dash-header {
        margin-bottom: 2rem;
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
      }

      .stat-label {
        color: #94a3b8;
        font-size: 0.75rem;
      }

      .section {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
      }

      .table th,
      .table td {
        padding: 0.75rem;
        border-bottom: 1px solid #334155;
      }

      .badge {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
      }

      .athlete-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill,minmax(250px,1fr));
        gap: 1rem;
      }

      .athlete-card {
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 1rem;
      }

      .a-name {
        font-weight: 600;
      }

      .a-meta {
        color: #94a3b8;
        margin-top: 0.25rem;
      }

      .a-stats {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    `}</style>
  );
}