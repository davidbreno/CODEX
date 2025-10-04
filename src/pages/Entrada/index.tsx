import { FormEvent, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useFinance } from '../../store/FinanceContext';

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

const inputClassName =
  'mt-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 shadow-sm transition focus:border-aurora-start focus:outline-none focus:ring-2 focus:ring-aurora-start/40';
const labelClassName = 'flex flex-col text-sm font-medium text-white/80';

export function EntradaPage() {
  const { addTransaction, savingTransactionKind } = useFinance();
export default function Entrada() {
  const { addTransaction, savingTransactionType } = useFinance();
  const [formState, setFormState] = useState<FormState>(() => createDefaultState());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSubmitting = savingTransactionType === 'income';

  const amountPreview = useMemo(() => {
    if (!formState.amountInCents) {
      return null;
    }

    const parsed = Number(formState.amountInCents);

    if (!Number.isFinite(parsed)) {
      return null;
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parsed / 100);
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
      await addTransaction('income', {
        category: formState.category.trim(),
        value: Math.round(amount),
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
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold">Registrar entrada</h2>
        <p className="text-sm text-white/70">
          Cadastre receitas informando categoria, valor, data, descrição e conta responsável.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-aurora-end/20 backdrop-blur"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className={labelClassName}>
            Categoria
            <input
              className={inputClassName}
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

          <label className={labelClassName}>
            Valor (centavos)
            <input
              className={inputClassName}
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

          <label className={labelClassName}>
            Data
            <input
              className={inputClassName}
              name="date"
              value={formState.date}
              onChange={(event) =>
                setFormState((current) => ({ ...current, date: event.target.value }))
              }
              type="date"
            />
          </label>

          <label className={labelClassName}>
            Conta
            <input
              className={inputClassName}
              name="account"
              value={formState.account}
              onChange={(event) =>
                setFormState((current) => ({ ...current, account: event.target.value }))
              }
              placeholder="Conta corrente"
            />
          </label>
        </div>

        <label className={labelClassName}>
          Descrição
          <textarea
            className={`${inputClassName} min-h-[96px] resize-y`}
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

        {errorMessage && <p className="text-sm text-rose-300">{errorMessage}</p>}
        {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

        <button
          className="inline-flex items-center justify-center rounded-xl bg-aurora-gradient px-5 py-2 text-sm font-semibold text-midnight shadow-lg shadow-aurora-end/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-aurora-start/60 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Registrar entrada'}
        </button>
      </form>
    </section>
  );
}

export default EntradaPage;
