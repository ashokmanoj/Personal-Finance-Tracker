import React, { useState, useMemo } from 'react';
import { Download, FileText } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionsContext';
import DateRangeSelector from '../components/reports/DateRangeSelector';
import SummaryCards from '../components/reports/SummaryCards';
import IncomeVsExpensesChart from '../components/reports/IncomeVsExpensesChart';
import CategoryBreakdownTable from '../components/reports/CategoryBreakdownTable';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { DateRange, Transaction, CategorySummary, MonthlySummary } from '../types';
import { getCurrentMonthRange, formatDateRange } from '../utils/dateUtils';
import { getCategoryColor } from '../utils/categoryUtils';
import { exportToPDF } from '../utils/exportUtils';

const Reports: React.FC = () => {
  const { transactions } = useTransactions();
  const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange());

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      // Set time to midnight for accurate comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions, dateRange]);

  // Calculate income, expenses, and balance
  const financialSummary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [filteredTransactions]);

  // Calculate category summaries for expenses
  const expensesByCategory = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categorySums = expenseTransactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
    
    const summaries: CategorySummary[] = Object.entries(categorySums).map(([category, amount]) => ({
      category: category as any,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: getCategoryColor(category as any)
    }));
    
    return summaries.sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  // Calculate category summaries for income
  const incomeByCategory = useMemo(() => {
    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categorySums = incomeTransactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
    
    const summaries: CategorySummary[] = Object.entries(categorySums).map(([category, amount]) => ({
      category: category as any,
      amount,
      percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
      color: getCategoryColor(category as any)
    }));
    
    return summaries.sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  // Group transactions by month for the chart
  const monthlySummaries = useMemo(() => {
    const months: Record<string, MonthlySummary> = {};
    
    filteredTransactions.forEach(transaction => {
      const monthKey = transaction.date.substring(0, 7);
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: monthKey,
          income: 0,
          expense: 0,
          balance: 0
        };
      }
      
      if (transaction.type === 'income') {
        months[monthKey].income += transaction.amount;
      } else {
        months[monthKey].expense += transaction.amount;
      }
      
      months[monthKey].balance = months[monthKey].income - months[monthKey].expense;
    });
    
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredTransactions]);

  const handleExportPDF = async () => {
    await exportToPDF('report-content', 'financial_report');
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
          onClick={handleExportPDF}
        >
          Export PDF
        </Button>
      </div>
      
      <DateRangeSelector dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <div id="report-content" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Financial Report: {formatDateRange(dateRange.startDate, dateRange.endDate)}
            </h2>
            
            <SummaryCards
              income={financialSummary.income}
              expenses={financialSummary.expenses}
              balance={financialSummary.balance}
            />
          </CardContent>
        </Card>
        
        <IncomeVsExpensesChart data={monthlySummaries} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBreakdownTable 
            categories={expensesByCategory} 
            title="Expense Breakdown" 
          />
          
          <CategoryBreakdownTable 
            categories={incomeByCategory} 
            title="Income Sources" 
          />
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-gray-500 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transaction Summary
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="font-medium text-gray-900 dark:text-white">Total Transactions</span>
                <span className="text-gray-900 dark:text-white">{filteredTransactions.length}</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="font-medium text-gray-900 dark:text-white">Income Transactions</span>
                <span className="text-gray-900 dark:text-white">
                  {filteredTransactions.filter(t => t.type === 'income').length}
                </span>
              </div>
              
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="font-medium text-gray-900 dark:text-white">Expense Transactions</span>
                <span className="text-gray-900 dark:text-white">
                  {filteredTransactions.filter(t => t.type === 'expense').length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Recurring Transactions</span>
                <span className="text-gray-900 dark:text-white">
                  {filteredTransactions.filter(t => t.isRecurring).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;