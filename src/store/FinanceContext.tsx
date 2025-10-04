import dayjs from 'dayjs';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode
} from 'react';
import type { Bill, Transaction, TransactionType } from '../types/finance';
import { createId } from '../utils/format';

type NewTransactionInput = Omit<Transaction, 'id' | 'type' | 'createdAt' | 'updatedAt'>;

interface FinanceState {
  transactions: Transaction[];
  bills: Bill[];
}

type FinanceAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | {
      type: 'MARK_BILL_PAID';
      payload: { billId: string; paidAt: string; transaction?: Transaction };
    };

const initialState: FinanceState = {
  transactions: [],
  bills: [
    {
      id: 'bill-1',
      description: 'Energia Elétrica',
      amountInCents: 18990,
      dueDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
      status: 'pending',
      account: 'Conta Principal'
    },
    {
      id: 'bill-2',
      description: 'Internet Fibra',
      amountInCents: 12990,
      dueDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
      status: 'pending',
      account: 'Conta Principal'
    },
    {
      id: 'bill-3',
      description: 'Assinatura Plataforma',
      amountInCents: 5990,
      dueDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      status: 'paid',
      account: 'Cartão Corporativo'
    }
  ]
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    case 'MARK_BILL_PAID':
      return {
        ...state,
        bills: state.bills.map((bill) =>
          bill.id === action.payload.billId
            ? {
                ...bill,
                status: 'paid',
                paidAt: action.payload.paidAt,
                transactionId: action.payload.transaction?.id ?? bill.transactionId
              }
            : bill
        ),
        transactions:
          action.payload.transaction !== undefined
            ? [...state.transactions, action.payload.transaction]
            : state.transactions
      };
    default:
      return state;
  }
}

interface FinanceContextValue {
  transactions: Transaction[];
  bills: Bill[];
  addTransaction: (
    type: TransactionType,
    data: NewTransactionInput
  ) => Promise<{ transaction: Transaction }>;
  markBillPaid: (billId: string) => Promise<{ transaction?: Transaction }>;
  savingTransactionType: TransactionType | null;
  payingBills: string[];
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const [savingTransactionType, setSavingTransactionType] = useState<TransactionType | null>(null);
  const [payingBills, setPayingBills] = useState<string[]>([]);

  const addTransaction = useCallback<FinanceContextValue['addTransaction']>(
    async (type, data) => {
      setSavingTransactionType(type);

      try {
        if (!data.category.trim()) {
          throw new Error('Informe uma categoria válida.');
        }

        if (!Number.isFinite(data.amountInCents) || data.amountInCents <= 0) {
          throw new Error('O valor deve ser maior que zero.');
        }

        if (!data.date) {
          throw new Error('Selecione uma data.');
        }

        if (!data.account.trim()) {
          throw new Error('Informe uma conta.');
        }

        const timestamp = new Date().toISOString();
        const transaction: Transaction = {
          ...data,
          id: createId(),
          type,
          createdAt: timestamp,
          updatedAt: timestamp
        };

        await wait(350);

        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

        return { transaction };
      } finally {
        setSavingTransactionType(null);
      }
    },
    []
  );

  const markBillPaid = useCallback<FinanceContextValue['markBillPaid']>(
    async (billId) => {
      setPayingBills((ids) => [...ids, billId]);

      try {
        const bill = state.bills.find((item) => item.id === billId);

        if (!bill) {
          throw new Error('Conta não encontrada.');
        }

        if (bill.status === 'paid') {
          await wait(150);
          return { transaction: undefined };
        }

        const paidAt = new Date().toISOString();
        const transaction: Transaction = {
          id: createId(),
          type: 'expense',
          category: 'Pagamento de conta',
          amountInCents: bill.amountInCents,
          date: dayjs().format('YYYY-MM-DD'),
          description: `Pagamento de ${bill.description}`,
          account: bill.account,
          billId: bill.id,
          createdAt: paidAt,
          updatedAt: paidAt
        };

        await wait(400);

        dispatch({ type: 'MARK_BILL_PAID', payload: { billId, paidAt, transaction } });

        return { transaction };
      } finally {
        setPayingBills((ids) => ids.filter((id) => id !== billId));
      }
    },
    [state.bills]
  );

  const value = useMemo<FinanceContextValue>(
    () => ({
      transactions: state.transactions,
      bills: state.bills,
      addTransaction,
      markBillPaid,
      savingTransactionType,
      payingBills
    }),
    [state.transactions, state.bills, addTransaction, markBillPaid, savingTransactionType, payingBills]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance deve ser utilizado dentro de FinanceProvider');
  }

  return context;
};
