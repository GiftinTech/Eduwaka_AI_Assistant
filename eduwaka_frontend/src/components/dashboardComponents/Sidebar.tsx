import { useEffect, type JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  BookOpen,
  GraduationCap,
  ListChecks,
  Calendar,
  Mail,
  LifeBuoy,
  Bot,
  LogOut,
  Home,
  HelpCircle,
  ChevronRight,
  X,
} from 'lucide-react';

const NairaIcon = ({
  size = 24,
  className = 'ml-[2px]',
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
  >
    <text
      x="0"
      y="20"
      fontSize="20"
      fontFamily="Arial, sans-serif"
      fontWeight="500"
    >
      ₦
    </text>
  </svg>
);

interface SidebarItemProps {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, onClick, isActive }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center rounded-lg px-4 py-2 transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-100 font-semibold text-indigo-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
    {isActive && <ChevronRight size={16} className="ml-auto text-indigo-700" />}
  </button>
);

interface SidebarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ setIsSidebarOpen }: SidebarProps) => {
  const { handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!document.getElementById('sidebar')?.contains(e.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSidebarOpen]);

  const onLogoutClick = async () => {
    const result = await handleLogout();
    if (result.success) {
      navigate('/');
    } else {
      console.error('Logout failed:', result.error);
    }
  };

  // Helper to check active state
  const isActive = (path: string) =>
    currentPath === `/dashboard/${path}` ||
    (currentPath === '/dashboard' && path === '');

  return (
    <div id="sidebar">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-indigo-700">EduWaka</h1>
        <button
          className="text-gray-600 hover:text-gray-900 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>
      </div>
      <div className="h-auto">
        <nav className="space-y-3">
          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            onClick={() => navigate('/dashboard')}
            isActive={isActive('')}
          />
          <SidebarItem
            icon={<Search size={20} />}
            label="Search Institutions"
            onClick={() => navigate('/dashboard/searchInstitutions')}
            isActive={isActive('searchInstitutions')}
          />
          <SidebarItem
            icon={<BookOpen size={20} />}
            label="Search Courses"
            onClick={() => navigate('/dashboard/searchCourses')}
            isActive={isActive('searchCourses')}
          />
          <SidebarItem
            icon={<ListChecks size={20} />}
            label="Eligibility Checker (AI)"
            onClick={() => navigate('/dashboard/eligibilityCheckerAI')}
            isActive={isActive('eligibilityCheckerAI')}
          />
          <SidebarItem
            icon={<NairaIcon />}
            label="Tuition/Fee Checker"
            onClick={() => navigate('/dashboard/tuitionChecker')}
            isActive={isActive('tuitionChecker')}
          />
          <SidebarItem
            icon={<ListChecks size={20} />}
            label="O'Level Combination Checker"
            onClick={() => navigate('/dashboard/olevelCombination')}
            isActive={isActive('olevelCombination')}
          />
          <SidebarItem
            icon={<ListChecks size={20} />}
            label="JAMB Combination Checker"
            onClick={() => navigate('/dashboard/jambCombination')}
            isActive={isActive('jambCombination')}
          />
          <SidebarItem
            icon={<GraduationCap size={20} />}
            label="Institution Overview"
            onClick={() => navigate('/dashboard/institutionOverview')}
            isActive={isActive('institutionOverview')}
          />
          <SidebarItem
            icon={<Calendar size={20} />}
            label="Admission Calendar"
            onClick={() => navigate('/dashboard/admissionCalendar')}
            isActive={isActive('admissionCalendar')}
          />
          <SidebarItem
            icon={<Mail size={20} />}
            label="Email Notifications"
            onClick={() => navigate('/dashboard/emailNotifications')}
            isActive={isActive('emailNotifications')}
          />
          <SidebarItem
            icon={<HelpCircle size={20} />}
            label="FAQ"
            onClick={() => navigate('/dashboard/faqSection')}
            isActive={isActive('faqSection')}
          />
          <SidebarItem
            icon={<LifeBuoy size={20} />}
            label="Support/Ask for Help"
            onClick={() => navigate('/dashboard/supportHelpDesk')}
            isActive={isActive('supportHelpDesk')}
          />
          <SidebarItem
            icon={<Bot size={20} />}
            label="Chatbot"
            onClick={() => navigate('/dashboard/chatbot')}
            isActive={isActive('chatbot')}
          />
        </nav>
      </div>

      <div>
        <button
          onClick={onLogoutClick}
          className="mt-2 flex w-full items-center rounded-lg px-4 py-2 text-red-600 transition-colors duration-200 hover:bg-red-100"
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
