import { memo } from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import type { KpiCard as KpiCardType } from '../../types/dashboard';

const formatDelta = (delta: number) =>
  `${delta > 0 ? '+' : ''}${delta.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

type KpiCardProps = {
  kpi: KpiCardType;
};

const tooltipStyles = {
  background: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  borderRadius: '0.75rem',
  color: '#e2e8f0',
  padding: '0.5rem 0.75rem',
  fontSize: '0.75rem'
};

const SparklineTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  return (
    <div style={tooltipStyles}>
      <div className="font-semibold text-slate-200">{point?.payload?.label}</div>
      <div className="text-xs text-slate-400">{point?.value?.toLocaleString('pt-BR')}k</div>
    </div>
  );
};

const KpiCard = ({ kpi }: KpiCardProps) => {
  const isPositive = kpi.delta >= 0;
  const deltaColor = isPositive ? 'text-emerald-400' : 'text-rose-400';
  const trendColor = isPositive ? '#22c55e' : '#f43f5e';

  return (
    <article className="gradient-border rounded-2xl bg-slate-900/60 p-[1px]">
      <div className="glass-card h-full rounded-[1.05rem] p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">{kpi.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{kpi.value}</p>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${deltaColor}`}>
            <span>{formatDelta(kpi.delta)}</span>
            <span className="text-slate-400">{kpi.deltaLabel}</span>
          </div>
        </div>
        <div className="mt-4 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpi.trend} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
              <Tooltip cursor={false} content={<SparklineTooltip />} />
              <Line type="monotone" dataKey="value" stroke={trendColor} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </article>
  );
};

export default memo(KpiCard);
