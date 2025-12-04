import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionsContext';
import BudgetForm from '../components/budget/BudgetForm';
import BudgetOverview from '../components/budget/BudgetOverview';
import BudgetList from '../components/budget/BudgetList';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Budget, BudgetCategory } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { getCurrentMonth, getMonthRange } from '../utils/dateUtils';

const BudgetPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Find current month's budget or create a placeholder
  useEffect(() => {
    const currentMonth = getCurrentMonth();
    const currentBudget = budgets.find(budget => budget.month === currentMonth);
    
    if (currentBudget) {
      setSelectedBudget(currentBudget);
    } else if (budgets.length > 0) {
      // Select the most recent budget
      const sortedBudgets = [...budgets].sort((a, b) => b.month.localeCompare(a.month));
      setSelectedBudget(sortedBudgets[0]);
    }
  }, [budgets]);

  // Update budget spent amounts based on transactions
  useEffect(() => {
    if (budgets.length === 0) return;
    
    const updatedBudgets = budgets.map(budget => {
      const { startDate, endDate } = getMonthRange(budget.month);
      
      // Filter transactions for this budget's month
      const budgetTransactions = transactions.filter(transaction => {
        return transaction.type === 'expense' && 
               transaction.date >= startDate && 
               transaction.date <= endDate;
      });
      
      // Calculate spent amount for each category
      const categorySpent: Record<string, number> = {};
      budgetTransactions.forEach(transaction => {
        const { category, amount } = transaction;
        categorySpent[category] = (categorySpent[category] || 0) + amount;
      });
      
      // Update categories with spent amounts
      const updatedCategories = budget.categories.map(category => {
        const spent = categorySpent[category.category] || 0;
        return {
          ...category,
          spent,
          remaining: category.budgeted - spent,
          percentage: category.budgeted > 0 ? (spent / category.budgeted) * 100 : 0
        };
      });
      
      const totalSpent = updatedCategories.reduce((sum, cat) => sum + cat.spent, 0);
      
      return {
        ...budget,
        totalSpent,
        categories: updatedCategories
      };
    });
    
    setBudgets(updatedBudgets);
  }, [transactions, setBudgets]);

  const handleAddBudget = (budget: Budget) => {
    // Check if budget for this month already exists
    const existingIndex = budgets.findIndex(b => b.month === budget.month);
    
    if (existingIndex >= 0) {
      // Update existing budget
      const updatedBudgets = [...budgets];
      updatedBudgets[existingIndex] = budget;
      setBudgets(updatedBudgets);
    } else {
      // Add new budget
      setBudgets([...budgets, budget]);
    }
    
    setShowAddBudget(false);
    setSelectedBudget(budget);
  };

  const handleUpdateBudget = (budget: Budget) => {
    const updatedBudgets = budgets.map(b => 
      b.id === budget.id ? budget : b
    );
    
    setBudgets(updatedBudgets);
    setEditingBudget(null);
    setSelectedBudget(budget);
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      const updatedBudgets = budgets.filter(budget => budget.id !== id);
      setBudgets(updatedBudgets);
      
      if (selectedBudget?.id === id) {
        setSelectedBudget(updatedBudgets.length > 0 ? updatedBudgets[0] : null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget</h1>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setShowAddBudget(true)}
        >
          Create Budget
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedBudget ? (
            <BudgetOverview 
              budget={selectedBudget} 
              onEdit={() => setEditingBudget(selectedBudget)} 
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You haven't created a budget yet. Create your first budget to start tracking your spending.
                </p>
                <Button
                  variant="primary"
                  leftIcon={<Plus size={16} />}
                  onClick={() => setShowAddBudget(true)}
                >
                  Create Budget
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <BudgetList
            budgets={budgets}
            onSelect={setSelectedBudget}
            onEdit={setEditingBudget}
            onDelete={handleDeleteBudget}
          />
        </div>
      </div>
      
      {/* Add budget modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-0">
              <BudgetForm
                onSubmit={handleAddBudget}
                onCancel={() => setShowAddBudget(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Edit budget modal */}
      {editingBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-8">
            <CardContent className="p-0">
              <BudgetForm
                initialData={editingBudget}
                isEditing={true}
                onSubmit={handleUpdateBudget}
                onCancel={() => setEditingBudget(null)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;