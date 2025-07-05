import React from 'react';
import { Menu, Moon, Sun, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactions } from '../../contexts/TransactionsContext';
import { exportToCSV } from '../../utils/exportUtils';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  const { theme, toggleTheme } = useTheme();
  const { transactions } = useTransactions();

  const handleExport = () => {
    exportToCSV(transactions);
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Export data"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;