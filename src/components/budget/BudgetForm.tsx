import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Budget, BudgetCategory, TransactionCategory } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { getFilteredCategories } from '../../utils/categoryUtils';
import { getCurrentMonth, getMonthNameFromString } from '../../utils/dateUtils';

interface BudgetFormProps {
  onSubmit: (budget: Budget) => void;
  onCancel: () => void;
  initialData?: Budget;
  isEditing?: boolean;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}) => {
  const [month, setMonth] = useState(initialData?.month || getCurrentMonth());
  const [categories, setCategories] = useState<BudgetCategory[]>(
    initialData?.categories || 
    getFilteredCategories('expense').map(cat => ({
      category: cat.value as TransactionCategory,
      budgeted: 0,
      spent: 0,
      remaining: 0,
      percentage: 0
    }))
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate month options for the next 12 months
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthStr = date.toISOString().substring(0, 7);
      options.push({
        value: monthStr,
        label: getMonthNameFromString(monthStr) + ' ' + monthStr.substring(0, 4),
      });
    }
    
    return options;
  };

  const handleCategoryBudgetChange = (category: TransactionCategory, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    
    setCategories(prev => 
      prev.map(cat => 
        cat.category === category 
          ? { 
              ...cat, 
              budgeted: numAmount,
              remaining: numAmount - cat.spent,
              percentage: cat.spent > 0 ? (cat.spent / numAmount) * 100 : 0
            } 
          : cat
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!month) {
      newErrors.month = 'Please select a month';
    }
    
    const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
    if (totalBudgeted <= 0) {
      newErrors.total = 'Total budget must be greater than zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    
    const budget: Budget = {
      id: initialData?.id || Date.now().toString(),
      month,
      totalBudgeted,
      totalSpent,
      categories: categories.filter(cat => cat.budgeted > 0),
    };
    
    onSubmit(budget);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Budget' : 'Create Budget'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      <div className="space-y-4">
        <Select
          label="Month"
          options={generateMonthOptions()}
          value={month}
          onChange={setMonth}
          error={errors.month}
        />
        
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b">
            <h3 className="font-medium text-gray-900 dark:text-white">Category Budgets</h3>
          </div>
          
          <div className="p-4 space-y-4">
            {categories
              .filter(cat => getFilteredCategories('expense').some(c => c.value === cat.category))
              .map((category) => (
                <div key={category.category} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getFilteredCategories('expense').find(c => c.value === category.category)?.label}
                    </label>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={category.budgeted.toString()}
                      onChange={(e) => handleCategoryBudgetChange(category.category, e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {errors.total && (
          <p className="text-sm text-danger">{errors.total}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? 'Update' : 'Create'} Budget
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;