import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CreditCard, BarChart2, PieChart, Settings } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex flex-col items-center justify-center py-2 text-xs ${
      isActive 
        ? 'text-primary' 
        : 'text-gray-600 dark:text-gray-400'
    }`;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        <NavLink to="/" className={navLinkClass}>
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/transactions" className={navLinkClass}>
          <CreditCard size={20} />
          <span>Transactions</span>
        </NavLink>
        
        <NavLink to="/reports" className={navLinkClass}>
          <BarChart2 size={20} />
          <span>Reports</span>
        </NavLink>
        
        <NavLink to="/budget" className={navLinkClass}>
          <PieChart size={20} />
          <span>Budget</span>
        </NavLink>
        
        <NavLink to="/settings" className={navLinkClass}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileNav;