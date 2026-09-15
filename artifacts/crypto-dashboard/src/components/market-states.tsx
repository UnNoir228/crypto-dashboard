import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { MarketApiError } from '@/lib/market-api';

export function MarketError({ error, onRetry, label = 'market data' }: { error: MarketApiError; onRetry: () => void; label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle size={20} />
      </span>
      <h2 className="text-sm font-bold text-foreground">Could not load {label}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{error.message}</p>
      <button
        type="button"
        onClick={onRetry}
        data-testid={`button-retry-${label.replace(/\s+/g, '-')}`}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RefreshCw size={15} /> Try again
      </button>
    </div>
  );
}

export function MarketSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-card">
      <div className="hidden h-12 items-center gap-8 border-b border-border px-6 md:flex">
        {[100, 140, 120, 100, 110].map((width, index) => <span key={`${width}-${index}`} className="skeleton-bar h-2 rounded bg-muted" style={{ width }} />)}
      </div>
      <div className="space-y-1 p-3 md:p-0">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 border-b border-border/60 px-3 py-4 md:px-6">
            <span className="h-2 w-5 rounded bg-muted" />
            <span className="h-10 w-10 rounded-full bg-muted" />
            <span className="skeleton-bar h-3 w-36 rounded bg-muted" />
            <span className="ml-auto skeleton-bar h-3 w-24 rounded bg-muted" />
            <span className="hidden skeleton-bar h-3 w-20 rounded bg-muted sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
