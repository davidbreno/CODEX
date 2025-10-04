import { FormEvent, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../utils/format';

interface FormState {
  category: string;
  amountInCents: string;
  date: string;
  description: string;
  account: string;
  billId?: string;
}

const categories = ['Operacional', 'Investimentos', 'Folha de pagamento', 'Impostos'];

const createDefaultState = (): FormState => ({
  category: '',
  amountInCents: '',
  date: dayjs().format('YYYY-MM-DD'),
  description: '',
  account: '',
  billId: undefined,
});

export function SaidaPage() {
  const createTransaction = useFinanceStore((state) => state.createTransaction);
  const creatingTransactionKind = useFinanceStore((state) => state.creatingTransactionKind);
  const bills = useFinanceStore((state) => state.bills);
  const fetchBills = useFinanceStore((state) => state.fetchBills);
  const storeError = useFinanceStore((state) => state.error);
  const clearError = useFinanceStore((state) => state.clearError);

  const [formState, setFormState] = useState<FormState>(() => createDefaultState());
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasLoadedBills, setHasLoadedBills] = useState(false);

  useEffect(() => {
    if (!hasLoadedBills) {
      fetchBills()
        .catch(() => {
          setLocalError('Não foi possível carregar as contas a pagar.');
        })
        .finally(() => setHasLoadedBills(true));
    }
  }, [fetchBills, hasLoadedBills]);

  const isSubmitting = creatingTransactionKind === 'saida';

  const pendingBills = useMemo(
    () => bills.filter((bill) => bill.status === 'pending'),
    [bills],
  );

  const amountPreview = useMemo(() => {
    if (!formState.amountInCents) {
      return null;
    }

    const parsed = Number(formState.amountInCents);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }

    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parsed / 100);
  }, [formState.amountInCents]);

  const handleBillSelection = (billId: string | undefined) => {
    if (!billId) {
      setFormState((current) => ({ ...current, billId: undefined }));
      return;
    }

    const selected = pendingBills.find((bill) => bill.id === billId);
    if (!selected) {
      setFormState((current) => ({ ...current, billId: undefined }));
      return;
    }

    setFormState({
      category: 'Pagamento de conta',
      amountInCents: String(selected.amountInCents),
      date: dayjs().format('YYYY-MM-DD'),
      description: `Pagamento de ${selected.description}`,
      account: selected.account,
      billId: selected.id,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    setLocalError(null);
    if (storeError) {
      clearError();
    }

    const amount = Number(formState.amountInCents);
    if (!Number.isFinite(amount) || amount <= 0) {
      setLocalError('Informe um valor válido em centavos.');
      return;
    }

    if (!formState.category.trim()) {
      setLocalError('Selecione ou informe uma categoria.');
      return;
    }

    if (!formState.account.trim()) {
      setLocalError('Informe a conta responsável.');
      return;
    }

    try {
      await createTransaction({
        kind: 'saida',
        category: formState.category.trim(),
        amountInCents: Math.round(amount),
        date: formState.date,
        description: formState.description.trim(),
        account: formState.account.trim(),
        billId: formState.billId,
      });

      setFormState(createDefaultState());
      setSuccessMessage('Saída registrada com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        setLocalError(error.message);
        return;
      }

      setLocalError('Não foi possível salvar a saída.');
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Saídas</h2>
        <p className="text-sm text-white/70">
          Controle as despesas registradas e mantenha a saúde financeira em dia.
        </p>
      </div>

      <form
        className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-white/80">
            Categoria
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
              name="category"
              value={formState.category}
              onChange={(event) =>
                setFormState((current) => ({ ...current, category: event.target.value }))
              }
              placeholder="Ex.: Operacional"
              list="saida-categories"
              required
            />
            <datalist id="saida-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>

          <label className="flex flex-col text-sm font-medium text-white/80">
            Valor (centavos)
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
              name="amountInCents"
              value={formState.amountInCents}
              onChange={(event) =>
                setFormState((current) => ({ ...current, amountInCents: event.target.value }))
              }
              type="number"
              min={0}
              step={1}
              placeholder="5000"
              required
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-white/80">
            Data
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
              name="date"
              value={formState.date}
              onChange={(event) =>
                setFormState((current) => ({ ...current, date: event.target.value }))
              }
              type="date"
              max={dayjs().format('YYYY-MM-DD')}
              required
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-white/80">
            Conta
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
              name="account"
              value={formState.account}
              onChange={(event) =>
                setFormState((current) => ({ ...current, account: event.target.value }))
              }
              placeholder="Conta corrente"
              required
            />
          </label>
        </div>

        <label className="flex flex-col text-sm font-medium text-white/80">
          Descrição
          <textarea
            className="mt-1 min-h-[96px] rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
            name="description"
            value={formState.description}
            onChange={(event) =>
              setFormState((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Detalhes da despesa"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-white/80">
          Vincular a uma conta a pagar (opcional)
          <select
            className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40"
            value={formState.billId ?? ''}
            onChange={(event) => handleBillSelection(event.target.value || undefined)}
          >
            <option value="">Não vincular</option>
            {pendingBills.map((bill) => (
              <option key={bill.id} value={bill.id}>
                {bill.description} • {formatCurrency(bill.amountInCents)} • vence {dayjs(bill.dueDate).format('DD/MM')}
              </option>
            ))}
          </select>
          {formState.billId && (
            <span className="mt-1 text-xs text-white/60">
              Valores e descrição foram preenchidos com base na conta selecionada.
            </span>
          )}
        </label>

        {amountPreview && (
          <p className="text-sm text-rose-200/80">Valor equivalente: {amountPreview}</p>
        )}

        {(localError || storeError) && (
          <p className="text-sm text-rose-300">{localError ?? storeError}</p>
        )}

        {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

        <button
          className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-rose-700/60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Registrar saída'}
        </button>
      </form>

      {pendingBills.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          <h3 className="text-base font-semibold text-white">Contas pendentes</h3>
          <ul className="mt-3 space-y-2">
            {pendingBills.map((bill) => (
              <li key={bill.id} className="flex flex-col rounded-xl bg-white/5 px-4 py-3">
                <span className="font-medium text-white">{bill.description}</span>
                <span>{formatCurrency(bill.amountInCents)} — vence em {dayjs(bill.dueDate).format('DD/MM/YYYY')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
