import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Athlete
import AthleteDashboard from './pages/athlete/AthleteDashboard';
import AthleteWellness from './pages/athlete/AthleteWellness';
import AthleteInjuries from './pages/athlete/AthleteInjuries';
import AthleteTimeline from './pages/athlete/AthleteTimeline';
import AthleteReports from './pages/athlete/AthleteReports';
import AthleteAI from './pages/athlete/AthleteAISuggestions';

import CoachRoster from './pages/coach/CoachRoster';
import CoachInjuryWatch from './pages/coach/CoachInjuryWatch';
import CoachTrainingLoad from './pages/coach/CoachTrainingLoad';
import CoachAnalytics from './pages/coach/CoachAnalytics';
import CoachReports from './pages/coach/CoachReports';
import CoachAIInsights from './pages/coach/CoachAIInsights';

// Coach
import CoachDashboard from './pages/coach/CoachDashboard';

// Physio
import PhysioDashboard from './pages/physio/PhysioDashboard';

function RoleRouter() {
  const { role } = useAuth();

  switch (role) {
    case 'athlete':
      return <Navigate to="/athlete/dashboard" replace />;

    case 'coach':
      return <Navigate to="/coach/dashboard" replace />;

    case 'physiotherapist':
      return <Navigate to="/physio/dashboard" replace />;

    default:
      return (
        <div
          style={{
            padding: '2rem',
            color: '#f1f5f9',
            fontFamily: 'system-ui',
          }}
        >
          Unknown role: <strong>{role}</strong>
        </div>
      );
  }
}

function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/unauthorized"
        element={
          <div
            style={{
              padding: '2rem',
              color: '#f1f5f9',
              fontFamily: 'system-ui',
            }}
          >
            403 — You do not have permission to view this page.
          </div>
        }
      />

      {/* ================= ROOT ================= */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleRouter />
          </ProtectedRoute>
        }
      />

      {/* ================= ATHLETE ================= */}

      <Route
        path="/athlete/dashboard"
        element={
          <ProtectedRoute roles={['athlete']}>
            <AthleteDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/athlete/wellness"
        element={
          <ProtectedRoute roles={['athlete']}>
            <AthleteWellness />
          </ProtectedRoute>
        }
      />

      <Route
        path="/athlete/injuries"
        element={
          <ProtectedRoute roles={['athlete']}>
            <AthleteInjuries />
          </ProtectedRoute>
        }
      />

      <Route
        path="/athlete/timeline"
        element={
          <ProtectedRoute roles={['athlete']}>
            <AthleteTimeline />
          </ProtectedRoute>
        }
      />

      <Route
        path="/athlete/reports"
        element={
          <ProtectedRoute roles={['athlete']}>
            <AthleteReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/athlete/ai"
        element={
          <ProtectedRoute roles={['athlete']}>
            <AthleteAI />
          </ProtectedRoute>
        }
      />

      {/* ================= COACH ================= */}

      <Route
        path="/coach/dashboard"
        element={
          <ProtectedRoute roles={['coach']}>
            <CoachDashboard />
          </ProtectedRoute>
        }
      />

      <Route
  path="/coach/roster"
  element={
    <ProtectedRoute roles={['coach']}>
      <CoachRoster />
    </ProtectedRoute>
  }
/>

<Route
  path="/coach/injuries"
  element={
    <ProtectedRoute roles={['coach']}>
      <CoachInjuryWatch />
    </ProtectedRoute>
  }
/>

<Route
  path="/coach/load"
  element={
    <ProtectedRoute roles={['coach']}>
      <CoachTrainingLoad />
    </ProtectedRoute>
  }
/>

<Route
  path="/coach/analytics"
  element={
    <ProtectedRoute roles={['coach']}>
      <CoachAnalytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/coach/reports"
  element={
    <ProtectedRoute roles={['coach']}>
      <CoachReports />
    </ProtectedRoute>
  }
/>

<Route
  path="/coach/ai"
  element={
    <ProtectedRoute roles={['coach']}>
      <CoachAIInsights />
    </ProtectedRoute>
  }
/>

      {/* ================= PHYSIO ================= */}

      <Route
        path="/physio/dashboard"
        element={
          <ProtectedRoute roles={['physiotherapist']}>
            <PhysioDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </AuthProvider>
  );
}