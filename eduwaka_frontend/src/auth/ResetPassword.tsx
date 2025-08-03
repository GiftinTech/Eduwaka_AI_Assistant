import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import Button from '../components/ui/button';

const ResetPassword = () => {
  // Access auth functions and state from the context
  const { handlePasswordReset, loadingAuth } = useAuth();

  // State for the password reset form
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [formAuthError, setFormAuthError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Extract uidb64 and token from param
  const { uidb64, token } = useParams();

  // Hook for navigation
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure token and uid are present
    if (!uidb64 || !token) {
      setFormAuthError('Invalid or expired password reset link.');
    }
  }, [uidb64, token]);

  // Handle form submission
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
      setSuccessMessage(result.message || 'Password reset successful!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setFormAuthError(result.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <div className="animate-swirl flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#6366f1,_#a855f7,_#6366f1)] bg-[length:400%_400%] px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <h2 className="mb-8 text-center text-4xl font-extrabold text-gray-900 dark:text-gray-50">
          Edu<span className="text-purple-600 dark:text-purple-400">Waka</span>
        </h2>
        <p className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Reset Your Password
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              required
              disabled={isSubmitting || loadingAuth}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
              disabled={isSubmitting || loadingAuth}
            />
          </div>

          {formAuthError && (
            <p className="rounded-md bg-red-100 p-2 text-center text-sm text-red-600 dark:bg-red-800 dark:text-red-200">
              {formAuthError}
            </p>
          )}
          {successMessage && (
            <p className="rounded-md bg-green-100 p-2 text-center text-sm text-green-700 dark:bg-green-900 dark:text-green-300">
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loadingAuth}
          >
            {isSubmitting || loadingAuth ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
