import dayjs from 'dayjs';
import type {
  Bill,
  Preferences,
  ThemePreference,
  Transaction,
  User,
} from '../types/finance';
import seedData from './data/finance.json';

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem?: (key: string) => void;
};

interface FinanceData {
  transactions: Transaction[];
  bills: Bill[];
  preferences: Preferences;
  user?: User;
  updatedAt: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

export type BillInput = Omit<Bill, 'id' | 'status'> & {
  id?: string;
  status?: Bill['status'];
};

const STORAGE_KEY = 'codex-finance-data';
const hasWindow = typeof window !== 'undefined';
const storage: StorageLike | null = hasWindow && window.localStorage ? window.localStorage : null;

const defaultData: FinanceData = {
  transactions: (seedData.transactions ?? []) as Transaction[],
  bills: (seedData.bills ?? []) as Bill[],
  preferences: (seedData.preferences ?? { theme: 'system' }) as Preferences,
  user: seedData.user === null ? undefined : (seedData.user as User | undefined),
  updatedAt: seedData.updatedAt ?? dayjs().toISOString(),
};

let memoryStore: FinanceData | null = null;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const ensureStore = (): FinanceData => {
  if (memoryStore) {
    return clone(memoryStore);
  }

  if (storage) {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as FinanceData;
        memoryStore = parsed;
        return clone(parsed);
      } catch (error) {
        console.warn('[mockApi] Could not parse storage data', error);
      }
    }
  }

  memoryStore = clone(defaultData);
  return clone(memoryStore);
};

const persistStore = (data: FinanceData) => {
  memoryStore = clone(data);
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(memoryStore));
  }
};

const delay = (min = 120, max = 360) =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

const generateId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 11)}-${Date.now()}`);

const touchUpdatedAt = (data: FinanceData) => {
  data.updatedAt = dayjs().toISOString();
};

export const listTransactions = async (): Promise<Transaction[]> => {
  await delay();
  const { transactions } = ensureStore();
  return transactions
    .slice()
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
};

export const addTransaction = async (payload: TransactionInput): Promise<Transaction> => {
  await delay();
  const data = ensureStore();
  const timestamp = dayjs().toISOString();
  const transaction: Transaction = {
    id: payload.id ?? generateId(),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...payload,
  };
  data.transactions = [transaction, ...data.transactions];
  touchUpdatedAt(data);
  persistStore(data);
  return transaction;
};

export const listBills = async (): Promise<Bill[]> => {
  await delay();
  const { bills } = ensureStore();
  return bills
    .slice()
    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf());
};

export const addBill = async (payload: BillInput): Promise<Bill> => {
  await delay();
  const data = ensureStore();
  const bill: Bill = {
    id: payload.id ?? generateId(),
    ...payload,
    status: payload.status ?? 'pending',
  };
  data.bills = [bill, ...data.bills];
  touchUpdatedAt(data);
  persistStore(data);
  return bill;
};

export const markBillAsPaid = async (
  id: string,
  paidAt: string = dayjs().toISOString(),
): Promise<Bill | undefined> => {
  await delay();
  const data = ensureStore();
  const index = data.bills.findIndex((bill) => bill.id === id);
  if (index === -1) {
    return undefined;
  }

  const updated: Bill = {
    ...data.bills[index],
    status: 'paid',
    paidAt,
  };

  data.bills[index] = updated;
  touchUpdatedAt(data);
  persistStore(data);
  return updated;
};

export const getUser = async (): Promise<User | undefined> => {
  await delay();
  const { user } = ensureStore();
  return user ? { ...user } : undefined;
};

export const updateUser = async (payload: User | ((current?: User) => User)): Promise<User> => {
  await delay();
  const data = ensureStore();
  const nextUser = typeof payload === 'function' ? (payload as (current?: User) => User)(data.user) : payload;
  data.user = { ...nextUser };
  touchUpdatedAt(data);
  persistStore(data);
  return data.user;
};

export const getPreferences = async (): Promise<Preferences> => {
  await delay();
  const { preferences } = ensureStore();
  return { ...preferences };
};

export const setThemePreference = async (theme: ThemePreference): Promise<Preferences> => {
  await delay();
  const data = ensureStore();
  data.preferences = { ...data.preferences, theme };
  touchUpdatedAt(data);
  persistStore(data);
  return { ...data.preferences };
};

export const resetMockData = async () => {
  memoryStore = null;
  if (storage && storage.removeItem) {
    storage.removeItem(STORAGE_KEY);
  }
};
