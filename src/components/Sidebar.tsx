import { NavLink } from 'react-router-dom';
import clsx from 'classnames';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/entrada', label: 'Entrada' },
  { to: '/dashboard/saida', label: 'Saída' },
  { to: '/dashboard/bills', label: 'Contas a pagar' },
  { to: '/dashboard/pie', label: 'Gráfico Pizza' },
  { to: '/dashboard/temas', label: 'Temas' },
  { to: '/dashboard/configuracoes', label: 'Configurações' }
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-white/5/50 px-4 py-6 backdrop-blur-lg">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="h-10 w-10 rounded-2xl bg-aurora-gradient" />
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50">Codex</p>
          <p className="text-lg font-semibold">Finance</p>
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition',
                'text-white/70 hover:text-white hover:bg-white/10',
                isActive && 'bg-white/10 text-white shadow-inner shadow-aurora-end/30'
              )
            }
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-aurora-gradient" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="font-medium text-white">Dica</p>
        <p>Configure alertas de fluxo de caixa para receber notificações diárias.</p>
      </div>
    </aside>
  );
}
