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

export default function Entrada() {
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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-slate-800">Registrar entrada</h1>
        <p className="mt-1 text-sm text-slate-600">
          Cadastre receitas informando a categoria, valor em centavos, data, descrição e conta de destino.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg bg-white p-6 shadow">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Categoria
              <input
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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

            <label className="flex flex-col text-sm font-medium text-slate-700">
              Valor (centavos)
              <input
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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

            <label className="flex flex-col text-sm font-medium text-slate-700">
              Data
              <input
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                name="date"
                value={formState.date}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, date: event.target.value }))
                }
                type="date"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-slate-700">
              Conta
              <input
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                name="account"
                value={formState.account}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, account: event.target.value }))
                }
                placeholder="Conta corrente"
              />
            </label>
          </div>

          <label className="flex flex-col text-sm font-medium text-slate-700">
            Descrição
            <textarea
              className="mt-1 min-h-[96px] rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              name="description"
              value={formState.description}
              onChange={(event) =>
                setFormState((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Detalhes adicionais"
            />
          </label>

          {amountPreview && (
            <p className="text-sm text-slate-500">Valor equivalente: {amountPreview}</p>
          )}

          {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}

          <button
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Registrar entrada'}
          </button>
        </form>
      </div>
    </main>
  );
}
