import KpiCard from './KpiCard';
import DonutProgressCard from './DonutProgressCard';
import GradientGoalsCard from './GradientGoalsCard';
import MonthlyPerformanceCard from './MonthlyPerformanceCard';
import CalendarCard from './CalendarCard';
import { dashboardSelectors } from '../../store/dashboardStore';

const Dashboard = () => {
  const kpis = dashboardSelectors.getKpis();
  const goalProgress = dashboardSelectors.getGoalProgress();
  const gradientGoals = dashboardSelectors.getGradientGoals();
  const monthlyPerformance = dashboardSelectors.getMonthlyPerformance();
  const transactions = dashboardSelectors.getTransactions();
  const accounts = dashboardSelectors.getAccounts();

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <MonthlyPerformanceCard data={monthlyPerformance} />
        <div className="grid gap-6">
          <DonutProgressCard progress={goalProgress} />
          <div className="gradient-border rounded-2xl bg-slate-900/60 p-[1px]">
            <div className="glass-card h-full rounded-[1.05rem] p-6">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Transações recentes</p>
                  <h3 className="text-lg font-semibold text-white">Contas & valores</h3>
                </div>
              </header>
              <ul className="mt-5 flex flex-col gap-4 text-sm text-slate-300">
                {transactions.slice(0, 4).map((transaction) => {
                  const account = accounts.find((item) => item.id === transaction.accountId);
                  const prefix = transaction.type === 'entrada' ? '+' : '-';
                  return (
                    <li key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{transaction.title}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')} · {account?.name ?? 'Conta não encontrada'}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold ${transaction.type === 'entrada' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {prefix}R$ {transaction.amount.toLocaleString('pt-BR')}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GradientGoalsCard goals={gradientGoals} />
        <CalendarCard />
      </section>
    </div>
  );
};

export default Dashboard;
