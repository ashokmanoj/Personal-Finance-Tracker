import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionsContext';
import { useTransactionStats } from '../hooks/useTransactionStats';
import BalanceCard from '../components/dashboard/BalanceCard';
import ExpensesByCategoryChart from '../components/dashboard/ExpensesByCategoryChart';
import MonthlyTrendsChart from '../components/dashboard/MonthlyTrendsChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import TransactionForm from '../components/transactions/TransactionForm';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Transaction } from '../types';

const Dashboard: React.FC = () => {
  const { transactions, addTransaction } = useTransactions();
  const { totals, expensesByCategory, monthlySummaries, recentTransactions } = useTransactionStats(transactions);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    setShowAddTransaction(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setShowAddTransaction(true)}
        >
          Add Transaction
        </Button>
      </div>
      
      {/* Balance summary */}
      <BalanceCard 
        income={totals.income} 
        expenses={totals.expenses} 
        balance={totals.balance} 
      />
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensesByCategoryChart data={expensesByCategory} />
        <MonthlyTrendsChart data={monthlySummaries} />
      </div>
      
      {/* Recent transactions */}
      <RecentTransactions 
        transactions={recentTransactions} 
        onAddTransaction={() => setShowAddTransaction(true)} 
      />
      
      {/* Add transaction modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-0">
              <TransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setShowAddTransaction(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;