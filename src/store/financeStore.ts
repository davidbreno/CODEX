import dayjs from 'dayjs';
import { create } from 'zustand';
import type {
  Bill,
  Preferences,
  ThemePreference,
  Transaction,
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
  fetchTransactions: () => Promise<Transaction[]>;
  addTransaction: (payload: api.TransactionInput) => Promise<Transaction>;
  fetchBills: () => Promise<Bill[]>;
  addBill: (payload: api.BillInput) => Promise<Bill>;
  markBillAsPaid: (id: string, paidAt?: string) => Promise<Bill | undefined>;
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
  async addTransaction(payload) {
    try {
      const transaction = await api.addTransaction(payload);
      set((state) => ({
        transactions: [transaction, ...state.transactions.filter((item) => item.id !== transaction.id)],
        lastSync: dayjs().toISOString(),
      }));
      return transaction;
    } catch (error) {
      set({ error: mapError(error) });
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
    try {
      const updated = await api.markBillAsPaid(id, paidAt);
      if (!updated) {
        return undefined;
      }
      set((state) => ({
        bills: state.bills.map((bill) => (bill.id === updated.id ? updated : bill)),
        lastSync: dayjs().toISOString(),
      }));
      return updated;
    } catch (error) {
      set({ error: mapError(error) });
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
