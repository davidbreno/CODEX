import { useId } from 'react';
import type { CSSProperties } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface SparklinePoint {
  label: string;
  value: number;
}

export interface SparklineTrendChartProps {
  data: SparklinePoint[];
  title?: string;
  caption?: string;
  lineColor?: string;
  areaColor?: string;
}

const tooltipStyles: CSSProperties = {
  background: '#0f172a',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  borderRadius: 12,
  padding: '6px 10px',
  color: '#f1f5f9',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.35)'
};

export function SparklineTrendChart({
  data,
  title,
  caption,
  lineColor = '#22d3ee',
  areaColor
}: SparklineTrendChartProps) {
  const fillColor = areaColor ?? `${lineColor}33`;
  const gradientId = `sparkline-${useId()}`;

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-aurora-end/20">
      {(title || caption) && (
        <header className="flex flex-wrap items-center gap-3">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {caption && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">{caption}</span>
          )}
        </header>
      )}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.9} />
                <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={tooltipStyles}
              cursor={{ strokeDasharray: '4 8', strokeWidth: 2 }}
              formatter={(value: number) => [value, 'Valor']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              dot={{ r: 4, stroke: '#0f172a', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
