import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { CategorySummary } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatUtils';
import { getCategoryLabel } from '../../utils/categoryUtils';

interface ExpensesByCategoryChartProps {
  data: CategorySummary[];
}

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ data }) => {
  // Prepare data for the chart
  const chartData = useMemo(() => {
    // Sort by amount descending
    const sortedData = [...data].sort((a, b) => b.amount - a.amount);
    
    // Take top 5 categories, group the rest as "Other"
    if (sortedData.length > 5) {
      const topCategories = sortedData.slice(0, 5);
      const otherCategories = sortedData.slice(5);
      
      const otherAmount = otherCategories.reduce((sum, category) => sum + category.amount, 0);
      const otherPercentage = otherCategories.reduce((sum, category) => sum + category.percentage, 0);
      
      return [
        ...topCategories,
        {
          category: 'other_expense',
          amount: otherAmount,
          percentage: otherPercentage,
          color: '#9E9E9E'
        }
      ];
    }
    
    return sortedData;
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{getCategoryLabel(data.category)}</p>
          <p className="text-gray-600 dark:text-gray-400">{formatCurrency(data.amount)}</p>
          <p className="text-gray-600 dark:text-gray-400">{formatPercentage(data.percentage)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  dataKey="amount"
                  nameKey="category"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => getCategoryLabel(value as any)}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategoryChart;