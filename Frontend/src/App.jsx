import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AthleteDashboard from './pages/athlete/AthleteDashboard';
import CoachDashboard from './pages/coach/CoachDashboard';
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
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Unauthorized */}
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

      {/* Root */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleRouter />
          </ProtectedRoute>
        }
      />

      {/* Athlete */}
      <Route
        path="/athlete/dashboard"
        element={
          <ProtectedRoute roles={['athlete']}>
            <AthleteDashboard />
          </ProtectedRoute>
        }
      />

      {/* Coach */}
      <Route
        path="/coach/dashboard"
        element={
          <ProtectedRoute roles={['coach']}>
            <CoachDashboard />
          </ProtectedRoute>
        }
      />

      {/* Physio */}
      <Route
        path="/physio/dashboard"
        element={
          <ProtectedRoute roles={['physiotherapist']}>
            <PhysioDashboard />
          </ProtectedRoute>
        }
      />

      <Route
  path="/register"
  element={<RegisterPage />}
/>

      {/* Catch all */}
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