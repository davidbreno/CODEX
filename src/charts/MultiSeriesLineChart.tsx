import type { CSSProperties } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export interface LineDescriptor {
  dataKey: string;
  name: string;
  color: string;
  /** controla o estilo do traçado ("solid", "dashed" etc). */
  strokeDasharray?: string;
}

export interface MultiSeriesLineChartProps<T extends Record<string, unknown>> {
  data: T[];
  lines: LineDescriptor[];
  xKey: keyof T & string;
  title?: string;
  caption?: string;
  gridColor?: string;
}

const tooltipStyles: CSSProperties = {
  background: '#0f172a',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  borderRadius: 12,
  padding: '10px 12px',
  color: '#f8fafc',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.35)'
};

export function MultiSeriesLineChart<T extends Record<string, unknown>>({
  data,
  lines,
  xKey,
  title,
  caption,
  gridColor = 'rgba(148, 163, 184, 0.16)'
}: MultiSeriesLineChartProps<T>) {
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
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 12" />
            <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fill: '#cbd5f5', fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#cbd5f5', fontSize: 12 }}
              width={48}
            />
            <Tooltip contentStyle={tooltipStyles} cursor={{ strokeDasharray: '4 8', strokeWidth: 2 }} />
            <Legend
              wrapperStyle={{ color: '#f8fafc' }}
              iconType="circle"
              formatter={(value: string) => <span className="text-sm text-white/80">{value}</span>}
            />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={3}
                strokeDasharray={line.strokeDasharray}
                dot={{ r: 5, stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
