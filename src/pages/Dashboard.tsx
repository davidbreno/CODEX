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
    </section>
  );
}
