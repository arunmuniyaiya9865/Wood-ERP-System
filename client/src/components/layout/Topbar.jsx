import React from 'react';
import { Search, Bell, Plus, Command } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Topbar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'dashboard';
  const label = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  return (
    <header className="h-16 topbar-glass sticky top-0 z-40 flex items-center justify-between px-8">
      {/* Page Label / Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#6b7a94]">Modules</span>
        <span className="text-[#a2adc7]">/</span>
        <span className="text-sm font-semibold text-[#233458]">{label}</span>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9bb5] transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="bg-white/30 border border-white/40 rounded-xl pl-10 pr-12 py-1.5 text-sm w-64 focus:ring-2 focus:ring-emerald-200 focus:bg-white/80 transition-all outline-none backdrop-blur-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border border-white/45 rounded px-1 bg-white/60">
            <Command className="w-2.5 h-2.5 text-[#6b7c99]" />
            <span className="text-[10px] font-bold text-[#6b7c99]">K</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 text-[#778ba4] hover:bg-white/35 rounded-full transition-all group shadow-sm">
          <Bell className="w-5 h-5 group-hover:text-[#1f3c85]" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#e25764] border-2 border-white rounded-full"></span>
        </button>

        {/* Quick Action Button */}
        {/* <button className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm">
          <Plus className="w-4 h-4" />
          New
        </button> */}
      </div>
    </header>
  );
};

export default Topbar;
