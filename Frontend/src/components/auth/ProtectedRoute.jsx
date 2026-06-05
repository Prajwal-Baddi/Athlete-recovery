import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute
 *
 * Renders children only when authenticated.
 * While auth is loading, shows nothing (or a spinner).
 * Redirects unauthenticated users to /login, preserving the intended path.
 *
 * Optional `roles` prop: restrict to specific roles.
 * e.g. <ProtectedRoute roles={['coach']}>...</ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
      }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid rgba(14,165,233,0.2)',
          borderTop: '3px solid #0ea5e9',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role guard (optional)
  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
