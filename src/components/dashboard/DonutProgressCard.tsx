import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { GoalProgress } from '../../types/dashboard';
import { dashboardSelectors } from '../../store/dashboardStore';

const COLORS = ['#38bdf8', 'rgba(148, 163, 184, 0.18)'];

type DonutProgressCardProps = {
  progress: GoalProgress;
};

const DonutProgressCard = ({ progress }: DonutProgressCardProps) => {
  const completion = dashboardSelectors.getGoalCompletionPercentage();

  const data = [
    { name: 'Concluído', value: progress.current },
    { name: 'Restante', value: Math.max(progress.target - progress.current, 0) }
  ];

  return (
    <article className="gradient-border rounded-2xl bg-slate-900/60 p-[1px]">
      <div className="glass-card flex h-full flex-col justify-between rounded-[1.05rem] p-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Progresso da meta</p>
            <h3 className="text-lg font-semibold text-white">{progress.label}</h3>
          </div>
          <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs text-slate-300">
            {completion}% concluído
          </span>
        </header>
        <div className="mt-6 flex flex-1 flex-col items-center justify-center">
          <div className="relative h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold text-white">{completion}%</span>
              <span className="text-xs text-slate-400">R$ {progress.current.toLocaleString('pt-BR')}K</span>
            </div>
          </div>
          <dl className="mt-6 grid w-full grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
              <dt className="flex items-center gap-2 text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                Concluído
              </dt>
              <dd className="mt-2 text-base font-semibold text-white">
                R$ {progress.current.toLocaleString('pt-BR')}K
              </dd>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
              <dt className="flex items-center gap-2 text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
                Restante
              </dt>
              <dd className="mt-2 text-base font-semibold text-white">
                R$ {(progress.target - progress.current).toLocaleString('pt-BR')}K
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
};

export default DonutProgressCard;
