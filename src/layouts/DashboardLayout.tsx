import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/dashboard': 'Dashboard',
  '/dashboard/entrada': 'Entradas',
  '/dashboard/saida': 'Saídas',
  '/dashboard/bills': 'Contas a pagar',
  '/dashboard/pie': 'Gráfico Pizza',
  '/dashboard/temas': 'Temas',
  '/dashboard/configuracoes': 'Configurações'
};

export function DashboardLayout() {
  const location = useLocation();
  const title = titles[location.pathname] ?? 'Dashboard';

  return (
    <div className="flex min-h-screen bg-midnight text-white bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_55%)]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-midnight/90 backdrop-blur">
          <div className="flex items-center justify-between gap-6 px-8 py-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/40">Painel</p>
              <h1 className="text-3xl font-semibold">{title}</h1>
            </div>
            <div className="relative w-full max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-aurora-gradient" />
              <input
                type="search"
                placeholder="Busque por relatórios, clientes ou tarefas"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-aurora-start focus:outline-none focus:ring-2 focus:ring-aurora-start/60"
              />
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
