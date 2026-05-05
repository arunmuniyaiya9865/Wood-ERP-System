import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Logs, Package, 
  Factory, Scissors, Users, Ship, 
  Wallet, PieChart, Settings, LogOut 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/procurement', label: 'Procurement', icon: ShoppingCart },
  { path: '/logs', label: 'Logs & Raw Material', icon: Logs },
  { path: '/inventory', label: 'Inventory', icon: Package },
  // { path: '/sawmill', label: 'Sawmill Ops', icon: Factory },
  { path: '/optimizer', label: 'Cutting Optimizer', icon: Scissors },
  { path: '/production', label: 'Production', icon: Package },
  { path: '/sales', label: 'Sales & CRM', icon: Users },
  { path: '/export', label: 'Export Logistics', icon: Ship },
  { path: '/finance', label: 'Finance', icon: Wallet },
  { path: '/analytics', label: 'Analytics', icon: PieChart },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="fixed inset-y-0 left-0 w-64 glass-card h-screen overflow-y-hidden z-50">
      {/* Logo Area */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#505ad5] to-[#30d7f3] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Logs className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1f3055] leading-none">Global Wood Software</h1>
            <p className="text-[10px] font-medium text-[#6b7b9a] mt-1 uppercase tracking-tighter">Industry Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group
              ${isActive
                ? 'sidebar-link-active'
                : 'sidebar-link hover:bg-indigo-50/60 hover:text-[#1f3c85]'
              }
            `}
          >
            <item.icon className="w-4 h-4 sidebar-link-icon" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          {user?.avatar ? (
            <img src={user.avatar} className="w-9 h-9 rounded-full border border-gray-200" alt="Avatar" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'TR'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Timber User'}</p>
            <p className="text-[10px] text-gray-500 uppercase font-semibold">{user?.role || 'Operator'}</p>
          </div>
        </div>
        <button 
          onClick={() => dispatch(logout())}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
