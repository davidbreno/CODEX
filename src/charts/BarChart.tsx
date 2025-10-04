interface BarDatum {
  label: string;
  value: number;
  goal?: number;
}

interface BarChartProps {
  title: string;
  data: BarDatum[];
  metricSuffix?: string;
}

export const BarChart = ({ title, data, metricSuffix = '%' }: BarChartProps) => {
  const max = Math.max(...data.map((item) => item.goal ?? item.value), 1);

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <header className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
          {title}
        </h3>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-strong">
          {metricSuffix.trim()}
        </span>
      </header>
      <div className="space-y-4">
        {data.map(({ label, value, goal }) => {
          const percentage = Math.round((Math.abs(value) / max) * 100);
          const isPositive = value >= 0;
          const barColor = isPositive ? 'var(--positive)' : 'var(--negative)';

          return (
            <article key={label} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-text-muted">
                <span>{label}</span>
                <span className="text-text">
                  {value}
                  {metricSuffix}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-track">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    background: barColor,
                    boxShadow: `0 4px 16px -12px ${barColor}`
                  }}
                />
              </div>
              {typeof goal === 'number' && (
                <div className="flex justify-between text-[11px] text-text-muted">
                  <span>Meta: {goal}</span>
                  <span>
                    {goal > value ? 'Abaixo da meta' : 'Acima da meta'}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
