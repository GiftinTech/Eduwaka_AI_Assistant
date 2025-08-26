// Lucide React Icons
import { Menu, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const DashboardHeader = ({ setIsSidebarOpen }: DashboardHeaderProps) => {
  const { user } = useAuth(); // Get user from context
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between p-4 md:justify-end lg:pr-20">
      <button
        className="text-gray-600 hover:text-gray-900 md:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>
      <div className="flex items-center space-x-4">
        <span className="font-medium text-gray-700">
          Hello,{' '}
          <span className="font-bold">
            {user?.username.toUpperCase() || user?.email || 'User'}
          </span>
          !
        </span>
        <button
          onClick={() => navigate('/dashboard/myProfile')}
          className="flex items-center gap-2"
        >
          {user?.photo ? (
            <img
              src={user?.photo}
              alt="User"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <User size={20} />
          )}
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
