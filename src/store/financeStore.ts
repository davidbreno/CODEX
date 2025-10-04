import dayjs from 'dayjs';
import { create } from 'zustand';
import type {
  Bill,
  BillInput,
  Preferences,
  ThemePreference,
  Transaction,
  TransactionInput,
  TransactionFormInput,
  TransactionKind,
  User,
} from '../types/finance';
import * as api from '../services/mockApi';

export interface FinanceStore {
  transactions: Transaction[];
  bills: Bill[];
  preferences: Preferences;
  user?: User;
  loading: boolean;
  error?: string;
  lastSync?: string;
  creatingTransactionKind: TransactionKind | null;
  payingBillIds: string[];
  fetchTransactions: () => Promise<Transaction[]>;
  addTransaction: (payload: TransactionInput) => Promise<Transaction>;
  fetchBills: () => Promise<Bill[]>;
  addBill: (payload: BillInput) => Promise<Bill>;
  markBillAsPaid: (id: string, paidAt?: string) => Promise<Bill | undefined>;
  createTransaction: (
    payload: TransactionFormInput & { kind: TransactionKind }
  ) => Promise<Transaction>;
  fetchBills: () => Promise<Bill[]>;
  addBill: (payload: api.BillInput) => Promise<Bill>;
  markBillAsPaid: (
    id: string,
    paidAt?: string,
  ) => Promise<{ bill?: Bill; transaction?: Transaction }>;

  fetchUser: () => Promise<User | undefined>;
  saveUser: (payload: User | ((current?: User) => User)) => Promise<User>;
  fetchPreferences: () => Promise<Preferences>;
  setTheme: (theme: ThemePreference) => Promise<Preferences>;
  clearError: () => void;
}

const mapError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return typeof error === 'string' ? error : 'Ocorreu um erro inesperado.';
};

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  bills: [],
  preferences: { theme: 'system' },
  user: undefined,
  loading: false,
  error: undefined,
  lastSync: undefined,
  creatingTransactionKind: null,
  payingBillIds: [],
  async fetchTransactions() {
    set({ loading: true, error: undefined });
    try {
      const transactions = await api.listTransactions();
      set({
        transactions,
        loading: false,
        lastSync: dayjs().toISOString(),
      });
      return transactions;
    } catch (error) {
      set({ loading: false, error: mapError(error) });
      throw error;
    }
  },
  async createTransaction(payload) {
    set({ creatingTransactionKind: payload.kind, error: undefined });
    try {
      const transaction = await api.addTransaction(payload);
      set((state) => {
        const transactions = [
          transaction,
          ...state.transactions.filter((item) => item.id !== transaction.id),
        ].sort((first, second) => dayjs(second.date).valueOf() - dayjs(first.date).valueOf());

        const bills = payload.billId
          ? state.bills.map((bill) =>
              bill.id === payload.billId
                ? {
                    ...bill,
                    status: 'paid',
                    paidAt: payload.date,
                    transactionId: transaction.id,
                  }
                : bill,
            )
          : state.bills;

        return {
          transactions,
          bills,
          lastSync: dayjs().toISOString(),
          creatingTransactionKind: null,
        };
      });
      return transaction;
    } catch (error) {
      set({ creatingTransactionKind: null, error: mapError(error) });
      throw error;
    }
  },
  async fetchBills() {
    set({ loading: true, error: undefined });
    try {
      const bills = await api.listBills();
      set({
        bills,
        loading: false,
        lastSync: dayjs().toISOString(),
      });
      return bills;
    } catch (error) {
      set({ loading: false, error: mapError(error) });
      throw error;
    }
  },
  async addBill(payload) {
    try {
      const bill = await api.addBill(payload);
      set((state) => ({
        bills: [bill, ...state.bills.filter((item) => item.id !== bill.id)],
        lastSync: dayjs().toISOString(),
      }));
      return bill;
    } catch (error) {
      set({ error: mapError(error) });
      throw error;
    }
  },
  async markBillAsPaid(id, paidAt) {
    const { bills } = get();
    const target = bills.find((bill) => bill.id === id);
    if (!target) {
      const error = new Error('Conta não encontrada.');
      set({ error: error.message });
      throw error;
    }

    if (target.status === 'paid') {
      return { bill: target, transaction: undefined };
    }

    set((state) => ({
      payingBillIds: state.payingBillIds.includes(id)
        ? state.payingBillIds
        : [...state.payingBillIds, id],
      error: undefined,
    }));

    try {
      const paymentDate = paidAt ?? dayjs().format('YYYY-MM-DD');
      const transaction = await api.addTransaction({
        kind: 'saida',
        category: 'Pagamento de conta',
        amountInCents: target.amountInCents,
        date: paymentDate,
        description: `Pagamento de ${target.description}`,
        account: target.account,
        billId: target.id,
      });

      const updatedBill: Bill = {
        ...target,
        status: 'paid',
        paidAt: paymentDate,
        transactionId: transaction.id,
      };

      await api.markBillAsPaid(target.id, paymentDate, transaction.id);

      set((state) => ({
        transactions: [
          transaction,
          ...state.transactions.filter((item) => item.id !== transaction.id),
        ].sort((first, second) => dayjs(second.date).valueOf() - dayjs(first.date).valueOf()),
        bills: state.bills.map((bill) => (bill.id === id ? updatedBill : bill)),
        lastSync: dayjs().toISOString(),
        payingBillIds: state.payingBillIds.filter((billId) => billId !== id),
      }));

      return { bill: updatedBill, transaction };
    } catch (error) {
      set((state) => ({
        payingBillIds: state.payingBillIds.filter((billId) => billId !== id),
        error: mapError(error),
      }));
      throw error;
    }
  },
  async fetchUser() {
    set({ loading: true, error: undefined });
    try {
      const user = await api.getUser();
      set({
        user,
        loading: false,
        lastSync: dayjs().toISOString(),
      });
      return user;
    } catch (error) {
      set({ loading: false, error: mapError(error) });
      throw error;
    }
  },
  async saveUser(payload) {
    try {
      const user = await api.updateUser(payload);
      set({
        user,
        lastSync: dayjs().toISOString(),
      });
      return user;
    } catch (error) {
      set({ error: mapError(error) });
      throw error;
    }
  },
  async fetchPreferences() {
    set({ loading: true, error: undefined });
    try {
      const preferences = await api.getPreferences();
      set({
        preferences,
        loading: false,
        lastSync: dayjs().toISOString(),
      });
      return preferences;
    } catch (error) {
      set({ loading: false, error: mapError(error) });
      throw error;
    }
  },
  async setTheme(theme) {
    try {
      const preferences = await api.setThemePreference(theme);
      set({
        preferences,
        lastSync: dayjs().toISOString(),
      });
      return preferences;
    } catch (error) {
      set({ error: mapError(error) });
      throw error;
    }
  },
  clearError() {
    if (get().error) {
      set({ error: undefined });
    }
  },
}));
