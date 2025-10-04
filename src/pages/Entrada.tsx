import { FormEvent, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useFinanceStore } from '../store/financeStore';

interface FormState {
  category: string;
  amountInCents: string;
  date: string;
  description: string;
  account: string;
}

const categories = ['Vendas', 'Investimentos', 'Reembolsos', 'Outros'];

const createDefaultState = (): FormState => ({
  category: '',
  amountInCents: '',
  date: dayjs().format('YYYY-MM-DD'),
  description: '',
  account: '',
});

export function EntradaPage() {
  const createTransaction = useFinanceStore((state) => state.createTransaction);
  const creatingTransactionKind = useFinanceStore((state) => state.creatingTransactionKind);
  const storeError = useFinanceStore((state) => state.error);
  const clearError = useFinanceStore((state) => state.clearError);

  const [formState, setFormState] = useState<FormState>(() => createDefaultState());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const isSubmitting = creatingTransactionKind === 'entrada';

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
        kind: 'entrada',
        category: formState.category.trim(),
        amountInCents: Math.round(amount),
        date: formState.date,
        description: formState.description.trim(),
        account: formState.account.trim(),
      });

      setFormState(createDefaultState());
      setSuccessMessage('Entrada registrada com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        setLocalError(error.message);
        return;
      }

      setLocalError('Não foi possível salvar a entrada.');
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Entradas</h2>
        <p className="text-sm text-white/70">
          Cadastre e acompanhe as entradas financeiras do período.
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
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              name="category"
              value={formState.category}
              onChange={(event) =>
                setFormState((current) => ({ ...current, category: event.target.value }))
              }
              placeholder="Ex.: Vendas"
              list="entrada-categories"
              required
            />
            <datalist id="entrada-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>

          <label className="flex flex-col text-sm font-medium text-white/80">
            Valor (centavos)
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              name="amountInCents"
              value={formState.amountInCents}
              onChange={(event) =>
                setFormState((current) => ({ ...current, amountInCents: event.target.value }))
              }
              type="number"
              min={0}
              step={1}
              placeholder="10000"
              required
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-white/80">
            Data
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
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
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
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
            className="mt-1 min-h-[96px] rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            name="description"
            value={formState.description}
            onChange={(event) =>
              setFormState((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Detalhes adicionais"
          />
        </label>

        {amountPreview && (
          <p className="text-sm text-emerald-300/80">Valor equivalente: {amountPreview}</p>
        )}

        {(localError || storeError) && (
          <p className="text-sm text-rose-300">
            {localError ?? storeError}
          </p>
        )}

        {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

        <button
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700/60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Registrar entrada'}
        </button>
      </form>
    </section>
  );
}
