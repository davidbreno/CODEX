import { FormEvent, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useFinance } from '../store/FinanceContext';
import { formatCurrency } from '../utils/format';

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
  account: ''
});

export function EntradaPage() {
  const { addTransaction, savingTransactionKind } = useFinance();
  const [formState, setFormState] = useState<FormState>(() => createDefaultState());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSubmitting = savingTransactionKind === 'entrada';

  const amountPreview = useMemo(() => {
    if (!formState.amountInCents) {
      return null;
    }

    const parsed = Number(formState.amountInCents);

    if (!Number.isFinite(parsed)) {
      return null;
    }

    return formatCurrency(parsed);
  }, [formState.amountInCents]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const amount = Number(formState.amountInCents);

    if (!Number.isFinite(amount) || amount <= 0) {
      setErrorMessage('Informe um valor válido em centavos.');
      return;
    }

    if (!formState.category.trim()) {
      setErrorMessage('Selecione ou informe uma categoria.');
      return;
    }

    if (!formState.account.trim()) {
      setErrorMessage('Informe a conta responsável.');
      return;
    }

    try {
      await addTransaction('entrada', {
        category: formState.category.trim(),
        amountInCents: Math.round(amount),
        date: formState.date,
        description: formState.description.trim(),
        account: formState.account.trim()
      });

      setFormState(createDefaultState());
      setSuccessMessage('Entrada registrada com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('Não foi possível salvar a entrada.');
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold">Registrar entrada</h2>
        <p className="max-w-2xl text-sm text-white/70">
          Cadastre receitas informando categoria, valor em centavos, data, descrição e conta de destino.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-aurora-end/10 backdrop-blur"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-white/80">
            Categoria
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-aurora-start focus:outline-none focus:ring-2 focus:ring-aurora-start/50"
              name="category"
              value={formState.category}
              onChange={(event) =>
                setFormState((current) => ({ ...current, category: event.target.value }))
              }
              placeholder="Ex.: Vendas"
              list="income-categories"
            />
            <datalist id="income-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>

          <label className="flex flex-col text-sm font-medium text-white/80">
            Valor (centavos)
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-aurora-start focus:outline-none focus:ring-2 focus:ring-aurora-start/50"
              name="amountInCents"
              value={formState.amountInCents}
              onChange={(event) =>
                setFormState((current) => ({ ...current, amountInCents: event.target.value }))
              }
              type="number"
              min={0}
              step={1}
              placeholder="10000"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-white/80">
            Data
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-aurora-start focus:outline-none focus:ring-2 focus:ring-aurora-start/50"
              name="date"
              value={formState.date}
              onChange={(event) =>
                setFormState((current) => ({ ...current, date: event.target.value }))
              }
              type="date"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-white/80">
            Conta
            <input
              className="mt-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-aurora-start focus:outline-none focus:ring-2 focus:ring-aurora-start/50"
              name="account"
              value={formState.account}
              onChange={(event) =>
                setFormState((current) => ({ ...current, account: event.target.value }))
              }
              placeholder="Conta corrente"
            />
          </label>
        </div>

        <label className="flex flex-col text-sm font-medium text-white/80">
          Descrição
          <textarea
            className="mt-1 min-h-[96px] rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-aurora-start focus:outline-none focus:ring-2 focus:ring-aurora-start/50"
            name="description"
            value={formState.description}
            onChange={(event) =>
              setFormState((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Detalhes adicionais"
          />
        </label>

        {amountPreview && (
          <p className="text-sm text-white/60">Valor equivalente: {amountPreview}</p>
        )}

        {errorMessage && <p className="text-sm text-rose-400">{errorMessage}</p>}
        {successMessage && <p className="text-sm text-emerald-400">{successMessage}</p>}

        <button
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-midnight transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700/60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Registrar entrada'}
        </button>
      </form>
    </section>
  );
}
