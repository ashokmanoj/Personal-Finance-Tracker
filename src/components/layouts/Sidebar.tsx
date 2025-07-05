import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  BarChart2, 
  PieChart, 
  Settings, 
  X,
  DollarSign
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { theme } = useTheme();
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary text-white' 
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
              <DollarSign size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinTrack</h1>
          </div>
          <button 
            onClick={closeSidebar}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavLink to="/" className={navLinkClass} onClick={closeSidebar}>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/transactions" className={navLinkClass} onClick={closeSidebar}>
            <CreditCard size={20} />
            <span>Transactions</span>
          </NavLink>
          
          <NavLink to="/reports" className={navLinkClass} onClick={closeSidebar}>
            <BarChart2 size={20} />
            <span>Reports</span>
          </NavLink>
          
          <NavLink to="/budget" className={navLinkClass} onClick={closeSidebar}>
            <PieChart size={20} />
            <span>Budget</span>
          </NavLink>
          
          <NavLink to="/settings" className={navLinkClass} onClick={closeSidebar}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
        
        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;