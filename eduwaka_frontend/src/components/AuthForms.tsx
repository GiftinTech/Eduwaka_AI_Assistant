import { useState, type FormEvent, type ChangeEvent } from 'react';

import { ChevronRight } from 'lucide-react';

// Removed all Firebase imports as we are transitioning to a full Django backend
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthForms = () => {
  const { handleLogin, handleSignup } = useAuth(); // Use auth functions from context
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formAuthError, setFormAuthError] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormAuthError('');
    let result: { success: boolean; error?: string };
    if (isLogin) {
      result = await handleLogin(email, password);
    } else {
      result = await handleSignup(email, password);
    }

    if (result.success) {
      setEmail('');
      setPassword('');
      // navigate is handled by App.tsx based on user state change in AuthContext
    } else {
      setFormAuthError(result.error || 'An unknown error occurred.');
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="relative w-full max-w-md transform rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 hover:scale-105">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 top-4 flex items-center text-gray-600 hover:text-gray-900"
          aria-label="Back to Landing Page"
        >
          <ChevronRight size={20} className="mr-1 rotate-180 transform" /> Back
        </button>
        <h2 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          EduWaka
        </h2>
        <p className="mb-6 text-center text-lg text-gray-600">
          {isLogin ? 'Sign in to your account' : 'Create your EduWaka account'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition duration-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition duration-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>
          {formAuthError && (
            <p className="text-center text-sm text-red-600">{formAuthError}</p>
          )}
          <button
            type="submit"
            className="w-full transform rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForms;
