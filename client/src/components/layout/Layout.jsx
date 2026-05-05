import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="grid grid-cols-6 min-h-screen bg-gray-100/50">
      {/* Sidebar - Fixed Width */}
      <div className="col-span-1">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="col-span-5 flex flex-col min-h-screen relative">
        <Topbar />
        
        <main className="p-8 pb-12 flex-1 animate-in fade-in duration-500">
          <div className="w-[79vw] mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="px-8 py-6 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">
            TimberERP &copy; {new Date().getFullYear()} &bull; Industrial Management System v1.0
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
