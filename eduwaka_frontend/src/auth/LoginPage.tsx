import { useState, type FormEvent, type ChangeEvent } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/button';

const Login = () => {
  // Access auth functions and state from the context
  const { handleLogin, loadingAuth } = useAuth();

  // State for the form inputs and submission status
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formAuthError, setFormAuthError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormAuthError(''); // Clear previous errors

    // Call the login function from the context with username and password
    const result = await handleLogin(username, password);

    if (result.success) {
      // Clear form inputs on successful login
      setUsername('');
      setPassword('');
      // Navigate to the home page
      navigate('/');
    } else {
      // Display the error message from the API
      setFormAuthError(result.error || 'An unknown error occurred.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen animate-swirl items-center justify-center bg-[linear-gradient(135deg,_#6366f1,_#a855f7,_#6366f1)] bg-[length:400%_400%] px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="absolute left-4 top-4 flex items-center text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
          aria-label="Back to Landing Page"
        >
          <ChevronRight size={20} className="mr-1 rotate-180 transform" /> Back
        </Button>
        <h2 className="my-5 text-center text-4xl font-extrabold text-gray-900 dark:text-gray-50">
          Edu<span className="text-pink-600 dark:text-pink-400">Waka</span>
        </h2>
        <p className="mb-6 text-center text-lg text-gray-600 dark:text-gray-300">
          Sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 transition duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50"
              placeholder="Your username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              required
              disabled={isSubmitting || loadingAuth}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 transition duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50"
              placeholder="••••••••"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              disabled={isSubmitting || loadingAuth}
            />
          </div>
          {formAuthError && (
            <p className="rounded-md bg-red-50 p-2 text-center text-sm text-red-600 dark:bg-red-900 dark:text-red-300">
              {formAuthError}
            </p>
          )}
          <button
            type="submit"
            className="w-full transform rounded-lg bg-indigo-600 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400"
            disabled={isSubmitting || loadingAuth}
          >
            {isSubmitting || loadingAuth ? 'Processing...' : 'Login'}
          </button>
        </form>
        <div className="flex justify-center text-sm">
          <Button
            variant="link"
            type="button"
            onClick={() => navigate('/forgot-password')}
            disabled={isSubmitting || loadingAuth}
          >
            Forgot password?
          </Button>
        </div>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          {"Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="font-medium text-blue-600 transition-colors hover:text-blue-800 focus:outline-none dark:text-blue-400 dark:hover:text-blue-600"
            disabled={isSubmitting || loadingAuth}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
