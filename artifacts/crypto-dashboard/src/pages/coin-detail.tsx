import { ArrowLeft, CalendarDays, CircleDollarSign, ExternalLink, LineChart, RefreshCw, Volume2 } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { CoinMark } from '@/components/coin-mark';
import { MarketShell } from '@/components/market-shell';
import { MarketError, MarketSkeleton } from '@/components/market-states';
import { PriceChart } from '@/components/price-chart';
import { ChangeValue } from '@/components/metric-card';
import { useCoinChart } from '@/hooks/use-coin-chart';
import { useMarketData } from '@/hooks/use-market-data';

const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 8 });
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 });

export default function CoinDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { coins, isLoading: isMarketLoading, error: marketError, refetch: refetchMarket } = useMarketData();
  const { points, isLoading: isChartLoading, error: chartError, refetch: refetchChart } = useCoinChart(id);
  const coin = coins.find((item) => item.id === id);
  const first = points[0]?.price;
  const last = points[points.length - 1]?.price;
  const periodChange = first && last ? ((last - first) / first) * 100 : null;

  return (
    <MarketShell>
      <div className="min-h-[calc(100dvh-68px)] bg-background">
        <div className="mx-auto max-w-[1180px] px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
          <Link href="/" data-testid="link-back-market" className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft size={15} /> Back to market overview</Link>
          {marketError && !isMarketLoading ? <MarketError error={marketError} onRetry={() => void refetchMarket()} label="asset details" /> : isMarketLoading ? (
            <div className="space-y-6"><div className="h-28 animate-pulse rounded-xl bg-muted" /><div className="h-[390px] animate-pulse rounded-xl bg-muted" /></div>
          ) : !coin ? (
            <MarketError error={{ message: 'This asset is not in the current top-10 market view.', isRateLimited: false }} onRetry={() => void refetchMarket()} label="asset" />
          ) : (
            <>
              <section className="animate-rise-in flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
                <div className="flex items-center gap-4">
                  <CoinMark image={coin.image} name={coin.name} symbol={coin.symbol} size="lg" />
                  <div><div className="flex items-center gap-2"><h1 data-testid="text-detail-name" className="text-3xl font-extrabold tracking-[-0.04em] text-foreground">{coin.name}</h1><span className="rounded bg-muted px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{coin.symbol}</span></div><p className="mt-2 text-sm text-muted-foreground">7-day price movement</p></div>
                </div>
                <div className="sm:text-right"><p data-testid="text-detail-price" className="font-mono text-2xl font-medium tracking-tight text-foreground">{price.format(coin.current_price)}</p><div className="mt-2 flex items-center gap-3 sm:justify-end"><ChangeValue value={coin.price_change_percentage_24h} /><span className="text-xs text-muted-foreground">24h</span></div></div>
              </section>

              <section className="animate-rise-in mt-7 grid gap-4 sm:grid-cols-3" style={{ animationDelay: '80ms' }}>
                <DetailStat icon={CircleDollarSign} label="Market cap" value={money.format(coin.market_cap)} />
                <DetailStat icon={Volume2} label="24h volume" value={money.format(coin.total_volume)} />
                <DetailStat icon={CalendarDays} label="7-day return" value={periodChange === null ? '—' : `${periodChange >= 0 ? '+' : ''}${periodChange.toFixed(2)}%`} positive={periodChange !== null && periodChange >= 0} />
              </section>

              <section className="animate-rise-in mt-7 rounded-xl border border-card-border bg-card p-4 shadow-sm shadow-slate-900/5 sm:p-6" style={{ animationDelay: '140ms' }}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><LineChart size={16} className="text-primary" /><h2 className="text-sm font-bold text-foreground">Price history</h2><span className="rounded bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">7D</span></div><button type="button" onClick={() => void refetchChart()} disabled={isChartLoading} data-testid="button-refresh-chart" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RefreshCw size={13} className={isChartLoading ? 'animate-spin' : ''} /> Refresh chart</button></div>
                {isChartLoading ? <div className="h-[300px] animate-pulse rounded-lg bg-muted sm:h-[360px]" /> : chartError ? <MarketError error={chartError} onRetry={() => void refetchChart()} label="price history" /> : points.length ? <PriceChart points={points} /> : <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No chart points available for this asset.</p>}
              </section>
              <p className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground"><ExternalLink size={12} /> Data provided by CoinGecko · Prices may be delayed</p>
            </>
          )}
        </div>
      </div>
    </MarketShell>
  );
}

function DetailStat({ icon: Icon, label, value, positive }: { icon: typeof CircleDollarSign; label: string; value: string; positive?: boolean }) {
  return <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary"><Icon size={16} /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{label}</p><p className={`mt-1 font-mono text-sm font-medium ${positive === undefined ? 'text-foreground' : positive ? 'text-primary' : 'text-destructive'}`}>{value}</p></div></div>;
}
