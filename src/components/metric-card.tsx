import { ArrowDownRight, ArrowUpRight, BarChart3, CircleDollarSign, Gauge, Layers3 } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  tone?: 'mint' | 'amber' | 'sky';
  icon: 'cap' | 'volume' | 'btc' | 'pulse';
}

const icons = { cap: CircleDollarSign, volume: BarChart3, btc: Layers3, pulse: Gauge };
const tones = {
  mint: 'bg-primary/10 text-primary',
  amber: 'bg-accent/10 text-accent',
  sky: 'bg-sky-400/10 text-sky-300',
};

export function MetricCard({ label, value, detail, tone = 'mint', icon }: MetricCardProps) {
  const Icon = icons[icon];
  return (
    <div className="group relative overflow-hidden rounded-xl border border-card-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <p data-testid={`metric-value-${icon}`} className="mt-3 font-mono text-xl font-medium tracking-tight text-foreground">{value}</p>
          {detail && <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><ArrowUpRight size={12} className="text-primary" />{detail}</p>}
        </div>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}><Icon size={17} /></span>
      </div>
    </div>
  );
}

export function ChangeValue({ value }: { value: number | null }) {
  if (value === null || Number.isNaN(value)) return <span className="font-mono text-sm text-muted-foreground">—</span>;
  const positive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-sm font-medium ${positive ? 'text-primary' : 'text-destructive'}`}>
      {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}
