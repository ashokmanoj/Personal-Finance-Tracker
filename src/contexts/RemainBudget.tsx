import React, { createContext, useContext, useMemo } from "react";
import { useTransactions } from "./TransactionsContext";
import { getCurrentMonthRange } from "../utils/dateUtils";

interface FinancialSummary {
  income: number;
  expenses: number;
  balance: number;
}

interface RemainingBudgetContextType {
  financialSummary: FinancialSummary;
}

const RemainingBudgetContext = createContext<RemainingBudgetContextType | undefined>(undefined);

export const RemainingBudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { transactions } = useTransactions();
  const dateRange = getCurrentMonthRange();

  const financialSummary = useMemo(() => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const income = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };

  }, [transactions, dateRange]);

  return (
    <RemainingBudgetContext.Provider value={{ financialSummary }}>
      {children}
    </RemainingBudgetContext.Provider>
  );
};

export const useRemainingBudget = () => {
  const context = useContext(RemainingBudgetContext);
  if (!context) {
    throw new Error("useRemainingBudget must be used inside RemainingBudgetProvider");
  }
  return context;
};
