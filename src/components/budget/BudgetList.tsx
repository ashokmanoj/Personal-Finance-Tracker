import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Budget } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatUtils';
import { getMonthNameFromString } from '../../utils/dateUtils';

interface BudgetListProps {
  budgets: Budget[];
  onSelect: (budget: Budget) => void;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({
  budgets,
  onSelect,
  onEdit,
  onDelete,
}) => {
  // Sort budgets by month (newest first)
  const sortedBudgets = [...budgets].sort((a, b) => b.month.localeCompare(a.month));

  return (
    <Card className='pb-4'>
      <CardHeader>
        <CardTitle>Your Budgets</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedBudgets.length > 0 ? (
          <div className="space-y-4">
            {sortedBudgets.map((budget) => {
              const spentPercentage = budget.totalBudgeted > 0 
                ? (budget.totalSpent / budget.totalBudgeted) * 100 
                : 0;
              
              return (
                <div 
                  key={budget.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => onSelect(budget)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {getMonthNameFromString(budget.month)} Budget
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(budget);
                        }}
                        className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(budget.id);
                        }}
                        className="p-1 text-gray-500 hover:text-danger rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatCurrency(budget.totalSpent)} of {formatCurrency(budget.totalBudgeted)}
                    </span>
                    <span className={`font-medium ${
                      spentPercentage > 100 
                        ? 'text-danger' 
                        : spentPercentage > 80 
                          ? 'text-warning' 
                          : 'text-success'
                    }`}>
                      {formatPercentage(spentPercentage)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        spentPercentage > 100 
                          ? 'bg-danger' 
                          : spentPercentage > 80 
                            ? 'bg-warning' 
                            : 'bg-success'
                      }`}
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">
              No budgets created yet. Create your first budget to start tracking your spending.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetList;