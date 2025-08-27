import { useState } from 'react';
import Button from './ui/button';
import { Menu, X } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Institution Search', href: '/dashboard/searchInstitutions' },
    { label: 'Course Search', href: '/dashboard/searchCourses' },
    { label: 'Fee Checker', href: '/dashboard/tuitionChecker' },
    { label: 'Eligibility', href: '/dashboard/eligibilityCheckerAI' },
    { label: 'Support', href: '/dashboard/supportHelpDesk' },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-foreground"
          >
            edu<span className="text-pink-600 dark:text-pink-400">waka</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-muted-foreground transition-colors duration-200 hover:font-[500]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden items-center space-x-4 md:flex">
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate('/dashboard');
                  }}
                >
                  {user?.photo && (
                    <img
                      src={user?.photo}
                      alt="User"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                </button>
                <Button
                  variant="outline"
                  className="border font-semibold hover:text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border font-semibold"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="hero"
                  className="font-semibold"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-muted-foreground rounded-md p-2 md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-muted-foreground py-2 transition-colors duration-200 hover:font-[500]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                    >
                      {user?.photo && (
                        <img
                          src={user?.photo}
                          alt="User"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                    </button>

                    <Button
                      variant="outline"
                      className="ml-2 border font-semibold hover:text-red-600"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="mr-2 mt-4 border font-semibold"
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="hero"
                      className="ml-2 font-semibold"
                      onClick={() => {
                        navigate('/signup');
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
