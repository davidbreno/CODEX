import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return <RouterProvider router={router} />;
import type { JSX } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import {
  ConfiguracoesPage,
  ContasAPagarPage,
  DashboardPage,
  EntradaPage,
  GraficoPizzaPage,
  LoginPage,
  SaidaPage,
  TemasPage
} from './pages';

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="entrada" element={<EntradaPage />} />
          <Route path="saida" element={<SaidaPage />} />
          <Route path="contas-a-pagar" element={<ContasAPagarPage />} />
          <Route path="grafico-pizza" element={<GraficoPizzaPage />} />
          <Route path="temas" element={<TemasPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
import { CSSProperties, FormEvent, useMemo, useState } from 'react';
import './index.css';

type ThemeKey = 'noite' | 'aurora' | 'oceano';

type TransactionType = 'entrada' | 'saida';

type BillStatus = 'pagar' | 'pagas' | 'vencer';

interface Transaction {
  id: number;
  categoria: string;
  valor: number;
  data: string;
  tipo: TransactionType;
}

interface Bill {
  id: number;
  titulo: string;
  valor: number;
  vencimento: string;
  status: BillStatus;
}

const themePresets: Record<ThemeKey, CSSProperties> = {
  noite: {
    '--bg': '#050617',
    '--bg-gradient': 'radial-gradient(circle at top, rgba(91, 33, 182, 0.45), transparent 55%)',
    '--surface': 'rgba(15, 23, 42, 0.65)',
    '--surface-strong': 'rgba(30, 41, 59, 0.85)',
    '--surface-dim': 'rgba(15, 23, 42, 0.45)',
    '--border': 'rgba(148, 163, 184, 0.28)',
    '--fg': '#f8fafc',
    '--muted': '#cbd5f5',
    '--accent': '#60a5fa',
    '--accent-soft': 'rgba(96, 165, 250, 0.16)',
    '--accent-strong': '#3b82f6',
    '--outline': 'rgba(96, 165, 250, 0.35)',
    '--shadow': '0 24px 65px rgba(15, 23, 42, 0.55)',
    '--chart-1': '#34d399',
    '--chart-2': '#60a5fa',
    '--chart-3': '#f59e0b'
  },
  aurora: {
    '--bg': '#0b0d19',
    '--bg-gradient': 'radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.4), transparent 60%), radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.35), transparent 55%)',
    '--surface': 'rgba(17, 25, 40, 0.75)',
    '--surface-strong': 'rgba(31, 41, 55, 0.88)',
    '--surface-dim': 'rgba(17, 24, 39, 0.55)',
    '--border': 'rgba(244, 114, 182, 0.35)',
    '--fg': '#fdf2f8',
    '--muted': '#fbcfe8',
    '--accent': '#fb7185',
    '--accent-soft': 'rgba(248, 113, 113, 0.16)',
    '--accent-strong': '#f472b6',
    '--outline': 'rgba(251, 113, 133, 0.36)',
    '--shadow': '0 28px 70px rgba(76, 29, 149, 0.5)',
    '--chart-1': '#f472b6',
    '--chart-2': '#38bdf8',
    '--chart-3': '#facc15'
  },
  oceano: {
    '--bg': '#04161f',
    '--bg-gradient': 'radial-gradient(circle at top, rgba(14, 165, 233, 0.45), transparent 60%), radial-gradient(circle at 10% 80%, rgba(16, 185, 129, 0.35), transparent 45%)',
    '--surface': 'rgba(8, 47, 73, 0.7)',
    '--surface-strong': 'rgba(13, 64, 103, 0.9)',
    '--surface-dim': 'rgba(8, 47, 73, 0.55)',
    '--border': 'rgba(45, 212, 191, 0.28)',
    '--fg': '#ecfeff',
    '--muted': '#bae6fd',
    '--accent': '#2dd4bf',
    '--accent-soft': 'rgba(45, 212, 191, 0.18)',
    '--accent-strong': '#0ea5e9',
    '--outline': 'rgba(45, 212, 191, 0.35)',
    '--shadow': '0 24px 60px rgba(8, 47, 73, 0.55)',
    '--chart-1': '#2dd4bf',
    '--chart-2': '#0ea5e9',
    '--chart-3': '#f97316'
  }
};

const themeLabels: Record<ThemeKey, string> = {
  noite: 'Noite Profunda',
  aurora: 'Aurora Digital',
  oceano: 'Brisa do Oceano'
};

const initialTransactions: Transaction[] = [
  { id: 1, categoria: 'Consultoria', valor: 4200, data: '2024-06-05', tipo: 'entrada' },
  { id: 2, categoria: 'Cursos Online', valor: 2800, data: '2024-06-11', tipo: 'entrada' },
  { id: 3, categoria: 'Software', valor: 950, data: '2024-06-07', tipo: 'saida' },
  { id: 4, categoria: 'Marketing', valor: 1200, data: '2024-06-10', tipo: 'saida' },
  { id: 5, categoria: 'Mentorias', valor: 1800, data: '2024-06-14', tipo: 'entrada' }
];

const initialBills: Bill[] = [
  { id: 1, titulo: 'Aluguel Escritório', valor: 3200, vencimento: '2024-06-20', status: 'pagar' },
  { id: 2, titulo: 'Serviços em Nuvem', valor: 780, vencimento: '2024-06-15', status: 'pagar' },
  { id: 3, titulo: 'Equipe Freelancer', valor: 2100, vencimento: '2024-06-08', status: 'pagas' },
  { id: 4, titulo: 'Impostos Trimestrais', valor: 5400, vencimento: '2024-07-05', status: 'vencer' },
  { id: 5, titulo: 'Energia', valor: 480, vencimento: '2024-06-12', status: 'pagas' }
];

const fluxoMensal = [21500, 23800, 25400, 24750, 26300, 27840];
const fluxoLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

const formatDate = (isoDate: string) =>
  new Date(isoDate + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });

