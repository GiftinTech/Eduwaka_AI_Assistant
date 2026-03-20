import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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

const ResetPassword = () => {
  const { handlePasswordReset, loadingAuth } = useAuth();
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formAuthError, setFormAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    if (!uidb64 || !token) {
      setFormAuthError('Invalid or expired password reset link.');
    }
  }, [uidb64, token]);

  const checks = [
    { label: 'At least 8 characters', pass: newPassword.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(newPassword) },
    {
      label: 'Passwords match',
      pass: newPassword.length > 0 && newPassword === confirmPassword,
    },
  ];
  const allChecksPassed = checks.every((c) => c.pass);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormAuthError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (newPassword !== confirmPassword) {
      setFormAuthError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    const result = await handlePasswordReset(
      uidb64!,
      token!,
      newPassword,
      confirmPassword,
    );
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(
        result.message || 'Password reset successful! Redirecting...',
      );
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 2500);
    } else {
      setFormAuthError(
        result.message || 'Something went wrong. Please try again.',
      );
    }
  };

  const isLoading = isSubmitting || loadingAuth;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-8 font-mono">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        // style={{
        //   backgroundImage: `linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)`,
        //   backgroundSize: '48px 48px',
        // }}
      />
      <div className="pointer-events-none absolute right-1/3 top-1/4 h-72 w-72 rounded-full bg-[#4853ea]/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/3 h-56 w-56 rounded-full bg-[#eb4799]/10 blur-[80px]" />

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
            Set a new password
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New password */}
            <div className="space-y-1.5">
              <label
                htmlFor="newPassword"
                className={`block text-[11px] uppercase tracking-widest transition-colors ${focused === 'new' ? 'text-[#eb4799]' : 'text-zinc-500'}`}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 pr-11 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#eb4799]/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#eb4799]/30 disabled:cursor-not-allowed disabled:opacity-40"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewPassword(e.target.value)
                  }
                  onFocus={() => setFocused('new')}
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

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className={`block text-[11px] uppercase tracking-widest transition-colors ${focused === 'confirm' ? 'text-[#eb4799]' : 'text-zinc-500'}`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 pr-11 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#eb4799]/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#eb4799]/30 disabled:cursor-not-allowed disabled:opacity-40"
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

            {/* Password checklist */}
            {newPassword.length > 0 && (
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

            {/* Success */}
            {successMessage && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <p className="text-center text-xs text-emerald-400">
                  {successMessage}
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
              disabled={
                isLoading || (newPassword.length > 0 && !allChecksPassed)
              }
              className="mt-2 w-full rounded-lg bg-[#eb4799] py-3 text-sm font-bold tracking-wider text-white transition-all hover:bg-[#d43589] focus:outline-none focus:ring-2 focus:ring-[#eb4799]/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> RESETTING...
                </span>
              ) : (
                'RESET PASSWORD'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Back to{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#eb4799] transition-colors hover:text-[#d43589]"
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
