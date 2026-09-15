import { useCallback, useEffect, useState } from 'react';
import { getGlobalMarket, getMarketCoins, type Coin, type GlobalMarket, type MarketApiError } from '@/lib/market-api';

export function useMarketData({ enabled = true }: { enabled?: boolean } = {}) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalMarket, setGlobalMarket] = useState<GlobalMarket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<MarketApiError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextCoins, nextGlobal] = await Promise.all([getMarketCoins(), getGlobalMarket()]);
      setCoins(nextCoins);
      setGlobalMarket(nextGlobal);
      setLastUpdated(new Date());
    } catch (nextError) {
      setError(nextError as MarketApiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    void load();
  }, [enabled, load]);

  return { coins, globalMarket, isLoading, error, lastUpdated, refetch: load };
}
