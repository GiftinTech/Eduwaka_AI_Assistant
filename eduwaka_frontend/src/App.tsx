import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import Signup from './auth/SignupPage';
import Login from './auth/LoginPage';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import DashboardContent from './components/DashboardContent';
import DashboardLayout from './components/DashboardLayout';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:uidb64/:token"
            element={<ResetPassword />}
          />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardContent />} />
            {/* <Route path="/searchInstitutions" element={<SearchInstitutions />} />
            <Route
              path="/eligibilityCheckerAI"
              element={<EligibilityChecker />}
            /> */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
