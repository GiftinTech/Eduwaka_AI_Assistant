/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

interface DjangoUser {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  photo?: string;
  photo_url?: string;
}

interface AuthContextType {
  user: DjangoUser | null;
  token: string | null;
  loadingAuth: boolean;
  appError: string;
  updateUser: (updates: Partial<DjangoUser>) => void;
  handleSignup: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  handleLogin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  handleGoogleLogin: () => Promise<{ success: boolean; error?: string }>;
  handleLogout: () => Promise<{ success: boolean; error?: string }>;
  handleForgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; message?: string }>;
  handlePasswordReset: (
    uidb64: string,
    token: string,
    new_password: string,
    confirm_password: string,
  ) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<DjangoUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [appError, setAppError] = useState<string>('');

  const decodeJwt = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error: any) {
      console.error('Failed to decode JWT token:', error);
      setAppError(error);
      return null;
    }
  };

  const updateUser = (updates: Partial<DjangoUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const fetchUserProfile = async (accessToken: string) => {
    try {
      const response = await fetch(`${DJANGO_API_BASE_URL}profile/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // /profile/me/ returns a single object, not a paginated list
        setUser(userData);
        return userData;
      } else {
        console.error('Failed to fetch user profile:', response.statusText);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
      }
    } catch (error) {
      console.error('Network error fetching user profile:', error);
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return null;
    }
  };

  // On mount: restore session from localStorage
  useEffect(() => {
    const loadUserFromToken = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const decodedToken = decodeJwt(accessToken);
        if (decodedToken) {
          setToken(accessToken);
          await fetchUserProfile(accessToken);
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        }
      }
      setLoadingAuth(false);
    };

    loadUserFromToken();
  }, []);

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${DJANGO_API_BASE_URL}auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        const accessToken = data.access;
        const refreshToken = data.refresh;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setToken(accessToken);

        // Populate user state immediately after login
        await fetchUserProfile(accessToken);

        return { success: true };
      } else {
        return { success: false, error: data.detail || 'Login failed.' };
      }
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const handleSignup = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${DJANGO_API_BASE_URL}register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // Registration succeeds but returns no tokens — auto-login after
        return await handleLogin(email, password);
      } else {
        const firstError =
          data.email?.[0] ||
          data.password?.[0] ||
          data.detail ||
          'Signup failed.';
        return { success: false, error: firstError };
      }
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const handleGoogleLogin = (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    return new Promise((resolve) => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        resolve({ success: false, error: 'Google Client ID not configured.' });
        return;
      }

      const google = (window as any).google;
      if (!google?.accounts?.oauth2) {
        resolve({
          success: false,
          error: 'Google Sign-In failed to load. Please refresh and try again.',
        });
        return;
      }

      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        // Called on success AND on error/cancel
        callback: async (tokenResponse: any) => {
          // User closed popup or denied — error_subtype is 'access_denied'
          if (tokenResponse.error) {
            if (
              tokenResponse.error === 'access_denied' ||
              tokenResponse.error === 'popup_closed_by_user'
            ) {
              resolve({ success: false, error: '' }); // silent — user just closed it
            } else {
              resolve({
                success: false,
                error: `Google error: ${tokenResponse.error}`,
              });
            }
            return;
          }

          try {
            const response = await fetch(`${DJANGO_API_BASE_URL}auth/google/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                access_token: tokenResponse.access_token,
              }),
            });
            const data = await response.json();

            if (response.ok) {
              localStorage.setItem('access_token', data.access);
              localStorage.setItem('refresh_token', data.refresh);
              setToken(data.access);
              await fetchUserProfile(data.access);
              resolve({ success: true });
            } else {
              resolve({
                success: false,
                error:
                  data.detail ||
                  data.non_field_errors?.[0] ||
                  'Google login failed.',
              });
            }
          } catch {
            resolve({
              success: false,
              error: 'Network error. Please try again.',
            });
          }
        },
        // Called when popup closes without completing — GSI fires this separately
        error_callback: (err: any) => {
          if (err.type === 'popup_closed') {
            resolve({ success: false, error: '' }); // silent
          } else {
            resolve({ success: false, error: 'Google sign-in was cancelled.' });
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    });
  };

  const handleLogout = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setToken(null);
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during logout.',
      };
    }
  };

  const handleForgotPassword = async (
    email: string,
  ): Promise<{ success: boolean; message?: string }> => {
    setLoadingAuth(true);
    try {
      const response = await fetch(
        `${DJANGO_API_BASE_URL}auth/forgot-password/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      );
      const data = await response.json();
      setLoadingAuth(false);

      if (response.ok) {
        return {
          success: true,
          message:
            data.message ||
            'A password reset link has been sent to your email.',
        };
      } else {
        return {
          success: false,
          message:
            data.email?.[0] ||
            data.detail ||
            'Password reset failed. Please check your email address.',
        };
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      setLoadingAuth(false);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const handlePasswordReset = async (
    uidb64: string,
    token: string,
    new_password: string,
    confirm_password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    setLoadingAuth(true);
    try {
      const response = await fetch(
        `${DJANGO_API_BASE_URL}auth/reset-password/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uidb64,
            token,
            new_password,
            confirm_password,
          }),
        },
      );
      const data = await response.json();
      setLoadingAuth(false);

      if (response.ok) {
        return {
          success: true,
          message: data.message || 'Password reset successful.',
        };
      } else {
        return {
          success: false,
          message:
            data.email?.[0] ||
            data.detail ||
            'Password reset failed. Token expired, please try again.',
        };
      }
    } catch (error: any) {
      console.error('Error during password reset:', error);
      setLoadingAuth(false);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    loadingAuth,
    appError,
    updateUser,
    handleSignup,
    handleLogin,
    handleGoogleLogin,
    handleLogout,
    handleForgotPassword,
    handlePasswordReset,
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
