import React from 'react';
import { Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Budget } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatUtils';
import { getMonthNameFromString } from '../../utils/dateUtils';
import Button from '../ui/Button';

interface BudgetOverviewProps {
  budget: Budget;
  onEdit: () => void;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budget, onEdit }) => {
  const { month, totalBudgeted, totalSpent, categories } = budget;
  
  const remainingBudget = totalBudgeted - totalSpent;
  const spentPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  
  // Sort categories by percentage spent (highest first)
  const sortedCategories = [...categories].sort((a, b) => b.percentage - a.percentage);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{getMonthNameFromString(month)} Budget</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {spentPercentage > 100 
              ? 'Budget exceeded' 
              : `${formatPercentage(spentPercentage)} of budget used`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Edit size={16} />}
          onClick={onEdit}
        >
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(totalBudgeted)}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining</p>
              <p className={`text-2xl font-bold mt-1 ${
                remainingBudget >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {formatCurrency(remainingBudget)}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Category Breakdown
            </h3>
            
            <div className="space-y-4">
              {sortedCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {category.category.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </p>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
                      </p>
                      <p className={`text-xs ${
                        category.percentage > 100 
                          ? 'text-danger' 
                          : category.percentage > 80 
                            ? 'text-warning' 
                            : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatPercentage(category.percentage)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        category.percentage > 100 
                          ? 'bg-danger' 
                          : category.percentage > 80 
                            ? 'bg-warning' 
                            : 'bg-success'
                      }`}
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;