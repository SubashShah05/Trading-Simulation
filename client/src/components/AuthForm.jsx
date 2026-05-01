import { useMemo, useState } from 'react';

const AuthForm = ({ mode = 'login', onSubmit, loading }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const isSignup = useMemo(() => mode === 'signup', [mode]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4 rounded-xl border border-slate-700 bg-slate-950 p-6"
    >
      {isSignup && (
        <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
      )}
      <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
      <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
      <button disabled={loading} className="w-full rounded-lg bg-cyan-500 px-3 py-2 font-semibold text-slate-900 hover:bg-cyan-400">{loading ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}</button>
    </form>
  );
};

export default AuthForm;
