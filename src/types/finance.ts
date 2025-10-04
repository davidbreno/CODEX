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
  paidAt?: string;
  notes?: string;
  transactionId?: string;
}
