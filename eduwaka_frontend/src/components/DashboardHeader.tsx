// Lucide React Icons
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardHeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const DashboardHeader = ({ setIsSidebarOpen }: DashboardHeaderProps) => {
  const { user } = useAuth(); // Get user from context

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-white p-4 shadow-md md:justify-end">
      <button
        className="text-gray-600 hover:text-gray-900 md:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>
      <div className="flex items-center space-x-4">
        <span className="font-medium text-gray-700">
          Hello,{' '}
          <span className="font-bold text-indigo-700">
            {user?.username.toUpperCase() || user?.email || 'User'}
          </span>
          !
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;
