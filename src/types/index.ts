export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'salary' 
  | 'freelance' 
  | 'investments' 
  | 'other_income'
  | 'housing' 
  | 'transportation' 
  | 'food' 
  | 'utilities' 
  | 'healthcare'
  | 'entertainment' 
  | 'shopping' 
  | 'education' 
  | 'personal_care'
  | 'travel' 
  | 'debt' 
  | 'savings' 
  | 'gifts_donations'
  | 'other_expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: string; // ISO date string
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags?: string[];
}

export interface CategorySummary {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlySummary {
  month: string; // Format: YYYY-MM
  income: number;
  expense: number;
  balance: number;
}

export interface YearlySummary {
  year: string; // Format: YYYY
  income: number;
  expense: number;
  balance: number;
  monthlySummaries: MonthlySummary[];
}

export interface BudgetCategory {
  category: TransactionCategory;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface Budget {
  id: string;
  month: string; // Format: YYYY-MM
  totalBudgeted: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

export interface DateRange {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  isLoading: boolean;
  error: Error | null;
}