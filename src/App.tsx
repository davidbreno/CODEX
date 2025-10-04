import { ThemeToggle } from './components/ThemeToggle';
import { BarChart } from './charts/BarChart';
import { TrendSparkline } from './charts/TrendSparkline';
import { useTheme } from './theme';

const revenueData = [
  { label: 'Q1', value: 18, goal: 15 },
  { label: 'Q2', value: 24, goal: 22 },
  { label: 'Q3', value: 31, goal: 28 },
  { label: 'Q4', value: 27, goal: 30 }
];

const satisfactionData = [
  { label: 'Onboarding', value: 92 },
  { label: 'Suporte', value: 87 },
  { label: 'NPS', value: 74 },
  { label: 'Retenção', value: 68 }
];

const pulseData = [62, 64, 66, 71, 73, 75, 78, 80, 83, 86, 88, 91];
const churnData = [9, 8, 8, 7, 6.5, 6.2, 5.8, 5.4, 5.2, 4.9, 4.6, 4.3];

const menuItems = ['Visão geral', 'Clientes', 'Produtos', 'Relatórios', 'Configurações'];

const App = () => {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen bg-background text-text">
      <aside className="hidden w-64 flex-col border-r border-border bg-surface px-6 py-8 md:flex">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-accent-strong">CODEX</span>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-strong">
            {theme}
          </span>
        </div>
        <nav className="mt-10 space-y-1 text-sm">
          {menuItems.map((item) => (
            <a
              key={item}
              href="#"
              className="block rounded-xl px-4 py-2 font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-dashed border-border bg-surface p-4 text-xs text-text-muted">
          <p className="font-semibold text-text">Produtividade</p>
          <p className="mt-1 leading-relaxed">
            Utilize o modo {theme === 'dark' ? 'escuro' : 'claro'} para reduzir fadiga
            ocular e manter o foco em análises prolongadas.
          </p>
        </div>
      </aside>

      <main className="flex-1 bg-background">
        <header className="sticky top-0 z-10 border-b border-border bg-surface backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <div>
              <h1 className="text-2xl font-semibold text-text">Painel de desempenho</h1>
              <p className="text-sm text-text-muted">Monitoramento em tempo real dos indicadores de negócio.</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <TrendSparkline
              title="Receita recorrente"
              data={pulseData}
              caption="Últimos 12 meses"
              accent="positive"
            />
            <BarChart title="Performance trimestral" data={revenueData} metricSuffix="%" />
          </div>

          <div className="space-y-6">
            <TrendSparkline
              title="Rotatividade de clientes"
              data={churnData}
              caption="Churn (%)"
              accent="negative"
            />
            <BarChart title="Satisfação do cliente" data={satisfactionData} metricSuffix="%" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
