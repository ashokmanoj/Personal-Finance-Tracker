import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { MonthlySummary } from '../../types';
import { formatCurrency } from '../../utils/formatUtils';
import { getMonthNameFromString } from '../../utils/dateUtils';

interface MonthlyTrendsChartProps {
  data: MonthlySummary[];
}

const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({ data }) => {
  // Prepare data for the chart
  const chartData = data.map(month => ({
    name: getMonthNameFromString(month.month),
    Income: month.income,
    Expenses: month.expense,
    Balance: month.balance,
    month: month.month // Keep original month string for sorting
  })).sort((a, b) => a.month.localeCompare(b.month));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-yellow-100 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
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
        <CardTitle>Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="80%" height="100%" >
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 10,
                  left: 10,
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
                <Bar dataKey="Income" fill="#4CAF50" barSize={80}  />
                <Bar dataKey="Expenses" fill="#F44336" barSize={80} />
                <Bar dataKey="Balance" fill="#2196F3" barSize={80}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No monthly data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendsChart;