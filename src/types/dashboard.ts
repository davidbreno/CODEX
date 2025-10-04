export type TrendPoint = {
  label: string;
  value: number;
};

export type KpiCard = {
  id: string;
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  trend: TrendPoint[];
};

export type GoalProgress = {
  id: string;
  label: string;
  current: number;
  target: number;
};

export type GradientGoal = GoalProgress & {
  gradientFrom: string;
  gradientTo: string;
};

export type MonthlyPerformance = {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
};

export type Account = {
  id: string;
  name: string;
  color: string;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: 'entrada' | 'saída';
  accountId: string;
  date: string;
};

export type DashboardState = {
  kpis: KpiCard[];
  goalProgress: GoalProgress;
  gradientGoals: GradientGoal[];
  monthlyPerformance: MonthlyPerformance[];
  accounts: Account[];
  transactions: Transaction[];
};
