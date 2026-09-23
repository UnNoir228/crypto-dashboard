import { Clock3, RefreshCw, TrendingUp } from 'lucide-react';
import { MarketShell } from '@/components/market-shell';
import { MarketError, MarketSkeleton } from '@/components/market-states';
import { MarketTable } from '@/components/market-table';
import { MetricCard } from '@/components/metric-card';
import { useMarketData } from '@/hooks/use-market-data';

const compactMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 });
const formatTime = (date: Date | null) => date ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date) : '—';

export default function DashboardPage() {
  const { coins, globalMarket, isLoading, error, lastUpdated, refetch } = useMarketData();
  const gainers = coins.filter((coin) => (coin.price_change_percentage_24h ?? 0) > 0).length;

  return (
    <MarketShell>
      <div className="market-grid min-h-[calc(100dvh-68px)]">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-7 lg:px-10 lg:py-11">
          <section className="animate-rise-in flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-7 bg-primary" /> Daily market pulse</div>
              <h1 className="max-w-xl text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-4xl">Read the market<br /><span className="text-muted-foreground">at a glance.</span></h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">A focused view of the assets moving the most capital today. Pick a coin to inspect its last seven days.</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden text-right sm:block"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Feed timestamp</p><p data-testid="text-last-updated" className="mt-1 flex items-center justify-end gap-1.5 font-mono text-xs text-foreground"><Clock3 size={13} className="text-primary" /> {formatTime(lastUpdated)}</p></div>
              <button type="button" onClick={() => void refetch()} disabled={isLoading} data-testid="button-refresh-market" className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh</button>
            </div>
          </section>

          {error && !coins.length ? <div className="mt-8"><MarketError error={error} onRetry={() => void refetch()} /></div> : (
            <>
              <section className="animate-rise-in mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '70ms' }}>
                <MetricCard icon="cap" label="Total market cap" value={globalMarket ? compactMoney.format(globalMarket.total_market_cap.usd) : '—'} detail="Across tracked assets" />
                <MetricCard icon="volume" label="24h volume" value={globalMarket ? compactMoney.format(globalMarket.total_volume.usd) : '—'} detail="Rolling 24-hour flow" tone="sky" />
                <MetricCard icon="btc" label="Bitcoin dominance" value={globalMarket ? `${globalMarket.market_cap_percentage.btc.toFixed(1)}%` : '—'} detail="Share of total cap" tone="amber" />
                <MetricCard icon="pulse" label="Assets advancing" value={coins.length ? `${gainers} / ${coins.length}` : '—'} detail="Positive over 24 hours" />
              </section>

              <section className="animate-rise-in mt-9" style={{ animationDelay: '130ms' }}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div><h2 className="text-lg font-extrabold tracking-tight text-foreground">Market leaders</h2><p className="mt-1 text-xs text-muted-foreground">Top 10 by current market capitalization</p></div>
                  <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"><TrendingUp size={14} className="text-primary" /> Live ranking</span>
                </div>
                {isLoading ? <MarketSkeleton /> : coins.length ? <MarketTable coins={coins} /> : <MarketError error={{ message: 'No assets were returned by the market feed.', isRateLimited: false }} onRetry={() => void refetch()} label="assets" />}
              </section>
            </>
          )}
        </div>
      </div>
    </MarketShell>
  );
}
