import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/formatUtils';

interface BalanceCardProps {
  income: number;
  expenses: number;
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ income, expenses, balance }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Income
            </h3>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-success" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(income)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Expenses
            </h3>
            <div className="flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-danger" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(expenses)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Current Balance
            </h3>
            <div className="flex items-center">
              <span className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;