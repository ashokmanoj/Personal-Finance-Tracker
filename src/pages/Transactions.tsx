import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionsContext';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Transaction } from '../types';

const Transactions: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    setShowAddTransaction(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setShowAddTransaction(true)}
        >
          Add Transaction
        </Button>
      </div>
      
      {/* Transactions list */}
      <Card>
        <CardContent className="p-6">
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </CardContent>
      </Card>
      
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
      
      {/* Edit transaction modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-0">
              <TransactionForm
                initialData={editingTransaction}
                isEditing={true}
                onSubmit={handleUpdateTransaction}
                onCancel={() => setEditingTransaction(null)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Transactions;