import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <RegisterForm />
    </div>
  );
}