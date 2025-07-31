import Button from './ui/button';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    { label: 'Institution Search', href: '/institutions' },
    { label: 'Course Search', href: '/courses' },
    { label: 'Fee Checker', href: '/fees' },
    { label: 'Eligibility', href: '/eligibility' },
    { label: 'Support', href: '/support' },
  ];

  return (
    <header className="bg-background/95 border-border fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <GraduationCap className="text-primary-foreground h-6 w-6" />
            </div>
            <span className="text-foreground text-xl font-bold">EduWaka</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden items-center space-x-4 md:flex">
            <Button
              variant="hero"
              className="font-semibold"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-muted-foreground hover:text-primary hover:bg-accent rounded-md p-2 md:hidden"
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
          <div className="border-border border-t py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-muted-foreground hover:text-primary py-2 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button variant="hero" className="mt-4 font-semibold">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
