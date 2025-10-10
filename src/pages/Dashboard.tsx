import { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useFinance } from '../contexts/FinanceContext';
import { formatCurrency, formatDate } from '../utils/format';

export function DashboardPage(): JSX.Element {
  const { transactions, totalIncome, totalExpense, balance, monthlySeries, latestTransactions, addTransaction } =
    useFinance();
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const incomes = useMemo(
    () =>
      [...transactions]
        .filter((transaction) => transaction.type === 'income')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions]
  );

  const expenses = useMemo(
    () =>
      [...transactions]
        .filter((transaction) => transaction.type === 'expense')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions]
  );

  const handleAddTransaction = (type: 'income' | 'expense') => {
    const valuePrompt = prompt(`Qual o valor da ${type === 'income' ? 'entrada' : 'saída'}? Utilize ponto para centavos.`);

    if (!valuePrompt) {
      return;
    }

    const normalized = valuePrompt.replace(',', '.');
    const amount = Number(normalized);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Informe um valor numérico válido maior que zero.');
      return;
    }

    const descriptionPrompt = prompt('Descrição (opcional):');
    const datePrompt = prompt('Data (AAAA-MM-DD). Deixe em branco para usar a data de hoje.');

    addTransaction(type, amount, descriptionPrompt ?? '', datePrompt ?? undefined);
  };

  const handleExport = async () => {
    if (!dashboardRef.current) {
      return;
    }

    try {
      setIsExporting(true);
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: '#030712'
      });
      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imageData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imageData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('finance-david-pro.pdf');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar__inner">
          <div>
            <h1 className="topbar__title">Finance David Pro</h1>
            <p className="topbar__subtitle">Controle elegante para entradas, saídas e previsões de caixa.</p>
          </div>
          <div className="topbar__actions">
            <button type="button" className="action-button action-button--solid" onClick={() => handleAddTransaction('income')}>
              + Registrar entrada
            </button>
            <button type="button" className="action-button" onClick={() => handleAddTransaction('expense')}>
              − Registrar saída
            </button>
            <button
              type="button"
              className="action-button"
              onClick={handleExport}
              disabled={isExporting}
              style={isExporting ? { opacity: 0.7, cursor: 'wait' } : undefined}
            >
              📄 Exportar PDF
            </button>
          </div>
        </div>
      </header>

      <main className="main-scroll" ref={dashboardRef}>
        <section id="overview" className="stat-grid">
          <article className="stat-card">
            <span className="stat-card__label">Entradas acumuladas</span>
            <strong className="stat-card__value">{formatCurrency(totalIncome)}</strong>
            <span className="stat-card__trend">
              <strong>✔</strong> Receita total registrada no período
            </span>
          </article>
          <article className="stat-card stat-card--danger">
            <span className="stat-card__label">Saídas totais</span>
            <strong className="stat-card__value">{formatCurrency(totalExpense)}</strong>
            <span className="stat-card__trend">
              <strong>•</strong> Custos e despesas consolidadas
            </span>
          </article>
          <article className="stat-card">
            <span className="stat-card__label">Saldo atualizado</span>
            <strong className="stat-card__value">{formatCurrency(balance)}</strong>
            <span className="stat-card__trend">
              <strong>{balance >= 0 ? 'Fluxo positivo' : 'Atenção com os custos'}</strong>
            </span>
          </article>
        </section>

        <section id="reports" className="panel">
          <div className="panel__header">
            <h3>Histórico financeiro</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySeries} margin={{ left: 12, right: 12, bottom: 12 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="rgba(255,255,255,0.45)"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(Number(value)).replace('R$', '')}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    background: 'rgba(8,17,33,0.9)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f5f6fb'
                  }}
                />
                <Line type="monotone" dataKey="income" stroke="#f0c24f" strokeWidth={3} dot={false} name="Entradas" />
                <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={3} dot={false} name="Saídas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section id="incomes" className="panel">
          <div className="panel__header">
            <h3>Entradas recentes</h3>
          </div>
          {incomes.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {incomes.slice(0, 6).map((income) => (
                  <tr key={income.id}>
                    <td>{income.description}</td>
                    <td>{formatDate(income.date)}</td>
                    <td className="table__amount table__amount--income" style={{ textAlign: 'right' }}>
                      {formatCurrency(income.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">Nenhuma entrada registrada até o momento.</p>
          )}
        </section>

        <section id="expenses" className="panel">
          <div className="panel__header">
            <h3>Saídas recentes</h3>
          </div>
          {expenses.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 6).map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>{formatDate(expense.date)}</td>
                    <td className="table__amount table__amount--expense" style={{ textAlign: 'right' }}>
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">Nenhuma saída registrada até o momento.</p>
          )}
        </section>

        <section className="panel">
          <div className="panel__header">
            <h3>Últimos movimentos</h3>
          </div>
          {latestTransactions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {latestTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.description}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td
                      className={`table__amount ${
                        transaction.type === 'income' ? 'table__amount--income' : 'table__amount--expense'
                      }`}
                      style={{ textAlign: 'right' }}
                    >
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">Cadastre novas entradas e saídas para visualizar o histórico.</p>
          )}
        </section>
      </main>
    </>
  );
}
