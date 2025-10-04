import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-800">Controle Financeiro</h1>
        <p className="text-slate-600">
          Utilize as páginas abaixo para registrar entradas e saídas, acompanhar contas e visualizar
          compromissos no calendário.
        </p>
        <nav className="grid gap-3 sm:grid-cols-2">
          <Link
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow"
            href="/Entrada"
          >
            Registrar Entrada
          </Link>
          <Link
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow"
            href="/Saida"
          >
            Registrar Saída
          </Link>
          <Link
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow"
            href="/Bills"
          >
            Contas a Pagar
          </Link>
        </nav>
      </div>
    </main>
  );
}
