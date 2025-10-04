export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidAt?: string;
  notes?: string;
  transactionId?: string;
}

export type ThemePreference = 'light' | 'dark' | 'system';

export interface Preferences {
  theme: ThemePreference;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  themePreference?: ThemePreference;
}

export interface FinanceSnapshot {
  transactions: Transaction[];
  bills: Bill[];
  preferences: Preferences;
  user?: User;
  updatedAt: string;
}
