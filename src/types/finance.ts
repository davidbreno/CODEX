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
  updatedAt?: string;
}

export type BillStatus = 'pendente' | 'pago';

export interface Bill {
  id: string;
  description: string;
  amountInCents: number;
  dueDate: string;
  status: BillStatus;
  account: string;
  paidAt?: string;
  transactionId?: string;
  notes?: string;
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
