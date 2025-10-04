 codex/implement-usetheme-hook-and-context
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

 codex/create-kpi-cards-with-recharts
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.25),_transparent_55%)]">
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-10">
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Visão geral financeira</h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Acompanhe resultados, metas e eventos financeiros com cartões dinâmicos alimentados pela store centralizada.
          </p>
        </header>
        <Dashboard />
      </main>
    </div>
  );

 codex/create-dashboardlayout-components-and-routing
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return <RouterProvider router={router} />;

import { CalendarIcon, LineChartIcon } from './components/Icons';
import { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';
import shallow from 'zustand/shallow';
import { useFinanceStore } from './stores/financeStore';
import './App.css';

dayjs.extend(utc);

const chartData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Fev', revenue: 5800 },
  { month: 'Mar', revenue: 6100 },
  { month: 'Abr', revenue: 7200 },
  { month: 'Mai', revenue: 6900 },
  { month: 'Jun', revenue: 7600 }
];

function App() {
  const { events } = useFinanceStore((state) => ({ events: state.events }), shallow);

  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        start: dayjs.utc(event.start).format('YYYY-MM-DD'),
        end: dayjs.utc(event.end).format('YYYY-MM-DD')
      })),
    [events]
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted">Dashboard Financeiro</p>
            <h1 className="text-3xl font-bold text-primary">Visão Geral</h1>
          </div>
          <div className="flex gap-4">
            <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition hover:brightness-110">
              <LineChartIcon className="h-4 w-4" /> Relatórios
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary hover:text-primary">
              <CalendarIcon className="h-4 w-4" /> Calendário
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface/80 p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Receitas</h2>
            <span className="text-sm text-muted">Últimos 6 meses</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" stroke="var(--color-muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted)" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-muted)'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-lg border border-border bg-surface/80 p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Agenda</h2>
            <span className="text-sm text-muted">Próximos eventos</span>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            height="100%"
            headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
            buttonText={{ today: 'Hoje' }}
          />
 dev
        </section>
      </main>
    </div>
  );
 codex/implement-usetheme-hook-and-context
};

 dev
 dev
}
 dev

export default App;
