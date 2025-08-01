import Button from './ui/button';
import {
  GraduationCap,
  Menu,
  X,
  LogIn,
  UserPlus,
  User,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Institution Search', href: '/institutions' },
    { label: 'Course Search', href: '/courses' },
    { label: 'Fee Checker', href: '/fees' },
    { label: 'Eligibility', href: '/eligibility' },
    { label: 'Support', href: '/support' },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduWaka</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden items-center space-x-4 md:flex">
            {user ? (
              <>
                <Button
                  variant="hero"
                  className="font-semibold"
                  onClick={() => navigate('/account')}
                >
                  <User className="mr-2 h-4 w-4" />
                  {user.username || 'User'} Profile
                </Button>
                <Button
                  variant="hero"
                  className="font-semibold"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="hero"
                  className="font-semibold"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button
                  variant="hero"
                  className="font-semibold"
                  onClick={() => navigate('/signup')}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-muted-foreground hover:bg-accent rounded-md p-2 hover:text-primary md:hidden"
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
                  className="text-muted-foreground py-2 transition-colors duration-200 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 border-t border-border pt-4">
                {user ? (
                  <>
                    <Button
                      variant="hero"
                      className="mt-4 w-full font-semibold"
                      onClick={() => {
                        navigate('/account');
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {user.username || 'User'} Profile
                    </Button>
                    <Button
                      variant="hero"
                      className="mt-2 w-full font-semibold"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="hero"
                      className="mt-4 w-full font-semibold"
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                    <Button
                      variant="hero"
                      className="mt-2 w-full font-semibold"
                      onClick={() => {
                        navigate('/signup');
                        setIsMenuOpen(false);
                      }}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
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
