import React from 'react';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { getCategoryLabel } from '../../utils/categoryUtils';
import Button from '../ui/Button';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions,
  onAddTransaction
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button 
          variant="primary" 
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={onAddTransaction}
        >
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-danger/10 text-danger'
                  }`}>
                    {transaction.type === 'income' 
                      ? <ArrowUpRight size={18} /> 
                      : <ArrowDownRight size={18} />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{getCategoryLabel(transaction.category)}</span>
                      <span className="mx-1">•</span>
                      <span>{formatDateForDisplay(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                <div className={`font-medium ${
                  transaction.type === 'income' 
                    ? 'text-success' 
                    : 'text-danger'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} 
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No transactions yet. Add your first transaction to get started.
            </p>
            <Button 
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={onAddTransaction}
            >
              Add Transaction
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;