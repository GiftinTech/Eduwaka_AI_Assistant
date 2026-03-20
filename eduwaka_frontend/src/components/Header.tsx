import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Institution Search', href: '/dashboard/searchInstitutions' },
  { label: 'Course Search', href: '/dashboard/searchCourses' },
  { label: 'Fee Checker', href: '/dashboard/tuitionChecker' },
  { label: 'Eligibility', href: '/dashboard/eligibilityCheckerAI' },
  { label: 'Support', href: '/dashboard/supportHelpDesk' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.first_name
    ? `${user.first_name[0]}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : (user?.username?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase();

  const close = () => setIsMenuOpen(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#e5e7eb] bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-[#111827]"
          >
            <img
              src="/images/eduwaka-logo-green.png"
              alt="EduWaka helps Nigerian students navigate university admissions with intelligent tools for institution search, course eligibility, fee estimation, and exam preparation."
              className="h-28 w-28 object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm text-[#6b7280] transition-colors duration-150 hover:text-[#111827]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#e5e7eb] transition-all hover:ring-[#eb4799]"
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-[#00252e] text-xs font-bold text-white">
                      {initials}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleLogout()}
                  className="rounded-xl border border-[#e5e7eb] px-4 py-2 text-sm font-semibold text-[#374151] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-xl border border-[#e5e7eb] px-4 py-2 text-sm font-semibold text-[#374151] transition-colors hover:border-[#00252e] hover:text-[#111827]"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="rounded-xl bg-[#eb4799] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#d43589] active:scale-[0.98]"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#111827] md:hidden"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="border-t border-[#e5e7eb] pb-5 pt-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={close}
                  className="rounded-lg px-3 py-2.5 text-sm text-[#374151] transition-colors hover:bg-[#f3f4f6] hover:text-[#111827]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex items-center gap-2 border-t border-[#e5e7eb] pt-4">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      close();
                    }}
                    className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#e5e7eb]"
                  >
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-[#00252e] text-xs font-bold text-white">
                        {initials}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      close();
                    }}
                    className="rounded-xl border border-[#e5e7eb] px-4 py-2 text-sm font-semibold text-[#374151] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      close();
                    }}
                    className="flex-1 rounded-xl border border-[#e5e7eb] py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:border-[#00252e] hover:text-[#111827]"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      close();
                    }}
                    className="flex-1 rounded-xl bg-[#eb4799] py-2.5 text-sm font-bold text-white transition-all hover:bg-[#d43589] active:scale-[0.98]"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
