/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

// Base URL for Django eduwaka_backend API
const DJANGO_API_BASE_URL = 'http://127.0.0.1:8000/api/';

// Shape of the Django User object
interface DjangoUser {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

// Shape of the AuthContext value
interface AuthContextType {
  user: DjangoUser | null;
  loadingAuth: boolean;
  appError: string;
  handleSignup: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  handleLogin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  handleLogout: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<DjangoUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [appError, setAppError] = useState<string>('');

  // Function to decode JWT token to get user info
  const decodeJwt = (token: string): DjangoUser | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );
      const decoded = JSON.parse(jsonPayload);

      // Ensure the decoded token has the expected user fields
      return {
        id: decoded.user_id, // Assuming 'user_id' from Django Simple JWT payload
        email: decoded.email || decoded.username, // Try email first, then username
        username: decoded.username || decoded.email,
        // Add other fields from your Django UserProfile if available in token payload
      };
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  };

  useEffect(() => {
    // On component mount, check for existing JWT token in localStorage
    const loadUserFromToken = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const decodedUser = decodeJwt(accessToken);
        if (decodedUser) {
          setUser(decodedUser);
          console.log(
            'AuthContext: User loaded from token:',
            decodedUser.username,
          );
        } else {
          // Token invalid or expired, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
          console.log('AuthContext: Invalid token, user logged out.');
        }
      }
      setLoadingAuth(false);
      console.log('AuthContext: Initial auth loading complete.');
    };

    loadUserFromToken();
  }, []);

  const handleSignup = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${DJANGO_API_BASE_URL}register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful registration, immediately try to log in
        return handleLogin(email, password);
      } else {
        return {
          success: false,
          error:
            data.email?.[0] ||
            data.username?.[0] ||
            data.password?.[0] ||
            data.detail ||
            'Signup failed.',
        };
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during signup.',
      };
    }
  };

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call Django REST Framework Simple JWT token obtain endpoint
      const response = await fetch(`${DJANGO_API_BASE_URL}auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Simple JWT can authenticate by email or username
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const decodedUser = decodeJwt(data.access);
        if (decodedUser) {
          setUser(decodedUser);
          return { success: true };
        } else {
          return {
            success: false,
            error: 'Failed to decode user information from token.',
          };
        }
      } else {
        return {
          success: false,
          error: data.detail || 'Login failed. Check your credentials.',
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during login.',
      };
    }
  };

  const handleLogout = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      // remove tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      return { success: true };
      // If you implement a JWT blacklist on the backend, you'd make a POST request here
      // e.g., fetch(`${DJANGO_API_BASE_URL}auth/token/blacklist/`, { method: 'POST', ... });
    } catch (error: any) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during logout.',
      };
    }
  };

  const contextValue: AuthContextType = {
    user,
    loadingAuth,
    appError,
    handleSignup,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
