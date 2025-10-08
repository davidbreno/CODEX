import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts';

export interface DonutSlice {
  name: string;
  value: number;
  color?: string;
}

export interface DonutBreakdownChartProps {
  title?: string;
  caption?: string;
  data: DonutSlice[];
  /** Valor exibido no centro (por exemplo, total). */
  centerLabel?: string;
  /** Texto do rodapé explicativo. */
  helperText?: string;
  defaultColorPalette?: string[];
}

const tooltipStyles: CSSProperties = {
  background: '#0f172a',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  borderRadius: 12,
  padding: '10px 12px',
  color: '#f1f5f9',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.35)'
};

export function DonutBreakdownChart({
  title,
  caption,
  data,
  centerLabel,
  helperText,
  defaultColorPalette = ['#ef4444', '#f97316', '#facc15', '#22d3ee', '#a855f7']
}: DonutBreakdownChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
      <div className="relative flex h-72 flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              cornerRadius={18}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              activeIndex={activeIndex ?? undefined}
              activeShape={(props) => (
                <Sector
                  {...props}
                  outerRadius={(props.outerRadius ?? 110) + 6}
                  cornerRadius={18}
                />
              )}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`slice-${entry.name}-${index}`}
                  fill={entry.color ?? defaultColorPalette[index % defaultColorPalette.length]}
                  stroke="rgba(15, 23, 42, 0.9)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyles}
              formatter={(value: number, name: string) => [`${value}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xs uppercase tracking-widest text-white/50">Total</p>
            <p className="text-2xl font-semibold text-white">{centerLabel}</p>
          </div>
        )}
      </div>
      {helperText && <p className="text-sm text-white/60">{helperText}</p>}
    </section>
  );
}
