 codex/create-page-components-for-transactions
export type TransactionKind = 'entrada' | 'saida';

export interface TransactionFormInput {
  category: string;
  amountInCents: number;
  date: string;
  description: string;
  account: string;
  billId?: string;
}

export interface Transaction extends TransactionFormInput {
  id: string;
  kind: TransactionKind;
  createdAt: string;
}

export type BillStatus = 'pending' | 'paid';

export interface Bill {
  id: string;
  description: string;
  amountInCents: number;
  dueDate: string;
  status: BillStatus;
  account: string;

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
 dev
}
