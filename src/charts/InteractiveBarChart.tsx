import type { CSSProperties } from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export interface InteractiveBarDatum {
  label: string;
  value: number;
  color?: string;
  [key: string]: string | number | undefined;
}

export interface InteractiveBarChartProps {
  title?: string;
  data: InteractiveBarDatum[];
  /**
   * Cor padrão (hex, rgb, hsl etc). Caso não seja informada, usamos um tom laranja semelhante ao layout base.
   */
  defaultColor?: string;
  /**
   * Personalize a cor da grade ou deixe `undefined` para usar o padrão suave.
   */
  gridColor?: string;
  /**
   * Texto opcional exibido ao lado do título (ex.: período).
   */
  caption?: string;
}

const tooltipStyles: CSSProperties = {
  background: '#0f172a',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  borderRadius: 12,
  padding: '10px 12px',
  color: '#f1f5f9',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.35)'
};

export function InteractiveBarChart({
  title,
  data,
  defaultColor = '#f97316',
  gridColor = 'rgba(148, 163, 184, 0.16)',
  caption
}: InteractiveBarChartProps) {
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
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} barSize={32}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 12" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#cbd5f5', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#cbd5f5', fontSize: 12 }}
              width={48}
            />
            <Tooltip
              cursor={{ opacity: 0.12 }}
              contentStyle={tooltipStyles}
              formatter={(value: number) => [value, 'Valor']}
              labelClassName="text-sm font-medium text-white"
            />
            <Bar dataKey="value" radius={[12, 12, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`bar-${entry.label}-${index}`} fill={entry.color ?? defaultColor} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
