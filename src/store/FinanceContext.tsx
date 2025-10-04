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
import type {
  Bill,
  Transaction,
  TransactionFormInput,
  TransactionKind
} from '../types/finance';
import { createId } from '../utils/format';

interface FinanceState {
  transactions: Transaction[];
  bills: Bill[];
}

type FinanceAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'MARK_BILL_PAID'; payload: { billId: string; transaction?: Transaction; paidAt?: string } };

const initialState: FinanceState = {
  transactions: [],
  bills: [
    {
      id: 'bill-1',
      description: 'Energia Elétrica',
      amountInCents: 18990,
      dueDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
      status: 'pendente',
      account: 'Conta Principal'
    },
    {
      id: 'bill-2',
      description: 'Internet Fibra',
      amountInCents: 12990,
      dueDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
      status: 'pendente',
      account: 'Conta Principal'
    },
    {
      id: 'bill-3',
      description: 'Assinatura Plataforma',
      amountInCents: 5990,
      dueDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      status: 'pago',
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
            ? { ...bill, status: 'pago', paidAt: action.payload.paidAt ?? new Date().toISOString() }
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
    kind: TransactionKind,
    data: TransactionFormInput
  ) => Promise<{ transaction: Transaction }>;
  markBillPaid: (billId: string) => Promise<{ transaction?: Transaction }>;
  savingTransactionKind: TransactionKind | null;
  payingBills: string[];
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const [savingTransactionKind, setSavingTransactionKind] = useState<TransactionKind | null>(null);
  const [payingBills, setPayingBills] = useState<string[]>([]);

  const addTransaction = useCallback<FinanceContextValue['addTransaction']>(
    async (kind, data) => {
      setSavingTransactionKind(kind);

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

        const transaction: Transaction = {
          ...data,
          id: createId(),
          kind,
          createdAt: new Date().toISOString()
        };

        await wait(350);

        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

        return { transaction };
      } finally {
        setSavingTransactionKind(null);
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

        if (bill.status === 'pago') {
          await wait(150);
          return { transaction: undefined };
        }

        const timestamp = new Date().toISOString();

        const transaction: Transaction = {
          id: createId(),
          kind: 'saida',
          category: 'Pagamento de conta',
          amountInCents: bill.amountInCents,
          date: dayjs().format('YYYY-MM-DD'),
          description: `Pagamento de ${bill.description}`,
          account: bill.account,
          billId: bill.id,
          createdAt: timestamp
        };

        await wait(400);

        dispatch({ type: 'MARK_BILL_PAID', payload: { billId, transaction, paidAt: timestamp } });

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
      savingTransactionKind,
      payingBills
    }),
    [state.transactions, state.bills, addTransaction, markBillPaid, savingTransactionKind, payingBills]
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
