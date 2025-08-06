import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import Signup from './auth/SignupPage';
import Login from './auth/LoginPage';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import DashboardContent from './components/dashboardComponents/DashboardContent';
import DashboardLayout from './components/dashboardComponents/DashboardLayout';
import UserProfile from './components/dashboardComponents/UserProfile';
import EligibilityCheckerAI from './components/dashboardComponents/EligibilityCheckerAI';
import SearchCourses from './components/dashboardComponents/SearchCourses';
import SearchInstitutions from './components/dashboardComponents/SearchInstitutions';
import CourseDetails from './components/dashboardComponents/CourseDetails';
import TuitionFeeChecker from './components/dashboardComponents/TuitionFeeChecker';
import OLevelCombinationChecker from './components/dashboardComponents/OLevelCombinationChecker';
import JAMBCombinationChecker from './components/dashboardComponents/JAMBCombinationChecker';
import InstitutionOverview from './components/dashboardComponents/InstitutionOverview';
import UniversityAdmissionCalendar from './components/dashboardComponents/UniversityAdmissionCalendar';
import EmailNotifications from './components/dashboardComponents/EmailNotifications';
import FAQSection from './components/dashboardComponents/FAQSection';
import SupportHelpDesk from './components/dashboardComponents/SupportHelpDest';
import Chatbot from './components/dashboardComponents/Chatbot';

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
            <Route path="/dashboard/myProfile" element={<UserProfile />} />
            <Route
              path="/dashboard/eligibilityCheckerAI"
              element={<EligibilityCheckerAI />}
            />
            <Route
              path="/dashboard/searchCourses"
              element={<SearchCourses />}
            />
            <Route
              path="/dashboard/courseDetails"
              element={<CourseDetails />}
            />
            <Route
              path="/dashboard/eligibilityCheckerAI"
              element={<EligibilityCheckerAI />}
            />
            <Route
              path="/dashboard/searchInstitutions"
              element={<SearchInstitutions />}
            />
            <Route
              path="/dashboard/tuitionChecker"
              element={<TuitionFeeChecker />}
            />
            <Route
              path="/dashboard/olevelCombination"
              element={<OLevelCombinationChecker />}
            />
            <Route
              path="/dashboard/jambCombination"
              element={<JAMBCombinationChecker />}
            />
            <Route
              path="/dashboard/institutionOverview"
              element={<InstitutionOverview />}
            />
            <Route
              path="/dashboard/admissionCalendar"
              element={<UniversityAdmissionCalendar />}
            />
            <Route
              path="/dashboard/emailNotifications"
              element={<EmailNotifications />}
            />
            <Route path="/dashboard/faqSection" element={<FAQSection />} />
            <Route
              path="/dashboard/supportHelpDesk"
              element={<SupportHelpDesk />}
            />
            <Route path="/dashboard/chatbot" element={<Chatbot />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
