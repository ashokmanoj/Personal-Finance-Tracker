import { useMemo } from 'react';
import { Transaction, CategorySummary, MonthlySummary, YearlySummary } from '../types';
import { getCategoryColor } from '../utils/categoryUtils';
import { formatMonth, formatYear, parseDate } from '../utils/dateUtils';

export const useTransactionStats = (transactions: Transaction[]) => {
  // Calculate total income, expenses, and balance
  const totals = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions]);

  // Calculate category summaries for expenses
  const expensesByCategory = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
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
  }, [transactions]);

  // Calculate monthly summaries
  const monthlySummaries = useMemo(() => {
    const months: Record<string, MonthlySummary> = {};
    
    transactions.forEach(transaction => {
      const date = parseDate(transaction.date);
      const monthKey = formatMonth(date);
      
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
  }, [transactions]);

  // Calculate yearly summaries
  const yearlySummaries = useMemo(() => {
    const years: Record<string, YearlySummary> = {};
    
    monthlySummaries.forEach(monthly => {
      const yearKey = monthly.month.substring(0, 4);
      
      if (!years[yearKey]) {
        years[yearKey] = {
          year: yearKey,
          income: 0,
          expense: 0,
          balance: 0,
          monthlySummaries: []
        };
      }
      
      years[yearKey].income += monthly.income;
      years[yearKey].expense += monthly.expense;
      years[yearKey].balance = years[yearKey].income - years[yearKey].expense;
      years[yearKey].monthlySummaries.push(monthly);
    });
    
    return Object.values(years).sort((a, b) => a.year.localeCompare(b.year));
  }, [monthlySummaries]);

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  return {
    totals,
    expensesByCategory,
    monthlySummaries,
    yearlySummaries,
    recentTransactions
  };
};