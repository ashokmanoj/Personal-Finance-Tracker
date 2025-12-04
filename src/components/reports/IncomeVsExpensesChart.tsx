import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { MonthlySummary } from '../../types';
import { formatCurrency } from '../../utils/formatUtils';
import { getMonthNameFromString } from '../../utils/dateUtils';

interface IncomeVsExpensesChartProps {
  data: MonthlySummary[];
}

const IncomeVsExpensesChart: React.FC<IncomeVsExpensesChartProps> = ({ data }) => {
  // Prepare data for the chart
  const chartData = data.map(month => ({
    name: getMonthNameFromString(month.month).substring(0, 3) + ' ' + month.month.substring(2, 4),
    Income: month.income,
    Expenses: month.expense,
    Balance: month.balance,
    month: month.month // Keep original month string for sorting
  })).sort((a, b) => a.month.localeCompare(b.month));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value, undefined).replace(/[^0-9.]/g, '')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Income" 
                  stroke="#4CAF50" 
                  strokeWidth={8}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Expenses" 
                  stroke="#F44336" 
                  strokeWidth={6}
                />
                <Line 
                  type="monotone" 
                  dataKey="Balance" 
                  stroke="#2196F3" 
                  strokeWidth={4}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No data available for the selected period</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeVsExpensesChart;