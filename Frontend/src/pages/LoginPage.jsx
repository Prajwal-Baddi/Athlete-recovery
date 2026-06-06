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
    <div className="min-h-screen flex items-center justify-center bg-apex-bg p-4 font-sans">
      <div className="card w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#10b981" fillOpacity="0.15" />
              <path d="M18 8C12.477 8 8 12.477 8 18s4.477 10 10 10 10-4.477 10-10S23.523 8 18 8zm0 4a6 6 0 110 12A6 6 0 0118 12z" fill="#10b981" />
              <circle cx="18" cy="18" r="3" fill="#10b981" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">APEX Recovery OS</h1>
          <p className="text-sm text-apex-txt3">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400 mb-5" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M8 5v3.5M8 11v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="email" className="block text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full bg-apex-bg border border-apex-border rounded-lg p-3 text-sm text-white placeholder-apex-txt3 focus:border-apex-green focus:outline-none focus:ring-1 focus:ring-apex-green transition-all disabled:opacity-60"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full bg-apex-bg border border-apex-border rounded-lg p-3 text-sm text-white placeholder-apex-txt3 focus:border-apex-green focus:outline-none focus:ring-1 focus:ring-apex-green transition-all disabled:opacity-60"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-apex-green hover:bg-emerald-600 text-white font-semibold rounded-lg p-3 text-sm transition-colors disabled:opacity-70 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-sm font-medium text-apex-green hover:text-emerald-400 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
