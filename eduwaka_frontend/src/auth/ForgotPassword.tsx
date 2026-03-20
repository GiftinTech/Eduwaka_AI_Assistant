import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

const ForgotPassword = () => {
  const { handleForgotPassword, loadingAuth, user } = useAuth();

  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [formAuthError, setFormAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResetMessage('');
    setFormAuthError('');

    const result = await handleForgotPassword(resetEmail);

    if (result.success) {
      setResetMessage(
        result.message ||
          'If an account with that email exists, a reset link has been sent.',
      );
      setResetEmail('');
    } else {
      setFormAuthError(
        result.message || 'Failed to send reset email. Please try again.',
      );
    }

    setIsSubmitting(false);
  };

  const isLoading = isSubmitting || loadingAuth;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 font-mono">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        // style={{
        //   backgroundImage: `linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)`,
        //   backgroundSize: '48px 48px',
        // }}
      />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-[#eb4799]/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-56 w-56 rounded-full bg-[#4853ea]/10 blur-[80px]" />

      <button
        onClick={() => navigate('/login')}
        disabled={isLoading}
        className="absolute left-6 top-6 flex items-center gap-2 text-xs tracking-widest text-zinc-500 transition-colors hover:text-[#eb4799] disabled:opacity-40"
      >
        <ArrowLeft size={14} /> BACK
      </button>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <a href="/">
              <img
                src="/images/eduwaka-logo-white.png"
                alt="EduWaka helps Nigerian students navigate university admissions with intelligent tools for institution search, course eligibility, fee estimation, and exam preparation."
                className="h-28 w-28 object-contain"
              />
            </a>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Forgot your password?
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
          <p className="mb-6 text-center text-sm leading-relaxed text-zinc-400">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="resetEmail"
                className={`block text-[11px] uppercase tracking-widest transition-colors ${focused ? 'text-[#eb4799]' : 'text-zinc-500'}`}
              >
                Email Address
              </label>
              <input
                type="email"
                id="resetEmail"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#eb4799]/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#eb4799]/30 disabled:cursor-not-allowed disabled:opacity-40"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setResetEmail(e.target.value)
                }
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            {/* Success */}
            {resetMessage && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <p className="text-center text-xs text-emerald-400">
                  {resetMessage}
                </p>
              </div>
            )}

            {/* Error */}
            {formAuthError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-center text-xs text-red-400">
                  {formAuthError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-lg bg-[#eb4799] py-3 text-sm font-bold tracking-wider text-white transition-all hover:bg-[#d43589] focus:outline-none focus:ring-2 focus:ring-[#eb4799]/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> SENDING...
                </span>
              ) : (
                'SEND RESET LINK'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Remembered your password?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#eb4799] transition-colors hover:text-[#d43589]"
            disabled={isLoading}
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
