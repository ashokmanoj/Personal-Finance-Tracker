import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { CategorySummary } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatUtils';
import { getCategoryLabel } from '../../utils/categoryUtils';

interface CategoryBreakdownTableProps {
  categories: CategorySummary[];
  title: string;
}

const CategoryBreakdownTable: React.FC<CategoryBreakdownTableProps> = ({ 
  categories,
  title
}) => {
  // Sort categories by amount (highest first)
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
  
  // Calculate total
  const total = categories.reduce((sum, category) => sum + category.amount, 0);

  return (
    <Card className='pb-7'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                  <th className="pb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="pb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.map((category, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {getCategoryLabel(category.category)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {formatCurrency(category.amount)}
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {formatPercentage(category.percentage)}
                    </td>
                  </tr>
                ))}
                {/* <hr className='w-full  border-gray-200 dark:border-gray-700'/> */}
                <tr className="font-medium">
                  <td className="py-3 text-sm text-gray-900 dark:text-white">Total</td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {formatCurrency(total)}
                  </td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">
              No data available for the selected period
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdownTable;