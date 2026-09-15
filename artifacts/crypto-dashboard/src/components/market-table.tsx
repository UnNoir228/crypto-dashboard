import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'wouter';
import { CoinMark } from '@/components/coin-mark';
import { ChangeValue } from '@/components/metric-card';
import type { Coin } from '@/lib/market-api';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2, notation: 'compact' });
const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 8 });

export function MarketTable({ coins }: { coins: Coin[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-card shadow-sm shadow-slate-900/5">
      <div className="hidden grid-cols-[3rem_minmax(190px,1.7fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(125px,1fr)_2rem] items-center gap-4 border-b border-border bg-muted/35 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground md:grid">
        <span>#</span><span>Asset</span><span>Last price</span><span>24h change</span><span>Market cap</span><span />
      </div>
      <div className="divide-y divide-border/70">
        {coins.map((coin, index) => (
          <Link
            href={`/coin/${coin.id}`}
            key={coin.id}
            data-testid={`link-coin-${coin.id}`}
            className="group grid grid-cols-[1.7rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 transition-colors hover:bg-primary/[0.035] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:grid-cols-[3rem_minmax(190px,1.7fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(125px,1fr)_2rem] md:gap-4 md:px-6"
          >
            <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            <span className="flex min-w-0 items-center gap-3">
              <CoinMark image={coin.image} name={coin.name} symbol={coin.symbol} size="sm" />
              <span className="min-w-0">
                <span data-testid={`text-coin-name-${coin.id}`} className="block truncate text-sm font-bold text-foreground group-hover:text-primary">{coin.name}</span>
                <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{coin.symbol}</span>
              </span>
            </span>
            <span data-testid={`text-price-${coin.id}`} className="text-right font-mono text-sm font-medium tabular-nums text-foreground md:text-left">{price.format(coin.current_price)}</span>
            <span className="hidden md:block"><ChangeValue value={coin.price_change_percentage_24h} /></span>
            <span className="hidden font-mono text-sm tabular-nums text-muted-foreground md:block">{money.format(coin.market_cap)}</span>
            <span className="hidden text-muted-foreground transition-transform group-hover:translate-x-0.5 md:block"><ChevronRight size={16} /></span>
            <span className="col-start-2 row-start-2 flex items-center gap-3 md:hidden">
              <ChangeValue value={coin.price_change_percentage_24h} />
              <span className="text-xs text-muted-foreground">{money.format(coin.market_cap)} cap</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3 md:px-6">
        <span className="text-xs text-muted-foreground">Showing the top 10 assets by market cap</span>
        <span className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:flex"><Star size={12} /> Select a row to inspect</span>
      </div>
    </div>
  );
}
