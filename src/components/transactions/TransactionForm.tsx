import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Transaction, TransactionType, TransactionCategory } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { getFilteredCategories } from '../../utils/categoryUtils';
import { formatDate } from '../../utils/dateUtils';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  initialData?: Transaction;
  isEditing?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}) => {
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState<TransactionCategory>(initialData?.category || 'other_expense');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || formatDate(new Date()));
  const [isRecurring, setIsRecurring] = useState(initialData?.isRecurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState(initialData?.recurringFrequency || 'monthly');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update category options when transaction type changes
  useEffect(() => {
    if (type === 'income' && !getFilteredCategories('income').some(c => c.value === category)) {
      setCategory('salary');
    } else if (type === 'expense' && !getFilteredCategories('expense').some(c => c.value === category)) {
      setCategory('other_expense');
    }
  }, [type, category]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    if (!date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const transaction: Omit<Transaction, 'id'> = {
      type,
      amount: Number(amount),
      category,
      description,
      date,
      isRecurring,
      ...(isRecurring && { recurringFrequency }),
    };
    
    onSubmit(transaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Select
            label="Transaction Type"
            options={[
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
            value={type}
            onChange={(value) => setType(value as TransactionType)}
          />
        </div>
        
        <Input
          label="Amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          placeholder="0.00"
        />
        
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          rightIcon={<Calendar size={16} />}
        />
        
        <div className="md:col-span-2">
          <Select
            label="Category"
            options={getFilteredCategories(type).map(cat => ({
              value: cat.value,
              label: cat.label,
            }))}
            value={category}
            onChange={(value) => setCategory(value as TransactionCategory)}
          />
        </div>
        
        <div className="md:col-span-2">
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            placeholder="Enter a description"
          />
        </div>
        
        <div className="md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id="isRecurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            This is a recurring transaction
          </label>
        </div>
        
        {isRecurring && (
          <div className="md:col-span-2">
            <Select
              label="Frequency"
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              value={recurringFrequency}
              onChange={setRecurringFrequency}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;