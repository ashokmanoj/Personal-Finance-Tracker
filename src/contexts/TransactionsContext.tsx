import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionsContextType } from '../types';

type TransactionsState = {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
};

type TransactionsAction =
  | { type: 'LOADING' }
  | { type: 'LOADED'; payload: Transaction[] }
  | { type: 'ERROR'; payload: Error }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; transaction: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: string };

const initialState: TransactionsState = {
  transactions: [],
  isLoading: true,
  error: null,
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

const transactionsReducer = (state: TransactionsState, action: TransactionsAction): TransactionsState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true };
    case 'LOADED':
      return { ...state, transactions: action.payload, isLoading: false, error: null };
    case 'ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload.transaction }
            : transaction
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload),
      };
    default:
      return state;
  }
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionsReducer, initialState);

  // Load transactions from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'LOADING' });
    try {
      const savedTransactions = localStorage.getItem('transactions');
      if (savedTransactions) {
        dispatch({ type: 'LOADED', payload: JSON.parse(savedTransactions) });
      } else {
        dispatch({ type: 'LOADED', payload: [] });
      }
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error as Error });
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
    }
  }, [state.transactions, state.isLoading]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  }, []);

  const updateTransaction = useCallback((id: string, transaction: Partial<Omit<Transaction, 'id'>>) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, transaction } });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions: state.transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isLoading: state.isLoading,
        error: state.error,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = (): TransactionsContextType => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};