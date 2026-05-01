import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const submit = async (form) => {
    try {
      setLoading(true);
      if (mode === 'signup') {
        await signup(form);
        toast.success('Account created');
      } else {
        await login(form);
        toast.success('Welcome back');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4">
      <h1 className="mb-5 text-3xl font-bold text-slate-100">{mode === 'login' ? 'Login' : 'Create account'}</h1>
      <AuthForm mode={mode} onSubmit={submit} loading={loading} />
      <button className="mt-3 text-sm text-cyan-300 hover:text-cyan-200" onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}>
        {mode === 'login' ? 'Need an account? Sign up' : 'Already have one? Login'}
      </button>
      <Link to="/" className="mt-5 text-xs text-slate-400 hover:text-slate-200">Back to landing</Link>
    </main>
  );
};

export default AuthPage;
