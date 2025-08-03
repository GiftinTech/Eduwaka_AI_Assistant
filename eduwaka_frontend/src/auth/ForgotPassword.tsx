import { useState, type FormEvent, type ChangeEvent } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import Button from '../components/ui/button';

const ForgotPassword = () => {
  // Access auth functions and state from the context
  const { handleForgotPassword, loadingAuth, user } = useAuth();

  // State for the password reset form
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetMessage, setResetMessage] = useState<string>('');
  const [formAuthError, setFormAuthError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Hook for navigation
  const navigate = useNavigate();

  // If a user is already logged in, navigate them away from this page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle password reset form submission
  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResetMessage('');
    setFormAuthError('');

    const result = await handleForgotPassword(resetEmail);

    if (result.success) {
      setResetMessage(
        result.message ||
          'If an account with that email exists, a password reset link has been sent.',
      );
      setFormAuthError(''); // Clear any previous errors on success
      setResetEmail('');
    } else {
      setResetMessage(''); // Clear any previous success messages
      setFormAuthError(
        result.message ||
          'Failed to send password reset email. Please try again.',
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="animate-swirl flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#6366f1,_#a855f7,_#6366f1)] bg-[length:400%_400%] px-4">
      <div className="relative w-full max-w-md transform rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] dark:bg-gray-800">
        <button
          onClick={() => navigate('/login')}
          className="absolute left-4 top-4 flex items-center text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          aria-label="Back to Login"
        >
          <ChevronRight size={20} className="mr-1 rotate-180 transform" /> Back
        </button>
        <h2 className="mb-8 text-center text-4xl font-extrabold text-gray-900 dark:text-gray-50">
          Edu<span className="text-purple-600 dark:text-purple-400">Waka</span>
        </h2>
        <p className="mb-6 text-center text-lg text-gray-600 dark:text-gray-300">
          Reset Your Password
        </p>
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
          <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
            Enter your email to receive a password reset link.
          </p>
          <div>
            <label
              htmlFor="resetEmail"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email Address
            </label>
            <input
              type="email"
              id="resetEmail"
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50"
              placeholder="you@example.com"
              value={resetEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setResetEmail(e.target.value)
              }
              required
              disabled={isSubmitting || loadingAuth}
            />
          </div>
          {resetMessage && (
            <p className="rounded-md bg-green-50 p-2 text-center text-sm text-green-600 dark:bg-green-900 dark:text-green-300">
              {resetMessage}
            </p>
          )}
          {formAuthError && (
            <p className="rounded-md bg-red-50 p-2 text-center text-sm text-red-600 dark:bg-red-900 dark:text-red-300">
              {formAuthError}
            </p>
          )}
          <button
            type="submit"
            className="w-full transform rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
            disabled={isSubmitting || loadingAuth}
          >
            {isSubmitting || loadingAuth ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Remembered your password?{' '}
          <Button
            variant="link"
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium text-blue-600 transition-colors hover:text-blue-800 focus:outline-none dark:text-blue-400 dark:hover:text-blue-600"
            disabled={isSubmitting || loadingAuth}
          >
            Log in here
          </Button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
