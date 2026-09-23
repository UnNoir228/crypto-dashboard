import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '@/lib/market-api';

const shortDate = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const compactPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export function PriceChart({ points }: { points: ChartPoint[] }) {
  const chartData = useMemo(() => points.filter((point) => Number.isFinite(point.price)).map((point) => ({
    ...point,
    label: shortDate.format(new Date(point.timestamp)),
  })), [points]);
  const prices = chartData.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const padding = (max - min) * 0.12 || max * 0.01;
  return (
    <div className="h-[300px] w-full sm:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 14, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(168 74% 48%)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="hsl(168 74% 48%)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(220 16% 20% / .12)" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'hsl(217 14% 52%)', fontSize: 11 }} minTickGap={28} />
          <YAxis domain={[min - padding, max + padding]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(217 14% 52%)', fontSize: 11 }} tickFormatter={(value: number) => compactPrice.format(value)} width={68} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="price" stroke="hsl(168 74% 48%)" strokeWidth={2.5} fill="url(#price-fill)" activeDot={{ r: 4, fill: 'hsl(168 74% 48%)', stroke: 'hsl(222 24% 10%)', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: ChartPoint & { label: string } }> }) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  return <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{new Date(point.payload.timestamp).toLocaleString()}</p><p className="mt-1 font-mono text-sm font-bold text-foreground">{compactPrice.format(point.value)}</p></div>;
}
