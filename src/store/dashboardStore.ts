import { DashboardState } from '../types/dashboard';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
};

const dashboardState: DashboardState = {
  kpis: [
    {
      id: 'revenue',
      label: 'Receita mensal',
      value: 'R$ 248,4K',
      delta: 12.4,
      deltaLabel: 'vs. último mês',
      trend: [
        { label: 'Jan', value: 152 },
        { label: 'Fev', value: 168 },
        { label: 'Mar', value: 180 },
        { label: 'Abr', value: 195 },
        { label: 'Mai', value: 210 },
        { label: 'Jun', value: 248 }
      ]
    },
    {
      id: 'expenses',
      label: 'Despesas totais',
      value: 'R$ 142,9K',
      delta: -4.1,
      deltaLabel: 'otimização',
      trend: [
        { label: 'Jan', value: 138 },
        { label: 'Fev', value: 141 },
        { label: 'Mar', value: 146 },
        { label: 'Abr', value: 150 },
        { label: 'Mai', value: 148 },
        { label: 'Jun', value: 142 }
      ]
    },
    {
      id: 'cashflow',
      label: 'Fluxo de caixa',
      value: 'R$ 84,6K',
      delta: 7.9,
      deltaLabel: 'média 90 dias',
      trend: [
        { label: 'Jan', value: 62 },
        { label: 'Fev', value: 58 },
        { label: 'Mar', value: 70 },
        { label: 'Abr', value: 74 },
        { label: 'Mai', value: 80 },
        { label: 'Jun', value: 85 }
      ]
    },
    {
      id: 'conversion',
      label: 'Taxa de conversão',
      value: '32,4%',
      delta: 3.6,
      deltaLabel: 'pipelines fechados',
      trend: [
        { label: 'Jan', value: 24 },
        { label: 'Fev', value: 26 },
        { label: 'Mar', value: 27 },
        { label: 'Abr', value: 29 },
        { label: 'Mai', value: 31 },
        { label: 'Jun', value: 32 }
      ]
    }
  ],
  goalProgress: {
    id: 'annual-goal',
    label: 'Meta anual',
    current: 780,
    target: 1000
  },
  gradientGoals: [
    {
      id: 'pipeline',
      label: 'Pipeline qualificado',
      current: 68,
      target: 80,
      gradientFrom: '#0ea5e9',
      gradientTo: '#22d3ee'
    },
    {
      id: 'expansion',
      label: 'Expansão de contas',
      current: 45,
      target: 60,
      gradientFrom: '#a855f7',
      gradientTo: '#6366f1'
    },
    {
      id: 'retention',
      label: 'Retenção de clientes',
      current: 92,
      target: 95,
      gradientFrom: '#22c55e',
      gradientTo: '#84cc16'
    }
  ],
  monthlyPerformance: [
    { month: 'Jan', revenue: 152, expenses: 138, profit: 14 },
    { month: 'Fev', revenue: 168, expenses: 141, profit: 27 },
    { month: 'Mar', revenue: 180, expenses: 146, profit: 34 },
    { month: 'Abr', revenue: 195, expenses: 150, profit: 45 },
    { month: 'Mai', revenue: 210, expenses: 148, profit: 62 },
    { month: 'Jun', revenue: 248, expenses: 142, profit: 106 }
  ],
  accounts: [
    { id: 'acc-1', name: 'Conta Principal', color: '#38bdf8' },
    { id: 'acc-2', name: 'Receitas internacionais', color: '#a855f7' },
    { id: 'acc-3', name: 'Operações', color: '#22c55e' }
  ],
  transactions: [
    {
      id: 'tx-1001',
      title: 'Entrada contrato SaaS',
      amount: 58000,
      type: 'entrada',
      accountId: 'acc-1',
      date: '2024-06-04'
    },
    {
      id: 'tx-1002',
      title: 'Pagamento fornecedores',
      amount: 18500,
      type: 'saída',
      accountId: 'acc-3',
      date: '2024-06-06'
    },
    {
      id: 'tx-1003',
      title: 'Renovação cliente enterprise',
      amount: 92000,
      type: 'entrada',
      accountId: 'acc-2',
      date: '2024-06-11'
    },
    {
      id: 'tx-1004',
      title: 'Folha salarial',
      amount: 46500,
      type: 'saída',
      accountId: 'acc-3',
      date: '2024-06-15'
    },
    {
      id: 'tx-1005',
      title: 'Implantação parceiro',
      amount: 28500,
      type: 'entrada',
      accountId: 'acc-1',
      date: '2024-06-20'
    },
    {
      id: 'tx-1006',
      title: 'Investimento marketing',
      amount: 12500,
      type: 'saída',
      accountId: 'acc-1',
      date: '2024-06-22'
    }
  ]
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});

const findAccountColor = (accountId: string) =>
  dashboardState.accounts.find((account) => account.id === accountId)?.color ?? '#1f2937';

const buildCalendarEvents = (): CalendarEvent[] =>
  dashboardState.transactions.map((transaction) => {
    const amountPrefix = transaction.type === 'entrada' ? '+' : '-';
    const amountColor = findAccountColor(transaction.accountId);

    return {
      id: transaction.id,
      title: `${transaction.title} (${amountPrefix}${currencyFormatter.format(transaction.amount)})`,
      date: transaction.date,
      backgroundColor: amountColor,
      borderColor: amountColor
    };
  });

export const dashboardSelectors = {
  getKpis: () => dashboardState.kpis,
  getGoalProgress: () => dashboardState.goalProgress,
  getGradientGoals: () => dashboardState.gradientGoals,
  getMonthlyPerformance: () => dashboardState.monthlyPerformance,
  getAccounts: () => dashboardState.accounts,
  getTransactions: () => dashboardState.transactions,
  getCalendarEvents: () => buildCalendarEvents(),
  getGoalCompletionPercentage: () =>
    Math.min(100, Math.round((dashboardState.goalProgress.current / dashboardState.goalProgress.target) * 100))
};

export type { CalendarEvent };
