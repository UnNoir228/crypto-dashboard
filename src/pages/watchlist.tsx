import { Bookmark, ChevronRight, Star } from 'lucide-react';
import { Link } from 'wouter';
import { CoinMark } from '@/components/coin-mark';
import { MarketError, MarketSkeleton } from '@/components/market-states';
import { MarketShell } from '@/components/market-shell';
import { ChangeValue } from '@/components/metric-card';
import { useMarketData } from '@/hooks/use-market-data';
import { useWatchlist } from '@/hooks/use-watchlist';
import type { Coin } from '@/lib/market-api';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2, notation: 'compact' });
const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 8 });

export default function WatchlistPage() {
  const { ids } = useWatchlist();
  const { coins, isLoading, error, refetch } = useMarketData({ enabled: ids.length > 0 });
  const savedCoins = ids.map((id) => coins.find((coin) => coin.id === id)).filter((coin): coin is Coin => Boolean(coin));

  return (
    <MarketShell>
      <div className="min-h-[calc(100dvh-68px)] bg-background">
        <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-7 lg:px-10 lg:py-11">
          <section className="animate-rise-in border-b border-border pb-8">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-7 bg-primary" /> Personal list
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-4xl">Your watchlist.</h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Keep the assets you want to check first in one focused view.</p>
              </div>
              <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground">{savedCoins.length} saved</span>
            </div>
          </section>

          <section className="mt-8">
            {isLoading ? <MarketSkeleton /> : error ? <MarketError error={error} onRetry={() => void refetch()} label="watchlist data" /> : savedCoins.length ? (
              <WatchlistTable coins={savedCoins} />
            ) : (
              <EmptyWatchlist />
            )}
          </section>
        </div>
      </div>
    </MarketShell>
  );
}

function WatchlistTable({ coins }: { coins: Coin[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-card shadow-sm shadow-slate-900/5">
      <div className="hidden grid-cols-[minmax(190px,1.7fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(125px,1fr)_2rem] items-center gap-4 border-b border-border bg-muted/35 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground md:grid">
        <span>Asset</span><span>Last price</span><span>24h change</span><span>Market cap</span><span />
      </div>
      <div className="divide-y divide-border/70">
        {coins.map((coin) => (
          <Link key={coin.id} href={`/coin/${coin.id}`} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 transition-colors hover:bg-primary/[0.035] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:grid-cols-[minmax(190px,1.7fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(125px,1fr)_2rem] md:gap-4 md:px-6">
            <span className="flex min-w-0 items-center gap-3">
              <CoinMark image={coin.image} name={coin.name} symbol={coin.symbol} size="sm" />
              <span className="min-w-0"><span className="block truncate text-sm font-bold text-foreground group-hover:text-primary">{coin.name}</span><span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{coin.symbol}</span></span>
            </span>
            <span className="text-right font-mono text-sm font-medium tabular-nums text-foreground md:text-left">{price.format(coin.current_price)}</span>
            <span className="hidden md:block"><ChangeValue value={coin.price_change_percentage_24h} /></span>
            <span className="hidden font-mono text-sm tabular-nums text-muted-foreground md:block">{money.format(coin.market_cap)}</span>
            <span className="hidden text-muted-foreground transition-transform group-hover:translate-x-0.5 md:block"><ChevronRight size={16} /></span>
            <span className="col-start-1 row-start-2 flex items-center gap-3 md:hidden"><ChangeValue value={coin.price_change_percentage_24h} /><span className="text-xs text-muted-foreground">{money.format(coin.market_cap)} cap</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function EmptyWatchlist() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Bookmark size={20} /></span>
      <h2 className="text-base font-bold text-foreground">Your watchlist is empty</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Use the star beside any market leader, or open a coin and save it from its detail page.</p>
      <Link href="/" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Star size={15} /> Browse market</Link>
    </div>
  );
}