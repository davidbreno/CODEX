import { Link } from 'react-router-dom';

const quickActions = [
  { label: 'Registrar entrada', to: '/entrada', description: 'Cadastre receitas com categoria, conta e data.' },
  { label: 'Registrar saída', to: '/saida', description: 'Registre despesas e associe-as às contas abertas.' },
  { label: 'Contas a pagar', to: '/contas-a-pagar', description: 'Gerencie vencimentos e marque pagamentos com um clique.' }
];

export function DashboardPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-semibold">Visão geral</h2>
        <p className="text-sm text-white/70">
          Acompanhe a performance da sua empresa com os principais indicadores.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-aurora-end/20 backdrop-blur">
          <h3 className="text-lg font-medium text-aurora-start">Receita</h3>
          <p className="mt-2 text-3xl font-semibold">R$ 245.300</p>
          <p className="mt-1 text-xs text-white/60">+12% vs. mês anterior</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-aurora-end/20 backdrop-blur">
          <h3 className="text-lg font-medium text-aurora-start">Despesas</h3>
          <p className="mt-2 text-3xl font-semibold">R$ 98.120</p>
          <p className="mt-1 text-xs text-white/60">-4% vs. mês anterior</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-aurora-end/20 backdrop-blur">
          <h3 className="text-lg font-medium text-aurora-start">Saldo</h3>
          <p className="mt-2 text-3xl font-semibold">R$ 147.180</p>
          <p className="mt-1 text-xs text-white/60">Saldo projetado para o mês atual</p>
        </div>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-aurora-end/10 backdrop-blur">
        <h3 className="text-lg font-semibold text-white">Ações rápidas</h3>
        <p className="text-sm text-white/60">
          Acesse rapidamente as telas operacionais para manter os registros sempre atualizados.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-aurora-start/60 hover:bg-white/10"
            >
              <span className="text-sm font-semibold text-white group-hover:text-aurora-start">
                {action.label}
              </span>
              <p className="mt-1 text-xs text-white/50">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
