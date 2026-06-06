import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'athlete',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const { data } = await api.post(
        '/auth/register',
        form
      );

      console.log('REGISTER RESPONSE:', data);

      navigate('/login', {
        state: {
          success:
            'Account created successfully. Please login.',
        },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-[450px] p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create Account</h1>
        <p className="text-sm text-apex-txt3">Athlete Recovery Platform</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400 mb-5" role="alert">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
              <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M8 5v3.5M8 11v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-apex-bg border border-apex-border rounded-lg p-3 text-sm text-white placeholder-apex-txt3 focus:border-apex-green focus:outline-none focus:ring-1 focus:ring-apex-green transition-all"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-apex-bg border border-apex-border rounded-lg p-3 text-sm text-white placeholder-apex-txt3 focus:border-apex-green focus:outline-none focus:ring-1 focus:ring-apex-green transition-all"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full bg-apex-bg border border-apex-border rounded-lg p-3 text-sm text-white placeholder-apex-txt3 focus:border-apex-green focus:outline-none focus:ring-1 focus:ring-apex-green transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-apex-txt2 uppercase tracking-wide mb-2">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-apex-bg border border-apex-border rounded-lg p-3 text-sm text-white focus:border-apex-green focus:outline-none focus:ring-1 focus:ring-apex-green transition-all appearance-none cursor-pointer"
          >
            <option value="athlete">Athlete</option>
            <option value="coach">Coach</option>
            <option value="physiotherapist">Physiotherapist</option>
          </select>
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <div className="mt-6 text-center text-sm text-apex-txt3">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-apex-green hover:text-emerald-400 transition-colors">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}