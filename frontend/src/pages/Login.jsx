import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, Film, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      toast.success('Login successful');
      navigate(result.user?.userType === 'ADMIN' ? '/admin' : '/');
    } else {
      toast.error(result.message);
    }
  };



  return (
    <div className="mx-auto max-w-md py-10">
      <div className="rounded-[2rem] border border-white/8 bg-[#111116] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
            <Film size={30} />
          </div>
          <h2 className="text-3xl font-black tracking-[-0.05em] text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-white/55">Log in to continue your cinema journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-shell pl-11 pr-4"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-shell pl-11 pr-11"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 transition-colors hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          New to Cineverse?{' '}
          <Link to="/signup" className="font-bold text-red-400 transition-colors hover:text-red-300">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
