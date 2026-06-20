import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: 'priya@example.com', phone: '', password: 'user123' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = mode === 'login'
        ? await authApi.login(form.email, form.password)
        : await authApi.register(form.name, form.email, form.phone, form.password);
      login(r.data.user, r.data.token);
      toast.success(`Welcome${r.data.user.name ? ', ' + r.data.user.name.split(' ')[0] : ''}! 👋`);
      navigate(r.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-pale via-white to-secondary-pale flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">MS Dairy</h1>
          <p className="text-gray-500 mt-1">Pure. Fresh. Delivered.</p>
        </div>

        <div className="card p-8 shadow-xl">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${mode === m ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{m === 'login' ? 'Sign In' : 'Sign Up'}</button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="Suraj Kumar" /></div>
                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+91 98765 43210" /></div>
              </>
            )}
            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" placeholder="you@example.com" /></div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Password</label>
              <div className="relative">
                <input required type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">{loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}</button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
            <strong>Demo:</strong> Admin — suraj@msdairy.com / admin123 | User — priya@example.com / user123
          </div>
        </div>
      </div>
    </div>
  );
}
