interface TrendSparklineProps {
  title: string;
  data: number[];
  caption: string;
  accent?: 'accent' | 'positive' | 'negative';
}

const normalizePoints = (values: number[], width: number, height: number) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
};

export const TrendSparkline = ({
  title,
  data,
  caption,
  accent = 'accent'
}: TrendSparklineProps) => {
  const width = 280;
  const height = 96;
  const points = normalizePoints(data, width, height - 8);
  const gradientId = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-gradient`;
  const strokeColor = `var(--${accent})`;
  const fillColor =
    accent === 'accent'
      ? 'var(--accent-soft)'
      : accent === 'positive'
        ? 'var(--positive-soft)'
        : 'var(--negative-soft)';

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {title}
          </p>
          <p className="text-2xl font-semibold text-text">{data[data.length - 1]}</p>
        </div>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-strong">
          {caption}
        </span>
      </header>
      <svg
        className="h-24 w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-labelledby={`${gradientId}-title`}
      >
        <title id={`${gradientId}-title`}>{`${title} ${caption}`}</title>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity={0.8} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          points={`${points} ${width},${height} 0,${height}`}
          fill={fillColor}
          opacity={0.6}
        />
      </svg>
    </section>
  );
};
