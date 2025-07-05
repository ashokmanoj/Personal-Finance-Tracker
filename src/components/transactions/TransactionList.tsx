import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { Transaction, TransactionType, TransactionCategory } from '../../types';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { getCategoryLabel } from '../../utils/categoryUtils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search term filter
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (sortField === 'description') {
      return sortDirection === 'asc'
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    }
    
    return 0;
  });

  const toggleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: keyof Transaction) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={16} />}
          className="sm:max-w-xs"
        />
        
        <Button
          variant="outline"
          leftIcon={<Filter size={16} />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Select
            label="Type"
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          
          <Select
            label="Category"
            options={[
              { value: 'all', label: 'All Categories' },
              ...transactions
                .map(t => t.category)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map(category => ({
                  value: category,
                  label: getCategoryLabel(category),
                })),
            ]}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>
      )}
      
      {sortedTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => toggleSort('date')}
                  >
                    Date {getSortIcon('date')}
                  </button>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => toggleSort('description')}
                  >
                    Description {getSortIcon('description')}
                  </button>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => toggleSort('amount')}
                  >
                    Amount {getSortIcon('amount')}
                  </button>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {formatDateForDisplay(transaction.date)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </span>
                      {transaction.isRecurring && (
                        <Badge variant="info" size="sm" className="mt-1 w-fit">
                          Recurring
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {getCategoryLabel(transaction.category)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    <span className={transaction.type === 'income' ? 'text-success' : 'text-danger'}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-1 text-gray-500 hover:text-danger rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<Search size={48} />}
          title="No transactions found"
          description={
            transactions.length > 0
              ? "Try adjusting your search or filters to find what you're looking for."
              : "You haven't added any transactions yet."
          }
        />
      )}
    </div>
  );
};

export default TransactionList;