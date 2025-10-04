import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useFinanceStore } from '../store/financeStore';
import { FinanceCalendar } from '../components/FinanceCalendar';
import { formatCurrency } from '../utils/format';

interface FeedbackMessage {
  type: 'success' | 'error';
  message: string;
}

export function ContasAPagarPage() {
  const bills = useFinanceStore((state) => state.bills);
  const fetchBills = useFinanceStore((state) => state.fetchBills);
  const markBillAsPaid = useFinanceStore((state) => state.markBillAsPaid);
  const payingBillIds = useFinanceStore((state) => state.payingBillIds);
  const loading = useFinanceStore((state) => state.loading);

  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      fetchBills()
        .catch(() => {
          setFeedback({ type: 'error', message: 'Não foi possível carregar as contas.' });
        })
        .finally(() => setHasLoaded(true));
    }
  }, [fetchBills, hasLoaded]);

  const sortedBills = useMemo(
    () =>
      [...bills].sort(
        (first, second) => dayjs(first.dueDate).valueOf() - dayjs(second.dueDate).valueOf(),
      ),
    [bills],
  );

  const pendingCount = sortedBills.filter((bill) => bill.status === 'pending').length;

  const handleMarkPaid = async (billId: string) => {
    setFeedback(null);

    try {
      const { transaction } = await markBillAsPaid(billId);

      if (transaction) {
        setFeedback({
          type: 'success',
          message: `Conta paga e transação criada (${formatCurrency(transaction.amountInCents)}).`,
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

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Contas a pagar</h2>
            <p className="text-sm text-white/70">
              Organize compromissos, marque pagamentos e acompanhe o status das faturas.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
            {pendingCount} pendentes
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left font-medium text-white/70">
              <tr>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Valor (BRL)</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedBills.map((bill) => {
                const isPaying = payingBillIds.includes(bill.id);

                return (
                  <tr key={bill.id} className="transition hover:bg-white/5">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                      {bill.description}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-white/80">
                      {formatCurrency(bill.amountInCents)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-white/80">
                      {dayjs(bill.dueDate).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                          bill.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-200',
                        )}
                      >
                        {bill.status === 'paid' ? 'Paga' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:border-emerald-300 hover:text-emerald-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/40"
                        onClick={() => handleMarkPaid(bill.id)}
                        disabled={bill.status === 'paid' || isPaying}
                      >
                        {isPaying ? 'Processando...' : 'Marcar pago'}
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
                ? 'bg-emerald-500/20 text-emerald-200'
                : 'bg-rose-500/20 text-rose-200',
            )}
          >
            {feedback.message}
          </div>
        )}

        {loading && !hasLoaded && (
          <p className="mt-4 text-sm text-white/60">Carregando contas...</p>
        )}

        {!loading && hasLoaded && sortedBills.length === 0 && (
          <p className="mt-4 text-sm text-white/60">Nenhuma conta cadastrada ainda.</p>
        )}
      </div>

      <FinanceCalendar />
    </section>
  );
}
