import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';

const pageMetadata: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Visão geral',
    subtitle: 'Acompanhe indicadores em tempo real do fluxo financeiro.'
  },
  '/entrada': {
    title: 'Entradas',
    subtitle: 'Registre receitas e acompanhe a performance mensal.'
  },
  '/saida': {
    title: 'Saídas',
    subtitle: 'Controle despesas recorrentes e extraordinárias.'
  },
  '/bills': {
    title: 'Contas a pagar',
    subtitle: 'Gerencie vencimentos, status e notificações de pagamento.'
  },
  '/pie': {
    title: 'Distribuição',
    subtitle: 'Visualize a composição de custos e receitas por categoria.'
  }
};

export default function App() {
  const location = useLocation();
  const metadata = pageMetadata[location.pathname] ?? {
    title: 'Painel financeiro',
    subtitle: 'Organize metas, entradas e saídas em um só lugar.'
  };

  return (
    <div className="flex min-h-screen bg-midnight text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-midnight/90 backdrop-blur">
          <div className="flex flex-col gap-6 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.45em] text-white/40">Painel</p>
              <h1 className="text-3xl font-semibold">{metadata.title}</h1>
              <p className="text-sm text-white/70">{metadata.subtitle}</p>
            </div>
            <div className="flex w-full flex-col gap-4 lg:max-w-lg">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-aurora-gradient" />
                <input
                  type="search"
                  placeholder="Busque relatórios, clientes ou tarefas"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-aurora-start focus:outline-none focus:ring-2 focus:ring-aurora-start/60"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button className="inline-flex items-center justify-center rounded-xl bg-aurora-gradient px-4 py-2 text-sm font-semibold text-midnight shadow-lg shadow-aurora-end/40 transition hover:opacity-90">
                  Registrar nova transação
                </button>
                <button className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-aurora-end hover:text-white">
                  Exportar dados
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-8 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
