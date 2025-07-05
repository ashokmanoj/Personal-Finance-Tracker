import { TransactionCategory } from '../types';

export const categoryOptions: { value: TransactionCategory; label: string; type: 'income' | 'expense' }[] = [
  // Income categories
  { value: 'salary', label: 'Salary', type: 'income' },
  { value: 'freelance', label: 'Freelance', type: 'income' },
  { value: 'investments', label: 'Investments', type: 'income' },
  { value: 'other_income', label: 'Other Income', type: 'income' },
  
  // Expense categories
  { value: 'housing', label: 'Housing', type: 'expense' },
  { value: 'transportation', label: 'Transportation', type: 'expense' },
  { value: 'food', label: 'Food & Dining', type: 'expense' },
  { value: 'utilities', label: 'Utilities', type: 'expense' },
  { value: 'healthcare', label: 'Healthcare', type: 'expense' },
  { value: 'entertainment', label: 'Entertainment', type: 'expense' },
  { value: 'shopping', label: 'Shopping', type: 'expense' },
  { value: 'education', label: 'Education', type: 'expense' },
  { value: 'personal_care', label: 'Personal Care', type: 'expense' },
  { value: 'travel', label: 'Travel', type: 'expense' },
  { value: 'debt', label: 'Debt Payments', type: 'expense' },
  { value: 'savings', label: 'Savings & Investments', type: 'expense' },
  { value: 'gifts_donations', label: 'Gifts & Donations', type: 'expense' },
  { value: 'other_expense', label: 'Other Expenses', type: 'expense' },
];

export const getCategoryLabel = (category: TransactionCategory): string => {
  const found = categoryOptions.find(option => option.value === category);
  return found ? found.label : 'Unknown';
};

export const getCategoryIcon = (category: TransactionCategory): string => {
  switch (category) {
    // Income icons
    case 'salary': return 'briefcase';
    case 'freelance': return 'laptop';
    case 'investments': return 'trending-up';
    case 'other_income': return 'plus-circle';
    
    // Expense icons
    case 'housing': return 'home';
    case 'transportation': return 'car';
    case 'food': return 'utensils';
    case 'utilities': return 'zap';
    case 'healthcare': return 'activity';
    case 'entertainment': return 'film';
    case 'shopping': return 'shopping-bag';
    case 'education': return 'book';
    case 'personal_care': return 'user';
    case 'travel': return 'map';
    case 'debt': return 'credit-card';
    case 'savings': return 'piggy-bank';
    case 'gifts_donations': return 'gift';
    case 'other_expense': return 'more-horizontal';
    
    default: return 'help-circle';
  }
};

export const getCategoryColor = (category: TransactionCategory): string => {
  switch (category) {
    // Income colors
    case 'salary': return '#4CAF50';
    case 'freelance': return '#8BC34A';
    case 'investments': return '#009688';
    case 'other_income': return '#2E7D32';
    
    // Expense colors
    case 'housing': return '#E91E63';
    case 'transportation': return '#9C27B0';
    case 'food': return '#FF9800';
    case 'utilities': return '#F44336';
    case 'healthcare': return '#3F51B5';
    case 'entertainment': return '#673AB7';
    case 'shopping': return '#FF5722';
    case 'education': return '#2196F3';
    case 'personal_care': return '#795548';
    case 'travel': return '#607D8B';
    case 'debt': return '#D32F2F';
    case 'savings': return '#00BCD4';
    case 'gifts_donations': return '#FFC107';
    case 'other_expense': return '#9E9E9E';
    
    default: return '#9E9E9E';
  }
};

export const getFilteredCategories = (type: 'income' | 'expense') => {
  return categoryOptions.filter(category => category.type === type);
};