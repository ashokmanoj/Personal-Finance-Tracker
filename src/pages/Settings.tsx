import React, { useState } from 'react';
import { Download, Upload, Trash2, Moon, Sun, FileText } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionsContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { exportToCSV } from '../utils/exportUtils';

const Settings: React.FC = () => {
  const { transactions, addTransaction } = useTransactions();
  const { theme, toggleTheme } = useTheme();
  const [importError, setImportError] = useState<string | null>(null);

  const handleExportData = () => {
    exportToCSV(transactions);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        
        // Skip header row
        if (lines.length < 2) {
          throw new Error('Invalid CSV format');
        }
        
        const headers = lines[0].split(',');
        const dateIndex = headers.indexOf('Date');
        const typeIndex = headers.indexOf('Type');
        const categoryIndex = headers.indexOf('Category');
        const descriptionIndex = headers.indexOf('Description');
        const amountIndex = headers.indexOf('Amount');
        const recurringIndex = headers.indexOf('Recurring');
        
        if (dateIndex === -1 || typeIndex === -1 || categoryIndex === -1 || 
            descriptionIndex === -1 || amountIndex === -1) {
          throw new Error('Missing required columns in CSV');
        }
        
        // Process data rows
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          
          // Parse date (assuming MM/DD/YYYY format)
          const dateParts = values[dateIndex].split('/');
          const dateStr = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
          
          const transaction = {
            type: values[typeIndex] as 'income' | 'expense',
            amount: parseFloat(values[amountIndex]),
            category: values[categoryIndex].toLowerCase().replace(' ', '_') as any,
            description: values[descriptionIndex],
            date: dateStr,
            isRecurring: recurringIndex !== -1 ? values[recurringIndex] === 'Yes' : false,
          };
          
          addTransaction(transaction);
        }
        
        setImportError(null);
        alert('Data imported successfully!');
      } catch (error) {
        console.error('Import error:', error);
        setImportError('Failed to import data. Please check the CSV format.');
      }
    };
    
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your transaction data? This action cannot be undone.')) {
      localStorage.removeItem('transactions');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose between light and dark mode
                </p>
              </div>
              <Button
                variant="outline"
                leftIcon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Export Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Download your transaction data as a CSV file
              </p>
              <Button
                variant="outline"
                leftIcon={<Download size={16} />}
                onClick={handleExportData}
                disabled={transactions.length === 0}
              >
                Export to CSV
              </Button>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Import Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Import transaction data from a CSV file
              </p>
              <div className="flex items-center">
                <input
                  type="file"
                  accept=".csv"
                  id="import-file"
                  className="hidden"
                  onChange={handleImportData}
                />
                <label htmlFor="import-file">
                  <Button
                    variant="outline"
                    leftIcon={<Upload size={16} />}
                    onClick={() => document.getElementById('import-file')?.click()}
                    type="button"
                  >
                    Import from CSV
                  </Button>
                </label>
              </div>
              {importError && (
                <p className="mt-2 text-sm text-danger">{importError}</p>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Clear Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Delete all your transaction data (this cannot be undone)
              </p>
              <Button
                variant="danger"
                leftIcon={<Trash2 size={16} />}
                onClick={handleClearData}
              >
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <FileText size={20} className="text-gray-500 dark:text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Personal Finance Tracker</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Version 1.0.0
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                A simple, privacy-focused finance tracker that helps you manage your income, expenses, and budget.
                All your data is stored locally in your browser.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;