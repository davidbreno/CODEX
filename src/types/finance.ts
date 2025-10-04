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
}
