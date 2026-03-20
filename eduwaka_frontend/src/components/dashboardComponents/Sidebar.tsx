import { useEffect, type JSX } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  X,
  LogIn,
  Banknote,
} from 'lucide-react';
import { useAlert } from '../../hooks/useAlert';

interface SidebarItemProps {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, onClick, isActive }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`group flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
      isActive
        ? 'bg-[#eb4799]/15 font-semibold text-[#eb4799]'
        : 'font-normal text-[#7eaab5] hover:bg-white/5 hover:text-white'
    }`}
  >
    <span
      className={`mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-[#eb4799]' : 'text-[#3d7080] group-hover:text-[#7eaab5]'}`}
    >
      {icon}
    </span>
    <span className="truncate">{label}</span>
    {isActive && (
      <span className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#eb4799]" />
    )}
  </button>
);

interface SidebarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ setIsSidebarOpen }: SidebarProps) => {
  const { handleLogout, user } = useAuth();
  const { showAlert } = useAlert();
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
      showAlert('success', 'Successfully logged out.', 5);
    }
  };

  const isActive = (path: string) =>
    currentPath === `/dashboard/${path}` ||
    (currentPath === '/dashboard' && path === '');

  const navGroup = (label: string) => (
    <p className="mb-1.5 mt-5 px-3 text-[10px] font-bold uppercase tracking-widest text-[#2a5060]">
      {label}
    </p>
  );

  return (
    <div id="sidebar" className="flex h-full flex-col px-3 py-6">
      {/* Logo */}
      <div className="mb-8 flex items-center justify-between px-3">
        <div className="-mb-10">
          <a href="/">
            <img
              src="/images/eduwaka-logo-white.png"
              alt="EduWaka helps Nigerian students navigate university admissions with intelligent tools for institution search, course eligibility, fee estimation, and exam preparation."
              className="h-28 w-28 object-contain"
            />
          </a>
        </div>
        <button
          className="rounded-lg p-1 text-[#2a5060] transition-colors hover:text-white md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="custom-scrollbar flex-1 overflow-y-auto">
        {navGroup('Main')}
        <SidebarItem
          icon={<Home size={17} />}
          label="Dashboard"
          onClick={() => navigate('/dashboard')}
          isActive={isActive('')}
        />
        <SidebarItem
          icon={<Search size={17} />}
          label="Search Institutions"
          onClick={() => navigate('/dashboard/searchInstitutions')}
          isActive={isActive('searchInstitutions')}
        />
        <SidebarItem
          icon={<BookOpen size={17} />}
          label="Search Courses"
          onClick={() => navigate('/dashboard/searchCourses')}
          isActive={isActive('searchCourses')}
        />

        {navGroup('AI Tools')}
        <SidebarItem
          icon={<ListChecks size={17} />}
          label="Eligibility Checker"
          onClick={() => navigate('/dashboard/eligibilityCheckerAI')}
          isActive={isActive('eligibilityCheckerAI')}
        />
        <SidebarItem
          icon={<Bot size={17} />}
          label="Chatbot"
          onClick={() => navigate('/dashboard/chatbot')}
          isActive={isActive('chatbot')}
        />
        <SidebarItem
          icon={<GraduationCap size={17} />}
          label="Institution Overview"
          onClick={() => navigate('/dashboard/institutionOverview')}
          isActive={isActive('institutionOverview')}
        />

        {navGroup('Checkers')}
        <SidebarItem
          icon={<Banknote size={17} />}
          label="Tuition / Fee Checker"
          onClick={() => navigate('/dashboard/tuitionChecker')}
          isActive={isActive('tuitionChecker')}
        />
        <SidebarItem
          icon={<ListChecks size={17} />}
          label="O'Level Combinations"
          onClick={() => navigate('/dashboard/olevelCombination')}
          isActive={isActive('olevelCombination')}
        />
        <SidebarItem
          icon={<ListChecks size={17} />}
          label="JAMB Combinations"
          onClick={() => navigate('/dashboard/jambCombination')}
          isActive={isActive('jambCombination')}
        />

        {navGroup('More')}
        <SidebarItem
          icon={<Calendar size={17} />}
          label="Admission Calendar"
          onClick={() => navigate('/dashboard/admissionCalendar')}
          isActive={isActive('admissionCalendar')}
        />
        <SidebarItem
          icon={<Mail size={17} />}
          label="Email Notifications"
          onClick={() => navigate('/dashboard/emailNotifications')}
          isActive={isActive('emailNotifications')}
        />
        <SidebarItem
          icon={<HelpCircle size={17} />}
          label="FAQ"
          onClick={() => navigate('/dashboard/faqSection')}
          isActive={isActive('faqSection')}
        />
        <SidebarItem
          icon={<LifeBuoy size={17} />}
          label="Support"
          onClick={() => navigate('/dashboard/supportHelpDesk')}
          isActive={isActive('supportHelpDesk')}
        />
      </nav>

      {/* Bottom */}
      <div className="mt-4 border-t border-white/5 pt-4">
        {user ? (
          <button
            onClick={onLogoutClick}
            className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm text-[#7eaab5] transition-colors hover:bg-red-900/20 hover:text-red-400"
          >
            <LogOut size={17} className="mr-3" />
            <span>Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm text-[#7eaab5] transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogIn size={17} className="mr-3" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
