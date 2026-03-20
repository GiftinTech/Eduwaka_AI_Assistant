import { Link, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardHeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const DashboardHeader = ({ setIsSidebarOpen }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e5e7eb] bg-[#f3f4f6]/80 px-4 py-3 backdrop-blur-md sm:px-8">
      {/* Mobile menu */}
      <button
        className="rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-white hover:text-[#111827] md:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile logo */}
      <a href="/">
        <img
          src="/images/eduwaka-logo-green.png"
          alt="EduWaka helps Nigerian students navigate university admissions with intelligent tools for institution search, course eligibility, fee estimation, and exam preparation."
          className="h-28 w-28 object-contain"
        />
      </a>

      {/* Right */}
      <div className="ml-auto flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[#6b7280] transition-colors hover:bg-white hover:text-[#111827]"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <div className="h-5 w-px bg-[#e5e7eb]" />

        <span className="hidden text-sm text-[#6b7280] sm:inline">
          Hello,{' '}
          <span className="font-semibold text-[#111827]">
            {user?.username?.toUpperCase() ?? user?.email ?? 'there'}
          </span>
        </span>

        <button
          onClick={() => navigate('/dashboard/myProfile')}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#e5e7eb] transition-all hover:ring-[#eb4799]"
        >
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-[#00252e] text-xs font-bold text-white">
              <User />
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
