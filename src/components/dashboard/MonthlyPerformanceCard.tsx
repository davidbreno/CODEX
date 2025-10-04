import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { MonthlyPerformance } from '../../types/dashboard';

const tooltipStyles = {
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  borderRadius: '0.75rem',
  color: '#e2e8f0',
  padding: '0.75rem 1rem',
  fontSize: '0.8rem'
};

type MonthlyPerformanceCardProps = {
  data: MonthlyPerformance[];
};

const MonthlyPerformanceCard = ({ data }: MonthlyPerformanceCardProps) => {
  const totalRevenue = data.reduce((acc, item) => acc + item.revenue, 0);
  const totalExpenses = data.reduce((acc, item) => acc + item.expenses, 0);

  return (
    <article className="gradient-border rounded-2xl bg-slate-900/60 p-[1px]">
      <div className="glass-card h-full rounded-[1.05rem] p-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Desempenho mensal</p>
            <h3 className="text-lg font-semibold text-white">Receita x Despesa</h3>
          </div>
          <div className="flex gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-sky-400" /> Receita: R$ {totalRevenue.toLocaleString('pt-BR')}K
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Despesa: R$ {totalExpenses.toLocaleString('pt-BR')}K
            </span>
          </div>
        </header>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={6} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}k`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const [revenue, expense] = payload;
                  return (
                    <div style={tooltipStyles}>
                      <p className="text-sm font-semibold text-white">{revenue?.payload?.month}</p>
                      <p className="mt-1 text-xs text-slate-300">
                        Receita: R$ {revenue?.value?.toLocaleString('pt-BR')}K
                      </p>
                      <p className="text-xs text-slate-300">
                        Despesa: R$ {expense?.value?.toLocaleString('pt-BR')}K
                      </p>
                      <p className="mt-1 text-xs text-emerald-400">
                        Lucro: R$ {revenue && expense ? (revenue.value - expense.value).toLocaleString('pt-BR') : 0}K
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="revenue" fill="#38bdf8" radius={[8, 8, 8, 8]} />
              <Bar dataKey="expenses" fill="#f87171" radius={[8, 8, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </article>
  );
};

export default MonthlyPerformanceCard;
