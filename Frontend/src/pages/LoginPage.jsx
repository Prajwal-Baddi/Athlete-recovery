import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ROLE_ROUTES = {
  athlete: '/athlete/dashboard',
  coach: '/coach/dashboard',
  physiotherapist: '/physio/dashboard',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      const role = user?.role;
      const destination = from || ROLE_ROUTES[role] || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#0ea5e9" fillOpacity="0.15" />
              <path d="M18 8C12.477 8 8 12.477 8 18s4.477 10 10 10 10-4.477 10-10S23.523 8 18 8zm0 4a6 6 0 110 12A6 6 0 0118 12z" fill="#0ea5e9" />
              <circle cx="18" cy="18" r="3" fill="#0ea5e9" />
            </svg>
          </div>
          <h1>Athlete Recovery</h1>
          <p>Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="login-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M8 5v3.5M8 11v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <Link
  to="/register"
  className="text-emerald-400"
>
  Create Account
</Link>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
          padding: 1rem;
        }
        .login-card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-logo {
          display: inline-flex;
          margin-bottom: 1rem;
        }
        .login-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          margin: 0 0 0.25rem;
          letter-spacing: -0.025em;
        }
        .login-header p {
          color: #94a3b8;
          font-size: 0.875rem;
          margin: 0;
        }
        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #fca5a5;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
        }
        .field {
          margin-bottom: 1.25rem;
        }
        .field label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }
        .field input {
          width: 100%;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #f1f5f9;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .field input::placeholder { color: #475569; }
        .field input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
        }
        .field input:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-btn {
          width: 100%;
          margin-top: 0.5rem;
          background: #0ea5e9;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.875rem;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background 0.15s, opacity 0.15s;
        }
        .login-btn:hover:not(:disabled) { background: #0284c7; }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