const AuthScreen = ({
  mode,
  onSwitch,
  onSuccess
}: {
  mode: 'login' | 'register';
  onSwitch: (next: 'login' | 'register') => void;
  onSuccess: () => void;
}) => {
  const title = mode === 'login' ? 'Acesse o Financ David' : 'Crie sua conta no Financ David';
  const subtitle =
    mode === 'login'
      ? 'Centralize entradas, saídas e contas em um único painel visual.'
      : 'Organize suas finanças e acompanhe resultados com gráficos intuitivos.';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSuccess();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">FD</span>
          <div>
            <p className="brand-name">Financ David</p>
            <p className="brand-motto">Sua central de performance financeira</p>
          </div>
        </div>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Nome completo
              <input placeholder="Informe como deseja ser chamado" required />
            </label>
          )}
          <label>
            E-mail corporativo
            <input type="email" placeholder="voce@empresa.com" required />
          </label>
          <label>
            Senha segura
            <input type="password" placeholder="Mínimo 8 caracteres" required />
          </label>
          {mode === 'register' && (
            <label>
              Confirme a senha
              <input type="password" placeholder="Repita a senha" required />
            </label>
          )}
          <button type="submit" className="primary-button">
            {mode === 'login' ? 'Entrar no painel' : 'Criar conta gratuita'}
          </button>
        </form>
        <button className="ghost-button" onClick={() => onSwitch(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Ainda não tem conta? Criar usuário' : 'Já possui acesso? Fazer login'}
        </button>
      </div>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState<ThemeKey>('noite');
  const [stage, setStage] = useState<'login' | 'register' | 'dashboard'>('login');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [bills, setBills] = useState(initialBills);
  const [activePanel, setActivePanel] = useState<'entrada' | 'saida' | 'pagar' | 'pagas' | 'vencer'>('entrada');
  const [entradaForm, setEntradaForm] = useState({ categoria: '', valor: '' });
  const [saidaForm, setSaidaForm] = useState({ categoria: '', valor: '' });

  const totalEntradas = useMemo(
    () => transactions.filter((item) => item.tipo === 'entrada').reduce((acc, item) => acc + item.valor, 0),
    [transactions]
  );

  const totalSaidas = useMemo(
    () => transactions.filter((item) => item.tipo === 'saida').reduce((acc, item) => acc + item.valor, 0),
    [transactions]
  );

  const saldoAtual = totalEntradas - totalSaidas;

  const contasResumo = useMemo(() => {
    const pagar = bills.filter((bill) => bill.status === 'pagar');
    const pagas = bills.filter((bill) => bill.status === 'pagas');
    const vencer = bills.filter((bill) => bill.status === 'vencer');
    return { pagar, pagas, vencer };
  }, [bills]);

  const pizzaStyle = useMemo(() => {
    const total = totalEntradas + totalSaidas;
    if (total === 0) {
      return { background: `conic-gradient(var(--chart-2) 0 50%, var(--chart-1) 50% 100%)` };
    }
    const entradaPercent = Math.round((totalEntradas / total) * 100);
    const saidaPercent = 100 - entradaPercent;
    return {
      background: `conic-gradient(var(--chart-1) 0 ${entradaPercent}%, var(--chart-2) ${entradaPercent}% ${entradaPercent + saidaPercent}%)`
    };
  }, [totalEntradas, totalSaidas]);

  const linePoints = useMemo(() => {
    const max = Math.max(...fluxoMensal);
    const min = Math.min(...fluxoMensal);
    const normalize = (value: number) => ((value - min) / (max - min || 1)) * 90 + 5;
    return fluxoMensal.map((value, index) => `${(index / (fluxoMensal.length - 1)) * 100},${100 - normalize(value)}`).join(' ');
  }, []);

  const handleAddTransaction = (tipo: TransactionType) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = tipo === 'entrada' ? entradaForm : saidaForm;
    const valor = Number(form.valor.replace(',', '.'));
    if (!form.categoria || Number.isNaN(valor) || valor <= 0) {
      return;
    }

    const novaTransacao: Transaction = {
      id: Date.now(),
      categoria: form.categoria,
      valor,
      data: new Date().toISOString().slice(0, 10),
      tipo
    };

    setTransactions((prev) => [novaTransacao, ...prev]);
    if (tipo === 'entrada') {
      setEntradaForm({ categoria: '', valor: '' });
    } else {
      setSaidaForm({ categoria: '', valor: '' });
    }
  };

  const handleMarkAsPaid = (id: number) => {
    setBills((previous) =>
      previous.map((bill) => (bill.id === id ? { ...bill, status: 'pagas' as BillStatus } : bill))
    );
  };

  const filteredBills = useMemo(() => {
    if (activePanel === 'entrada' || activePanel === 'saida') {
      return [] as Bill[];
    }
    return bills.filter((bill) => bill.status === activePanel);
  }, [activePanel, bills]);

  const renderActivePanel = () => {
    if (activePanel === 'entrada') {
      return (
        <form className="panel-form" onSubmit={handleAddTransaction('entrada')}>
          <h3>Registrar nova entrada</h3>
          <p>Atualize seu fluxo com valores recebidos de vendas, consultorias ou assinaturas.</p>
          <label>
            Categoria
            <input
              placeholder="Ex.: Consultoria premium"
              value={entradaForm.categoria}
              onChange={(event) => setEntradaForm((prev) => ({ ...prev, categoria: event.target.value }))}
            />
          </label>
          <label>
            Valor (R$)
            <input
              inputMode="decimal"
              placeholder="Ex.: 1500"
              value={entradaForm.valor}
              onChange={(event) => setEntradaForm((prev) => ({ ...prev, valor: event.target.value }))}
            />
          </label>
          <button type="submit" className="primary-button">
            Registrar entrada
          </button>
        </form>
      );
    }

    if (activePanel === 'saida') {
      return (
        <form className="panel-form" onSubmit={handleAddTransaction('saida')}>
          <h3>Cadastrar nova saída</h3>
          <p>Controle despesas fixas e investimentos para manter o caixa saudável.</p>
          <label>
            Categoria
            <input
              placeholder="Ex.: Ferramentas SaaS"
              value={saidaForm.categoria}
              onChange={(event) => setSaidaForm((prev) => ({ ...prev, categoria: event.target.value }))}
            />
          </label>
          <label>
            Valor (R$)
            <input
              inputMode="decimal"
              placeholder="Ex.: 890"
              value={saidaForm.valor}
              onChange={(event) => setSaidaForm((prev) => ({ ...prev, valor: event.target.value }))}
            />
          </label>
          <button type="submit" className="primary-button">
            Registrar saída
          </button>
        </form>
      );
    }

    return (
      <div className="panel-list">
        <h3>
          {activePanel === 'pagar'
            ? 'Contas a pagar'
            : activePanel === 'pagas'
            ? 'Contas pagas recentemente'
            : 'Contas a vencer'}
        </h3>
        <p>
          {activePanel === 'pagar'
            ? 'Visualize contas pendentes e mantenha o planejamento em dia.'
            : activePanel === 'pagas'
            ? 'Parabéns! Estes compromissos já foram liquidados com sucesso.'
            : 'Antecipe valores que vencem em breve e evite surpresas no caixa.'}
        </p>
        <ul>
          {filteredBills.map((bill) => (
            <li key={bill.id}>
              <div>
                <strong>{bill.titulo}</strong>
                <span>{formatCurrency(bill.valor)}</span>
              </div>
              <div className="bill-meta">
                <span>Vencimento: {formatDate(bill.vencimento)}</span>
                {bill.status === 'pagar' && (
                  <button className="mini-button" onClick={() => handleMarkAsPaid(bill.id)} type="button">
                    Marcar como paga
                  </button>
                )}
              </div>
            </li>
          ))}
          {filteredBills.length === 0 && <li className="empty">Nada por aqui. Aproveite para revisar seu planejamento.</li>}
        </ul>
      </div>
    );
  };

  const actionButtons: { key: typeof activePanel; title: string; description: string }[] = [
    { key: 'entrada', title: 'Entrada de valores', description: 'Adicione receitas recorrentes, vendas avulsas ou outros ganhos.' },
    { key: 'saida', title: 'Saída de valores', description: 'Lance despesas operacionais e investimentos estratégicos.' },
    { key: 'pagar', title: 'Contas a pagar', description: 'Antecipe quais pagamentos exigem atenção imediata.' },
    { key: 'pagas', title: 'Contas pagas', description: 'Acompanhe compromissos já quitados neste ciclo.' },
    { key: 'vencer', title: 'Contas a vencer', description: 'Planeje-se com base nos próximos vencimentos confirmados.' }
  ];

  return (
    <div className="app" style={themePresets[theme]}>
      <div className="app-glow" />
      {stage !== 'dashboard' ? (
        <AuthScreen mode={stage} onSwitch={setStage} onSuccess={() => setStage('dashboard')} />
      ) : (
        <div className="dashboard">
          <aside className="sidebar">
            <div className="sidebar-brand">
              <div className="brand-icon">FD</div>
              <div>
                <p className="brand-title">Financ David</p>
                <p className="brand-caption">Gestão financeira inteligente</p>
              </div>
            </div>
            <nav>
              <a className="active" href="#visao">
                Visão geral
              </a>
              <a href="#fluxo">Fluxo de caixa</a>
              <a href="#relatorios">Relatórios</a>
              <a href="#metas">Metas e OKRs</a>
              <a href="#config">Configurações</a>
            </nav>
            <div className="sidebar-footer">
              <p>Temas dinâmicos</p>
              <div className="theme-options">
                {(Object.keys(themePresets) as ThemeKey[]).map((key) => {
                  const accentColor = themePresets[key]['--accent'] as string | undefined;
                  const accentStrong = themePresets[key]['--accent-strong'] as string | undefined;
                  return (
                    <button
                      key={key}
                      className={key === theme ? 'theme-dot active' : 'theme-dot'}
                      onClick={() => setTheme(key)}
                      style={{
                        background: accentColor,
                        borderColor: key === theme ? accentStrong : 'transparent'
                      }}
                      aria-label={`Ativar tema ${themeLabels[key]}`}
                    >
                      <span>{themeLabels[key]}</span>
                    </button>
                  );
                })}
              </div>
              <button className="ghost-button" onClick={() => setStage('login')}>
                Sair do painel
              </button>
            </div>
          </aside>
          <main className="content" id="visao">
            <header className="content-header">
              <div>
                <h1>Bem-vindo(a), David!</h1>
                <p>Mantenha seu ecossistema financeiro sob controle com indicadores em tempo real.</p>
              </div>
              <div className="header-actions">
                <div className="search-box">
                  <input placeholder="Pesquisar lançamentos, contas e relatórios" />
                </div>
                <div className="theme-switcher">
                  {(Object.keys(themePresets) as ThemeKey[]).map((key) => (
                    <button
                      key={key}
                      className={key === theme ? 'switcher-item active' : 'switcher-item'}
                      onClick={() => setTheme(key)}
                    >
                      {themeLabels[key]}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <section className="summary-grid">
              <article className="summary-card">
                <header>
                  <span>Saldo atual</span>
                  <span className="tag success">+12,4% este mês</span>
                </header>
                <strong>{formatCurrency(saldoAtual)}</strong>
                <footer>
                  <div className="progress">
                    <div className="progress-value" style={{ width: `${Math.min(100, (saldoAtual / 30000) * 100)}%` }} />
                  </div>
                  <span>Meta mensal: {formatCurrency(30000)}</span>
                </footer>
              </article>
              <article className="summary-card">
                <header>
                  <span>Entradas do mês</span>
                  <span className="tag info">{transactions.filter((t) => t.tipo === 'entrada').length} lançamentos</span>
                </header>
                <strong>{formatCurrency(totalEntradas)}</strong>
                <footer>Principais fontes: Consultoria, Mentorias, Cursos</footer>
              </article>
              <article className="summary-card">
                <header>
                  <span>Saídas do mês</span>
                  <span className="tag warning">Controle as despesas</span>
                </header>
                <strong>{formatCurrency(totalSaidas)}</strong>
                <footer>Investimentos em tecnologia e marketing</footer>
              </article>
              <article className="summary-card">
                <header>
                  <span>Contas monitoradas</span>
                  <span className="tag neutral">Atualizado agora</span>
                </header>
                <strong>{contasResumo.pagar.length + contasResumo.pagas.length + contasResumo.vencer.length}</strong>
                <footer>
                  {contasResumo.pagar.length} a pagar · {contasResumo.vencer.length} a vencer · {contasResumo.pagas.length} pagas
                </footer>
              </article>
            </section>

            <section className="charts-grid" id="fluxo">
              <article className="chart-card">
                <header>
                  <div>
                    <h2>Fluxo mensal consolidado</h2>
                    <p>Comparativo dos últimos seis meses com destaque para tendência de crescimento.</p>
                  </div>
                  <span className="tag outline">Atualizado há 5 min</span>
                </header>
                <div className="line-chart">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <polyline fill="url(#lineGradient)" stroke="var(--chart-2)" strokeWidth="1.5" points={`0,100 ${linePoints} 100,100`} />
                    <polyline fill="none" stroke="var(--chart-1)" strokeWidth="1.5" points={linePoints} />
                  </svg>
                </div>
                <div className="chart-legend">
                  {fluxoLabels.map((label, index) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{formatCurrency(fluxoMensal[index])}</strong>
                    </div>
                  ))}
                </div>
              </article>
              <article className="chart-card pizza-card">
                <header>
                  <div>
                    <h2>Distribuição de entradas x saídas</h2>
                    <p>Veja rapidamente como o caixa está equilibrado neste ciclo.</p>
                  </div>
                </header>
                <div className="pizza-wrapper">
                  <div className="pizza" style={pizzaStyle}>
                    <div className="pizza-center">
                      <span>Total</span>
                      <strong>{formatCurrency(totalEntradas + totalSaidas)}</strong>
                    </div>
                  </div>
                  <ul className="pizza-legend">
                    <li>
                      <span className="dot" style={{ background: 'var(--chart-1)' }} />
                      <div>
                        <p>Entradas</p>
                        <strong>{formatCurrency(totalEntradas)}</strong>
                      </div>
                    </li>
                    <li>
                      <span className="dot" style={{ background: 'var(--chart-2)' }} />
                      <div>
                        <p>Saídas</p>
                        <strong>{formatCurrency(totalSaidas)}</strong>
                      </div>
                    </li>
                  </ul>
                </div>
              </article>
            </section>

            <section className="actions-section" id="relatorios">
              <div className="actions-buttons">
                {actionButtons.map((action) => (
                  <button
                    key={action.key}
                    className={action.key === activePanel ? 'action-button active' : 'action-button'}
                    onClick={() => setActivePanel(action.key)}
                  >
                    <strong>{action.title}</strong>
                    <span>{action.description}</span>
                  </button>
                ))}
              </div>
              <div className="actions-panel">{renderActivePanel()}</div>
            </section>

            <section className="recent-section" id="metas">
              <article className="recent-card">
                <header>
                  <h2>Movimentações recentes</h2>
                  <span className="tag outline">{transactions.length} registros</span>
                </header>
                <ul>
                  {transactions.slice(0, 6).map((transaction) => (
                    <li key={transaction.id}>
                      <div>
                        <strong>{transaction.categoria}</strong>
                        <span>{formatDate(transaction.data)}</span>
                      </div>
                      <span className={transaction.tipo === 'entrada' ? 'value in' : 'value out'}>
                        {transaction.tipo === 'entrada' ? '+' : '-'}
                        {formatCurrency(transaction.valor)}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="recent-card">
                <header>
                  <h2>Planos e metas</h2>
                  <span className="tag neutral">Foco trimestral</span>
                </header>
                <ul className="goals-list">
                  <li>
                    <div>
                      <strong>Expandir faturamento recorrente</strong>
                      <p>Adicionar 15 novos clientes de consultoria premium.</p>
                    </div>
                    <div className="goal-progress">
                      <div className="goal-bar" style={{ width: '68%' }} />
                      <span>68% concluído</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Reduzir inadimplência</strong>
                      <p>Automatizar cobranças e negociar antecipadamente.</p>
                    </div>
                    <div className="goal-progress">
                      <div className="goal-bar" style={{ width: '45%' }} />
                      <span>45% concluído</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Reservar caixa para investimentos</strong>
                      <p>Acumular R$ 40.000 para expansão de equipe.</p>
                    </div>
                    <div className="goal-progress">
                      <div className="goal-bar" style={{ width: '54%' }} />
                      <span>54% concluído</span>
                    </div>
                  </li>
                </ul>
              </article>
            </section>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
