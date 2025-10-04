import { useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useFinance } from '../../store/FinanceContext';
import { FinanceCalendar } from '../../components/FinanceCalendar';
import { formatCurrency, formatDate } from '../../utils/format';

interface FeedbackMessage {
  type: 'success' | 'error';
  message: string;
}

export default function Bills() {
  const { bills, markBillPaid, payingBills } = useFinance();
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const handleMarkPaid = async (billId: string) => {
    setFeedback(null);

    try {
      const { transaction } = await markBillPaid(billId);

      if (transaction) {
        setFeedback({
          type: 'success',
          message: `Conta paga e transação de saída criada (${formatCurrency(transaction.amountInCents)}).`
        });
      } else {
        setFeedback({ type: 'success', message: 'Conta já estava marcada como paga.' });
      }
    } catch (error) {
      if (error instanceof Error) {
        setFeedback({ type: 'error', message: error.message });
        return;
      }

      setFeedback({ type: 'error', message: 'Não foi possível atualizar a conta.' });
    }
  };

  const sortedBills = [...bills].sort((first, second) => dayjs(first.dueDate).valueOf() - dayjs(second.dueDate).valueOf());

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Contas a pagar</h1>
              <p className="text-sm text-slate-600">
                Acompanhe vencimentos, marque contas como pagas e gere a transação correspondente automaticamente.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              {sortedBills.filter((bill) => bill.status === 'pendente').length} pendentes
            </span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-100 text-left font-medium text-slate-600">
                <tr>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Valor (BRL)</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sortedBills.map((bill) => {
                  const isPaying = payingBills.includes(bill.id);

                  return (
                    <tr key={bill.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">{bill.description}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatCurrency(bill.amountInCents)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(bill.dueDate)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={clsx(
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                            bill.status === 'pago'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-600'
                          )}
                        >
                          {bill.status === 'pago' ? 'Paga' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                          onClick={() => handleMarkPaid(bill.id)}
                          disabled={bill.status === 'pago' || isPaying}
                        >
                          {isPaying ? 'Processando...' : 'Marcar como paga'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {feedback && (
            <div
              className={clsx(
                'mt-4 rounded-md px-4 py-3 text-sm',
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-600'
              )}
            >
              {feedback.message}
            </div>
          )}
        </div>

        <FinanceCalendar />
      </div>
    </main>
  );
}
