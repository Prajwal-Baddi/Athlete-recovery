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
    <div className="register-card">
      <div className="register-header">
        <h1>Create Account</h1>
        <p>Athlete Recovery Platform</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <div className="field">
          <label>Name</label>

          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        <div className="field">
          <label>Role</label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="athlete">
              Athlete
            </option>

            <option value="coach">
              Coach
            </option>

            <option value="physiotherapist">
              Physiotherapist
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="register-btn"
        >
          {loading
            ? 'Creating Account...'
            : 'Create Account'}
        </button>

        <div className="register-footer">
          Already have an account?{' '}
          <Link to="/login">
            Login
          </Link>
        </div>
      </form>

      <style>{`
        .register-card {
          background:#1e293b;
          border:1px solid #334155;
          border-radius:16px;
          padding:2rem;
          width:100%;
          max-width:450px;
        }

        .register-header {
          text-align:center;
          margin-bottom:2rem;
        }

        .register-header h1 {
          color:#f8fafc;
          margin-bottom:0.5rem;
        }

        .register-header p {
          color:#94a3b8;
        }

        .field {
          margin-bottom:1rem;
        }

        .field label {
          display:block;
          margin-bottom:0.4rem;
          color:#cbd5e1;
          font-size:0.85rem;
        }

        .field input,
        .field select {
          width:100%;
          background:#0f172a;
          border:1px solid #334155;
          color:#f8fafc;
          padding:0.75rem;
          border-radius:8px;
          outline:none;
        }

        .field input:focus,
        .field select:focus {
          border-color:#0ea5e9;
        }

        .register-btn {
          width:100%;
          padding:0.9rem;
          border:none;
          border-radius:8px;
          background:#10b981;
          color:#fff;
          font-weight:600;
          cursor:pointer;
          margin-top:0.5rem;
        }

        .register-btn:hover {
          background:#059669;
        }

        .register-btn:disabled {
          opacity:0.7;
        }

        .register-error {
          background:rgba(239,68,68,.1);
          border:1px solid rgba(239,68,68,.3);
          color:#fca5a5;
          padding:0.75rem;
          border-radius:8px;
          margin-bottom:1rem;
        }

        .register-footer {
          margin-top:1.5rem;
          text-align:center;
          color:#94a3b8;
        }

        .register-footer a {
          color:#0ea5e9;
          text-decoration:none;
        }
      `}</style>
    </div>
  );
}