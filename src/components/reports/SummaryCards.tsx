import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, IndianRupee } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/formatUtils';

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
  previousIncome?: number;
  previousExpenses?: number;
  previousBalance?: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  income,
  expenses,
  balance,
  previousIncome,
  previousExpenses,
  previousBalance,
}) => {
  // Calculate percentage changes
  const calculateChange = (current: number, previous?: number): number => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  const incomeChange = calculateChange(income, previousIncome);
  const expensesChange = calculateChange(expenses, previousExpenses);
  const balanceChange = calculateChange(balance, previousBalance);
  
  // Format percentage change
  const formatChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Income
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(income)}
              </p>
              
              {previousIncome !== undefined && (
                <div className={`flex items-center mt-2 text-sm ${
                  incomeChange > 0 ? 'text-success' : incomeChange < 0 ? 'text-danger' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {incomeChange > 0 ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : incomeChange < 0 ? (
                    <TrendingDown size={16} className="mr-1" />
                  ) : null}
                  <span>{formatChange(incomeChange)} from previous period</span>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-success/10 rounded-full">
              <TrendingUp size={24} className="text-success" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(expenses)}
              </p>
              
              {previousExpenses !== undefined && (
                <div className={`flex items-center mt-2 text-sm ${
                  expensesChange < 0 ? 'text-success' : expensesChange > 0 ? 'text-danger' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {expensesChange < 0 ? (
                    <TrendingDown size={16} className="mr-1" />
                  ) : expensesChange > 0 ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : null}
                  <span>{formatChange(expensesChange)} from previous period</span>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-danger/10 rounded-full">
              <TrendingDown size={24} className="text-danger" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Net Balance
              </p>
              <p className={`text-2xl font-bold mt-1 ${
                balance >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {formatCurrency(balance)}
              </p>
              
              {previousBalance !== undefined && (
                <div className={`flex items-center mt-2 text-sm ${
                  balanceChange > 0 ? 'text-success' : balanceChange < 0 ? 'text-danger' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {balanceChange > 0 ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : balanceChange < 0 ? (
                    <TrendingDown size={16} className="mr-1" />
                  ) : null}
                  <span>{formatChange(balanceChange)} from previous period</span>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-info/10 rounded-full">
              <IndianRupee size={24} className="text-info" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;