import type { GradientGoal } from '../../types/dashboard';

type GradientGoalsCardProps = {
  goals: GradientGoal[];
};

const GradientGoalsCard = ({ goals }: GradientGoalsCardProps) => (
  <article className="gradient-border rounded-2xl bg-slate-900/60 p-[1px]">
    <div className="glass-card h-full rounded-[1.05rem] p-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Metas estratégicas</p>
        <h3 className="text-lg font-semibold text-white">Acompanhamento de squads</h3>
        <p className="mt-1 text-sm text-slate-400">
          Cada barra representa a evolução da squad responsável por uma meta crítica do planejamento anual.
        </p>
      </header>
      <div className="flex flex-col gap-5">
        {goals.map((goal) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          const gradientStyle = {
            background: `linear-gradient(90deg, ${goal.gradientFrom}, ${goal.gradientTo})`
          };

          return (
            <div key={goal.id} className="rounded-xl border border-slate-800/70 bg-slate-900/50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <div className="font-medium text-white">{goal.label}</div>
                <span>
                  {goal.current} / {goal.target}
                </span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-slate-800/80">
                <div
                  className="h-full rounded-full shadow-lg shadow-slate-900/60"
                  style={{ width: `${Math.min(percentage, 100)}%`, ...gradientStyle }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>{percentage}% atingido</span>
                <span>Meta restante: {Math.max(goal.target - goal.current, 0)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </article>
);

export default GradientGoalsCard;
