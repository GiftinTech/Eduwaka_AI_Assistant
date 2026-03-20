import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../hooks/useAlert';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const Signup = () => {
  // RegisterSerializer only needs: email + password (username auto-generated from email)
  const { handleSignup, handleGoogleLogin, loadingAuth } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [formAuthError, setFormAuthError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const navigate = useNavigate();
  const isLoading = isSubmitting || loadingAuth || isGoogleLoading;

  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    {
      label: 'Passwords match',
      pass: password.length > 0 && password === confirmPassword,
    },
  ];
  const allChecksPassed = checks.every((c) => c.pass);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormAuthError('');

    if (password !== confirmPassword) {
      setFormAuthError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }
    if (password.length < 8) {
      setFormAuthError('Password must be at least 8 characters.');
      setIsSubmitting(false);
      return;
    }

    // Only email + password — RegisterSerializer auto-generates username
    const result = await handleSignup(email, password);

    if (result.success) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/dashboard');
      showAlert(
        'success',
        'Welcome to the eduwaka family! We are delighted to have you 😊',
      );
    } else {
      setFormAuthError(result.error || 'An unknown error occurred.');
    }
    setIsSubmitting(false);
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setFormAuthError('');
    try {
      const result = await handleGoogleLogin();
      if (!result.success && result.error) {
        setFormAuthError(result.error);
      }
    } catch {
      setFormAuthError('Google sign-up failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-8 font-mono">
      <div
        className="pointer-events-none absolute inset-0"
        // style={{
        //   backgroundImage: `linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)`,
        //   backgroundSize: '48px 48px',
        // }}
      />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-indigo-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/3 left-1/4 h-56 w-56 rounded-full bg-pink-500/15 blur-[80px]" />

      <button
        onClick={() => navigate('/')}
        disabled={isLoading}
        className="absolute left-6 top-6 flex items-center gap-2 text-xs tracking-widest text-zinc-500 transition-colors hover:text-indigo-400 disabled:opacity-40"
      >
        <ArrowLeft size={14} /> BACK
      </button>

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mt-3 inline-flex items-center gap-2">
            <img
              src="/images/eduwaka-logo-white.png"
              alt="EduWaka helps Nigerian students navigate university admissions with intelligent tools for institution search, course eligibility, fee estimation, and exam preparation."
              className="h-28 w-28 object-contain"
            />
          </div>
          <p className="-mt-5 text-xs uppercase tracking-[0.2em] text-zinc-500">
            Create your account
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
          {/* Google OAuth — calls /api/auth/google/ */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-white/[0.10] bg-white/[0.05] py-3 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isGoogleLoading ? <Spinner /> : <GoogleIcon />}
            <span>Continue with Google</span>
          </button>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-600">
              or
            </span>
            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className={`block text-[11px] uppercase tracking-widest transition-colors ${focused === 'email' ? 'text-indigo-400' : 'text-zinc-500'}`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-indigo-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                placeholder="you@example.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
              {email.includes('@') && (
                <p className="text-[10px] tracking-wider text-zinc-600">
                  Username:{' '}
                  <span className="text-zinc-400">{email.split('@')[0]}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className={`block text-[11px] uppercase tracking-widest transition-colors ${focused === 'password' ? 'text-indigo-400' : 'text-zinc-500'}`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 pr-11 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-indigo-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-600 transition-colors hover:text-zinc-400"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className={`block text-[11px] uppercase tracking-widest transition-colors ${focused === 'confirm' ? 'text-indigo-400' : 'text-zinc-500'}`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 pr-11 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-indigo-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused(null)}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-600 transition-colors hover:text-zinc-400"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Live password checklist */}
            {password.length > 0 && (
              <div className="space-y-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                {checks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2">
                    <div
                      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full transition-colors ${check.pass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.05] text-zinc-600'}`}
                    >
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span
                      className={`text-[11px] transition-colors ${check.pass ? 'text-emerald-400' : 'text-zinc-600'}`}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {formAuthError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-center text-xs text-red-400">
                  {formAuthError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (password.length > 0 && !allChecksPassed)}
              className="mt-2 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold tracking-wider text-white transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting || loadingAuth ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> CREATING ACCOUNT...
                </span>
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-indigo-400 transition-colors hover:text-indigo-300"
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
