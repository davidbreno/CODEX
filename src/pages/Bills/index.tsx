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

export function ContasAPagarPage() {
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

  const sortedBills = [...bills].sort(
    (first, second) => dayjs(first.dueDate).valueOf() - dayjs(second.dueDate).valueOf()
  );

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-aurora-end/20 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Contas a pagar</h2>
            <p className="text-sm text-white/70">
              Acompanhe vencimentos, marque contas como pagas e gere a transação correspondente automaticamente.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {sortedBills.filter((bill) => bill.status === 'pending').length} pendentes
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/10 text-left text-white/70">
              <tr>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Valor (BRL)</th>
                <th className="px-4 py-3 font-medium">Vencimento</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedBills.map((bill) => {
                const isPaying = payingBills.includes(bill.id);

                return (
                  <tr key={bill.id} className="transition hover:bg-white/5">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-white">{bill.description}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-white/70">{formatCurrency(bill.amountInCents)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-white/70">{formatDate(bill.dueDate)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                          bill.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-amber-500/10 text-amber-300'
                        )}
                      >
                        {bill.status === 'paid' ? 'Paga' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:border-aurora-start hover:text-aurora-start disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/40"
                        onClick={() => handleMarkPaid(bill.id)}
                        disabled={bill.status === 'paid' || isPaying}
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
              'mt-6 rounded-xl px-4 py-3 text-sm',
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-200'
                : 'bg-rose-500/10 text-rose-200'
            )}
          >
            {feedback.message}
          </div>
        )}
      </div>

      <FinanceCalendar />
    </section>
  );
}

export default ContasAPagarPage;
