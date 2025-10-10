import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { generateId } from '../utils/format';

type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

interface FinanceContextValue {
  transactions: Transaction[];
  addTransaction: (type: TransactionType, amount: number, description: string, date?: string) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlySeries: Array<{ month: string; income: number; expense: number }>;
  latestTransactions: Transaction[];
}

const STORAGE_KEY = 'finance-david-transactions';

const demoTransactions: Transaction[] = [
  {
    id: generateId(),
    type: 'income',
    amount: 3200,
    description: 'Consultoria estratégica',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    type: 'income',
    amount: 1850,
    description: 'Procedimentos realizados',
    date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 740,
    description: 'Materiais e insumos',
    date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 420,
    description: 'Mensalidade de softwares',
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    createdAt: new Date().toISOString()
  }
];

function loadTransactions(): Transaction[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return demoTransactions;
  }

  try {
    const parsed = JSON.parse(stored) as Transaction[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn('Erro ao carregar transações, usando dados padrão.', error);
  }

  return demoTransactions;
}

function persistTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }): JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());

  const value = useMemo<FinanceContextValue>(() => {
    const addTransaction: FinanceContextValue['addTransaction'] = (type, amount, description, date) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        return;
      }

      const trimmedDescription = description.trim() || (type === 'income' ? 'Entrada registrada' : 'Saída registrada');
      const timestamp = new Date().toISOString();

      const transaction: Transaction = {
        id: generateId(),
        type,
        amount,
        description: trimmedDescription,
        date: date ? new Date(date).toISOString() : timestamp,
        createdAt: timestamp
      };

      setTransactions((prev) => {
        const updated = [...prev, transaction];
        persistTransactions(updated);
        return updated;
      });
    };

    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    const monthlySeries = Array.from({ length: 6 })
      .map((_, index) => {
        const reference = new Date();
        reference.setMonth(reference.getMonth() - (5 - index));
        const key = `${reference.getFullYear()}-${reference.getMonth()}`;
        const monthLabel = reference
          .toLocaleDateString('pt-BR', {
            month: 'short'
          })
          .replace('.', '');

        const monthTotals = transactions.reduce(
          (acc, transaction) => {
            const transactionDate = new Date(transaction.date);
            const transactionKey = `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;

            if (transactionKey === key) {
              if (transaction.type === 'income') {
                acc.income += transaction.amount;
              } else {
                acc.expense += transaction.amount;
              }
            }

            return acc;
          },
          { income: 0, expense: 0 }
        );

        return {
          month: monthLabel,
          income: monthTotals.income,
          expense: monthTotals.expense
        };
      });

    const latestTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);

    return {
      transactions,
      addTransaction,
      totalIncome: totals.income,
      totalExpense: totals.expense,
      balance: totals.income - totals.expense,
      monthlySeries,
      latestTransactions
    };
  }, [transactions]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceContextValue {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance deve ser utilizado dentro de FinanceProvider');
  }

  return context;
}
