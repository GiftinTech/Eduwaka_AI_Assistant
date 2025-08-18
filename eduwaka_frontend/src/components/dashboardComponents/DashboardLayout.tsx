import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { useState } from 'react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="font-inter flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`custom-scrollbar fixed inset-y-0 left-0 min-w-80 transform bg-white p-6 shadow-xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50 overflow-y-auto transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-2 sm:p-6">
          <div className="mx-auto max-w-4xl rounded-xl p-4 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
