export type ThemePreference = 'light' | 'dark' | 'system';

export interface Preferences {
  theme: ThemePreference;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferences?: Preferences;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amountInCents: number;
  date: string;
  description: string;
  account: string;
  createdAt: string;
  updatedAt?: string;
  billId?: string;
  notes?: string;
}

export type BillStatus = 'pending' | 'paid';

export interface Bill {
  id: string;
  description: string;
  amountInCents: number;
  dueDate: string;
  status: BillStatus;
  account: string;

export interface Preferences {
  theme: ThemePreference;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferences?: Preferences;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amountInCents: number;
  date: string;
  description: string;
  account: string;
  createdAt: string;
  updatedAt?: string;
  billId?: string;
export type TransactionType = 'income' | 'expense';
import type { TransactionInput as ApiTransactionInput, BillInput as ApiBillInput } from '../services/mockApi';

export type TransactionKind = 'entrada' | 'saida';

export interface TransactionDraft {
  category: string;
  description: string;
  account: string;
  date: string;
  value: number;
  billId?: string;
  notes?: string;
}

export interface Transaction extends TransactionDraft {
  id: string;
  userId: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export type TransactionInput = TransactionDraft &
  Pick<Transaction, 'userId' | 'type'> &
  Partial<Pick<Transaction, 'id' | 'createdAt' | 'updatedAt'>>;

export type BillStatus = 'pending' | 'paid';

export interface BillDraft {
  description: string;
  account: string;
  value: number;
  dueDate: string;
  userId: string;
  notes?: string;
  transactionId?: string;
}

export type BillStatus = 'pending' | 'paid';

export interface Bill {
  id: string;
  description: string;
  amountInCents: number;
  dueDate: string;
  status: BillStatus;
  account: string;
export interface Bill extends BillDraft {
  id: string;
  status: BillStatus;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  paidAt?: string;
  transactionId?: string;
  notes?: string;
}

export type BillInput = BillDraft &
  Partial<Pick<Bill, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'paidAt'>>;

export type ThemePreference = 'light' | 'dark' | 'system';

export interface Preferences {
  theme: ThemePreference;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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

export type TransactionInput = ApiTransactionInput;
export type BillInput = ApiBillInput;
